import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

/** Días que vive una imagen después de descargada. */
const DIAS_TRAS_DESCARGA = 3;

/** Fuerza la descarga en Cloudinary (fl_attachment) sin re-subir nada. */
function urlDescarga(secureUrl: string): string {
  return secureUrl.replace("/upload/", "/upload/fl_attachment/");
}

/**
 * Descarga de un material por la tienda. Valida que el usuario pertenezca a la
 * tienda destino (o sea superadmin), registra la primera descarga e inicia el
 * contador de borrado (3 días). Redirige a la imagen optimizada para descarga.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ destinoId: string }> },
) {
  const { destinoId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(
      new URL("/panel/login", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    );
  }

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol, tienda_id")
    .eq("id", user.id)
    .maybeSingle();

  const admin = createServiceRoleClient();
  const { data: destino } = await admin
    .from("entrega_destinos")
    .select(
      "id, tienda_id, descargada_en, eliminada_en, entregas(cloudinary_url, eliminada_en)",
    )
    .eq("id", destinoId)
    .maybeSingle();

  const entrega = (destino as { entregas?: { cloudinary_url: string; eliminada_en: string | null } | null } | null)
    ?.entregas;

  if (!destino || destino.eliminada_en || !entrega || entrega.eliminada_en) {
    return new NextResponse("Material no disponible.", { status: 404 });
  }

  const esSuperadmin = perfil?.rol === "superadmin";
  if (!esSuperadmin && perfil?.tienda_id !== destino.tienda_id) {
    return new NextResponse("No autorizado.", { status: 403 });
  }

  // Primera descarga (por una tienda, no por el superadmin) inicia el contador.
  if (!esSuperadmin && !destino.descargada_en) {
    const ahora = new Date();
    await admin
      .from("entrega_destinos")
      .update({
        descargada_en: ahora.toISOString(),
        eliminar_en: new Date(ahora.getTime() + DIAS_TRAS_DESCARGA * 86400_000).toISOString(),
      })
      .eq("id", destino.id);
  }

  return NextResponse.redirect(urlDescarga(entrega.cloudinary_url));
}
