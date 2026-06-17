import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { cloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

/**
 * Cron diario (Vercel). Limpia las entregas vencidas:
 *  1. Marca destinos como eliminados cuando pasaron 3 días desde la descarga,
 *     o 14 días sin descargarse.
 *  2. Cuando TODOS los destinos de una entrega están eliminados, borra el
 *     archivo de Cloudinary y marca la entrega como eliminada (libera espacio).
 *
 * Seguridad: Vercel envía `Authorization: Bearer ${CRON_SECRET}` cuando la env
 * CRON_SECRET está configurada. Sin esa env el endpoint no corre.
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("No autorizado.", { status: 401 });
  }

  const admin = createServiceRoleClient();
  const ahora = new Date().toISOString();

  // 1a. Descargados cuyo plazo de 3 días ya venció.
  await admin
    .from("entrega_destinos")
    .update({ eliminada_en: ahora })
    .is("eliminada_en", null)
    .not("eliminar_en", "is", null)
    .lte("eliminar_en", ahora);

  // 1b. Nunca descargados cuya entrega ya superó los 14 días.
  const { data: pendientes } = await admin
    .from("entrega_destinos")
    .select("id, entregas(expira_sin_descarga_en)")
    .is("eliminada_en", null)
    .is("descargada_en", null);

  const vencidosSinDescarga = ((pendientes as unknown as Array<{
    id: string;
    entregas: { expira_sin_descarga_en: string } | null;
  }>) ?? [])
    .filter(
      (d) => d.entregas?.expira_sin_descarga_en && d.entregas.expira_sin_descarga_en <= ahora,
    )
    .map((d) => d.id);

  if (vencidosSinDescarga.length > 0) {
    await admin
      .from("entrega_destinos")
      .update({ eliminada_en: ahora })
      .in("id", vencidosSinDescarga);
  }

  // 2. Entregas con todos sus destinos eliminados → borrar archivo + marcar.
  const { data: entregas } = await admin
    .from("entregas")
    .select("id, cloudinary_public_id, entrega_destinos(eliminada_en)")
    .is("eliminada_en", null);

  let archivosBorrados = 0;
  for (const e of (entregas as unknown as Array<{
    id: string;
    cloudinary_public_id: string | null;
    entrega_destinos: Array<{ eliminada_en: string | null }>;
  }>) ?? []) {
    const destinos = e.entrega_destinos ?? [];
    const todasEliminadas = destinos.length > 0 && destinos.every((d) => d.eliminada_en);
    if (!todasEliminadas) continue;

    if (e.cloudinary_public_id) {
      await cloudinary.uploader.destroy(e.cloudinary_public_id).catch(() => {});
    }
    await admin.from("entregas").update({ eliminada_en: ahora }).eq("id", e.id);
    archivosBorrados++;
  }

  return NextResponse.json({
    ok: true,
    destinosVencidosSinDescarga: vencidosSinDescarga.length,
    archivosBorrados,
  });
}
