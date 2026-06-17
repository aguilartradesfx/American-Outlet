"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRol } from "@/lib/auth/guards";
import type { ActionResult } from "@/lib/panel/resultado";

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** ADMIN+. Crea una tienda (INSERT vía RLS tiendas_insert). */
export async function crearTienda(input: {
  nombre: string;
  slug?: string;
  orden?: number;
}): Promise<ActionResult<{ id: string }>> {
  try {
    await requireRol("admin");
    const supabase = await createClient();
    const slug = (input.slug?.trim() || slugify(input.nombre)).trim();
    if (!slug) return fail("Nombre inválido.");
    const { data, error } = await supabase
      .from("tiendas")
      .insert({ nombre: input.nombre.trim(), slug, orden: input.orden ?? 0 })
      .select("id")
      .single();
    if (error) return fail(error.message);
    revalidatePath("/panel/tiendas");
    return { ok: true, data: { id: data.id } };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}

/** ADMIN+. Actualiza nombre / activa / orden. */
export async function actualizarTienda(input: {
  id: string;
  nombre?: string;
  activa?: boolean;
  orden?: number;
}): Promise<ActionResult> {
  try {
    await requireRol("admin");
    const supabase = await createClient();
    const { error } = await supabase
      .from("tiendas")
      .update({
        nombre: input.nombre?.trim(),
        activa: input.activa,
        orden: input.orden,
      })
      .eq("id", input.id);
    if (error) return fail(error.message);
    revalidatePath("/panel/tiendas");
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}

/**
 * ADMIN+. Elimina una tienda si no tiene usuarios; si los tiene, la archiva
 * (activa=false) en lugar de borrar.
 */
export async function eliminarTienda(input: {
  id: string;
}): Promise<ActionResult<{ archivada: boolean }>> {
  try {
    await requireRol("admin");
    const supabase = await createClient();
    const { count } = await supabase
      .from("perfiles")
      .select("id", { count: "exact", head: true })
      .eq("tienda_id", input.id);

    if ((count ?? 0) > 0) {
      const { error } = await supabase
        .from("tiendas")
        .update({ activa: false })
        .eq("id", input.id);
      if (error) return fail(error.message);
      revalidatePath("/panel/tiendas");
      return { ok: true, data: { archivada: true } };
    }

    const { error } = await supabase.from("tiendas").delete().eq("id", input.id);
    if (error) return fail(error.message);
    revalidatePath("/panel/tiendas");
    return { ok: true, data: { archivada: false } };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}
