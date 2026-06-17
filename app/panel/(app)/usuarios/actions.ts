"use server";

import { revalidatePath } from "next/cache";
import { requireRol } from "@/lib/auth/guards";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/lib/panel/resultado";

type Rol = "tienda" | "admin" | "superadmin";
type Responsabilidad = "estaticos" | "dinamicos" | null;

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

export type UsuarioItem = {
  userId: string;
  email: string;
  nombre: string | null;
  rol: Rol;
  responsabilidad: Responsabilidad;
  tiendaSlug: string | null;
  tiendaNombre: string | null;
};

/** ADMIN+. Lista usuarios con su email (Auth) + rol/tienda (perfiles). */
export async function listarUsuarios(): Promise<ActionResult<UsuarioItem[]>> {
  try {
    await requireRol("admin");
    const admin = createServiceRoleClient();

    const { data: lista, error } = await admin.auth.admin.listUsers({ perPage: 200 });
    if (error) return fail(error.message);

    const { data: perfiles } = await admin
      .from("perfiles")
      .select("id, rol, tienda_id, nombre, responsabilidad");
    const { data: tiendas } = await admin.from("tiendas").select("id, slug, nombre");

    const perfilPorId = new Map((perfiles ?? []).map((p) => [p.id, p]));
    const tiendaPorId = new Map((tiendas ?? []).map((t) => [t.id, t]));

    const usuarios: UsuarioItem[] = lista.users.map((u) => {
      const p = perfilPorId.get(u.id);
      const t = p?.tienda_id ? tiendaPorId.get(p.tienda_id) : null;
      return {
        userId: u.id,
        email: u.email ?? "—",
        nombre: p?.nombre ?? null,
        rol: (p?.rol as Rol) ?? "tienda",
        responsabilidad: (p?.responsabilidad as Responsabilidad) ?? null,
        tiendaSlug: t?.slug ?? null,
        tiendaNombre: t?.nombre ?? null,
      };
    });
    return { ok: true, data: usuarios };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}

/** ADMIN+. Crea usuario en Auth; el trigger materializa el perfil. */
export async function crearUsuario(input: {
  email: string;
  password: string;
  nombre?: string | null;
  rol: Rol;
  tiendaSlug?: string | null;
}): Promise<ActionResult<{ userId: string }>> {
  try {
    const { rol: rolCaller } = await requireRol("admin");
    // Solo superadmin puede crear superadmins.
    if (input.rol === "superadmin" && rolCaller !== "superadmin") {
      return fail("Solo un superadmin puede crear otro superadmin.");
    }
    if (input.rol === "tienda" && !input.tiendaSlug) {
      return fail("Una cuenta de tienda necesita una tienda asignada.");
    }
    const admin = createServiceRoleClient();

    let tiendaNombre: string | undefined;
    if (input.tiendaSlug) {
      const { data: t } = await admin
        .from("tiendas")
        .select("nombre")
        .eq("slug", input.tiendaSlug)
        .maybeSingle();
      tiendaNombre = t?.nombre;
    }

    const nombre = input.nombre?.trim() || null;
    const { data, error } = await admin.auth.admin.createUser({
      email: input.email.trim(),
      password: input.password,
      email_confirm: true,
      user_metadata: {
        rol: input.rol,
        nombre,
        tienda_slug: input.tiendaSlug ?? null,
        tienda: tiendaNombre ?? "American Outlet",
      },
    });
    if (error) return fail(error.message);
    // El trigger materializa el perfil con el nombre; lo reforzamos por si acaso.
    if (nombre) {
      await admin.from("perfiles").update({ nombre }).eq("id", data.user.id);
    }
    revalidatePath("/panel/usuarios");
    return { ok: true, data: { userId: data.user.id } };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}

/** ADMIN+. Cambia rol, nombre, tienda y/o responsabilidad de contenido. */
export async function actualizarUsuario(input: {
  userId: string;
  rol?: Rol;
  nombre?: string | null;
  responsabilidad?: Responsabilidad;
  tiendaSlug?: string | null;
}): Promise<ActionResult> {
  try {
    const { userId: callerId, rol: rolCaller } = await requireRol("admin");
    const admin = createServiceRoleClient();

    // Resolver perfil actual.
    const { data: actual } = await admin
      .from("perfiles")
      .select("rol")
      .eq("id", input.userId)
      .maybeSingle();
    const rolActual = (actual?.rol as Rol) ?? "tienda";

    // Solo superadmin puede otorgar/quitar el rol superadmin.
    if (
      (input.rol === "superadmin" || rolActual === "superadmin") &&
      rolCaller !== "superadmin"
    ) {
      return fail("Solo un superadmin puede modificar el rol superadmin.");
    }
    // No degradar al último superadmin.
    if (rolActual === "superadmin" && input.rol && input.rol !== "superadmin") {
      const { count } = await admin
        .from("perfiles")
        .select("id", { count: "exact", head: true })
        .eq("rol", "superadmin");
      if ((count ?? 0) <= 1) return fail("No podés degradar al último superadmin.");
    }

    const patch: {
      rol?: Rol;
      nombre?: string | null;
      responsabilidad?: Responsabilidad;
      tienda_id?: string | null;
    } = {};
    if (input.rol) patch.rol = input.rol;
    if (input.nombre !== undefined) patch.nombre = input.nombre?.trim() || null;
    if (input.responsabilidad !== undefined)
      patch.responsabilidad = input.responsabilidad;
    if (input.tiendaSlug !== undefined) {
      if (input.tiendaSlug === null) patch.tienda_id = null;
      else {
        const { data: t } = await admin
          .from("tiendas")
          .select("id")
          .eq("slug", input.tiendaSlug)
          .maybeSingle();
        patch.tienda_id = t?.id ?? null;
      }
    }

    const { error } = await admin.from("perfiles").update(patch).eq("id", input.userId);
    if (error) return fail(error.message);
    // callerId se usa solo como contexto; el guard ya validó la sesión.
    void callerId;
    revalidatePath("/panel/usuarios");
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}

/** ADMIN+. Elimina un usuario de Auth (cascada borra el perfil). */
export async function eliminarUsuario(input: {
  userId: string;
}): Promise<ActionResult> {
  try {
    const { userId: callerId } = await requireRol("admin");
    if (input.userId === callerId) return fail("No podés eliminar tu propia cuenta.");

    const admin = createServiceRoleClient();
    const { data: p } = await admin
      .from("perfiles")
      .select("rol")
      .eq("id", input.userId)
      .maybeSingle();
    if ((p?.rol as Rol) === "superadmin") {
      const { count } = await admin
        .from("perfiles")
        .select("id", { count: "exact", head: true })
        .eq("rol", "superadmin");
      if ((count ?? 0) <= 1) return fail("No podés eliminar al último superadmin.");
    }

    const { error } = await admin.auth.admin.deleteUser(input.userId);
    if (error) return fail(error.message);
    revalidatePath("/panel/usuarios");
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}
