"use server";

import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { requireRol } from "@/lib/auth/guards";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { cloudinary } from "@/lib/cloudinary";
import type { ActionResult } from "@/lib/panel/resultado";

const CARPETA = "american-outlet/entregas";
/** Días que vive una imagen sin que nadie la descargue. */
const DIAS_SIN_DESCARGA = 14;

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

/**
 * SUPERADMIN. Sube una imagen para repartir a una o varias tiendas: la optimiza
 * (JPEG liviano, máx. 1080×1920), la guarda en Cloudinary y crea la entrega con
 * un destino por tienda. La tienda la descarga; a los 3 días de descargada (o a
 * los 14 sin descargar) el cron la borra.
 */
export async function subirEntrega(
  formData: FormData,
): Promise<ActionResult<{ entregaId: string }>> {
  try {
    const { userId } = await requireRol("superadmin");
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return fail("Faltan credenciales de Cloudinary en el servidor.");
    }

    const nota = ((formData.get("nota") as string) || "").trim() || null;
    const slugs = formData
      .getAll("tiendas")
      .map((s) => String(s))
      .filter(Boolean);
    const file = formData.get("file");

    if (slugs.length === 0) return fail("Elegí al menos una tienda destino.");
    if (!(file instanceof File) || file.size === 0)
      return fail("Subí una imagen para repartir.");
    if (file.size > 15 * 1024 * 1024)
      return fail("La imagen es muy grande (máx. 15 MB).");

    const admin = createServiceRoleClient();

    // Resolver tiendas destino.
    const { data: tiendas } = await admin
      .from("tiendas")
      .select("id, slug")
      .in("slug", slugs);
    if (!tiendas || tiendas.length === 0)
      return fail("No se encontraron las tiendas seleccionadas.");

    // Optimizar: JPEG liviano que entra en una historia (1080×1920).
    let jpg: Buffer;
    try {
      jpg = await sharp(Buffer.from(await file.arrayBuffer()))
        .rotate()
        .resize({
          width: 1080,
          height: 1920,
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();
    } catch {
      return fail("No se pudo procesar la imagen. Probá con un JPG o PNG válido.");
    }

    const publicId = `entrega-${Date.now()}`;
    const subida = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${jpg.toString("base64")}`,
      { folder: CARPETA, public_id: publicId, overwrite: false, resource_type: "image" },
    );

    const expira = new Date(Date.now() + DIAS_SIN_DESCARGA * 86400_000).toISOString();

    const { data: entrega, error: entErr } = await admin
      .from("entregas")
      .insert({
        nota,
        cloudinary_url: subida.secure_url,
        cloudinary_public_id: subida.public_id,
        ancho: subida.width ?? null,
        alto: subida.height ?? null,
        bytes: jpg.byteLength,
        creada_por_id: userId,
        expira_sin_descarga_en: expira,
      })
      .select("id")
      .single();
    if (entErr || !entrega) {
      await cloudinary.uploader.destroy(subida.public_id).catch(() => {});
      return fail(entErr?.message ?? "No se pudo guardar la entrega.");
    }

    const { error: destErr } = await admin.from("entrega_destinos").insert(
      tiendas.map((t) => ({ entrega_id: entrega.id, tienda_id: t.id })),
    );
    if (destErr) {
      await admin.from("entregas").delete().eq("id", entrega.id);
      await cloudinary.uploader.destroy(subida.public_id).catch(() => {});
      return fail(destErr.message);
    }

    revalidatePath("/panel/entregas");
    return { ok: true, data: { entregaId: entrega.id } };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}

/** SUPERADMIN. Borra una entrega: el archivo de Cloudinary y la fila (cascada). */
export async function eliminarEntrega(input: {
  entregaId: string;
}): Promise<ActionResult> {
  try {
    await requireRol("superadmin");
    const admin = createServiceRoleClient();

    const { data: entrega } = await admin
      .from("entregas")
      .select("cloudinary_public_id")
      .eq("id", input.entregaId)
      .maybeSingle();

    if (entrega?.cloudinary_public_id) {
      await cloudinary.uploader.destroy(entrega.cloudinary_public_id).catch(() => {});
    }
    const { error } = await admin.from("entregas").delete().eq("id", input.entregaId);
    if (error) return fail(error.message);

    revalidatePath("/panel/entregas");
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}
