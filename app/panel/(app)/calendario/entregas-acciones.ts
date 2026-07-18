"use server";

import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { requireSesion } from "@/lib/auth/guards";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { cloudinary } from "@/lib/cloudinary";
import type { ActionResult } from "@/lib/panel/resultado";

const CARPETA = "american-outlet/entregas-dia";

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

/**
 * Sube una imagen entregada a un día del calendario. La optimiza a webp liviano,
 * la guarda en Cloudinary y la registra como entrega completada (con quién/cuándo).
 * Escribe el audit interno. La puede subir cualquiera que vea el día (un usuario
 * de tienda solo en el calendario de SU tienda).
 */
export async function subirEntregaDia(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    const { userId, rol } = await requireSesion();
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return fail("Faltan credenciales de Cloudinary en el servidor.");
    }

    const diaId = String(formData.get("diaId") || "");
    const nota = ((formData.get("nota") as string) || "").trim() || null;
    const file = formData.get("file");
    if (!diaId) return fail("Falta el día.");
    if (!(file instanceof File) || file.size === 0) return fail("Subí una imagen.");
    if (file.size > 15 * 1024 * 1024)
      return fail("La imagen es muy grande (máx. 15 MB).");

    const admin = createServiceRoleClient();

    // Perfil (nombre + tienda) + tienda del día, para validar el permiso.
    const [{ data: perfil }, { data: dia }] = await Promise.all([
      admin.from("perfiles").select("nombre, tienda_id").eq("id", userId).maybeSingle(),
      admin.from("dias").select("id, meses(tienda_id)").eq("id", diaId).maybeSingle(),
    ]);
    if (!dia) return fail("El día no existe.");
    const diaTiendaId =
      (dia as { meses?: { tienda_id: string } | null }).meses?.tienda_id ?? null;
    if (rol === "tienda" && perfil?.tienda_id && perfil.tienda_id !== diaTiendaId) {
      return fail("No podés entregar en el calendario de otra tienda.");
    }

    // Optimizar a webp liviano (máx. 1600px, respetando orientación).
    let webp: Buffer;
    try {
      webp = await sharp(Buffer.from(await file.arrayBuffer()))
        .rotate()
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
    } catch {
      return fail("No se pudo procesar la imagen. Probá con un JPG o PNG válido.");
    }

    const publicId = `entrega-dia-${Date.now()}`;
    const subida = await cloudinary.uploader.upload(
      `data:image/webp;base64,${webp.toString("base64")}`,
      { folder: CARPETA, public_id: publicId, overwrite: false, resource_type: "image" },
    );

    const { data: ent, error } = await admin
      .from("entregas_dia")
      .insert({
        dia_id: diaId,
        url: subida.secure_url,
        cloudinary_public_id: subida.public_id,
        formato: "webp",
        ancho: subida.width ?? null,
        alto: subida.height ?? null,
        bytes: webp.byteLength,
        nota,
        subido_por_id: userId,
        subido_por_nombre: perfil?.nombre ?? null,
      })
      .select("id")
      .single();
    if (error || !ent) {
      await cloudinary.uploader.destroy(subida.public_id).catch(() => {});
      return fail(error?.message ?? "No se pudo guardar la entrega.");
    }

    // Audit interno (append-only, invisible en el panel).
    await admin.from("entregas_dia_auditoria").insert({
      entrega_dia_id: ent.id,
      dia_id: diaId,
      accion: "crear",
      url: subida.secure_url,
      cloudinary_public_id: subida.public_id,
      subido_por_id: userId,
      actor_id: userId,
      actor_nombre: perfil?.nombre ?? null,
      actor_rol: rol,
    });

    revalidatePath("/panel/calendario");
    return { ok: true, data: { id: ent.id } };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}

/**
 * Borra una entrega. Inmutable: solo quien la subió o un superadmin. Registra el
 * borrado en el audit interno (el registro queda aunque la entrega se elimine).
 */
export async function borrarEntregaDia(input: {
  entregaId: string;
}): Promise<ActionResult> {
  try {
    const { userId, rol } = await requireSesion();
    const admin = createServiceRoleClient();

    const { data: ent } = await admin
      .from("entregas_dia")
      .select("*")
      .eq("id", input.entregaId)
      .maybeSingle();
    if (!ent) return fail("La entrega no existe.");

    if (ent.subido_por_id !== userId && rol !== "superadmin") {
      return fail("Solo quien la subió o un superadmin puede borrarla.");
    }

    const { data: perfil } = await admin
      .from("perfiles")
      .select("nombre")
      .eq("id", userId)
      .maybeSingle();

    if (ent.cloudinary_public_id) {
      await cloudinary.uploader.destroy(ent.cloudinary_public_id).catch(() => {});
    }
    const { error } = await admin.from("entregas_dia").delete().eq("id", input.entregaId);
    if (error) return fail(error.message);

    await admin.from("entregas_dia_auditoria").insert({
      entrega_dia_id: ent.id,
      dia_id: ent.dia_id,
      accion: "borrar",
      url: ent.url,
      cloudinary_public_id: ent.cloudinary_public_id,
      subido_por_id: ent.subido_por_id,
      actor_id: userId,
      actor_nombre: perfil?.nombre ?? null,
      actor_rol: rol,
    });

    revalidatePath("/panel/calendario");
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}
