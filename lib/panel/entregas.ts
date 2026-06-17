import "server-only";
import { createServiceRoleClient } from "@/lib/supabase/admin";

/**
 * Capa de lectura de las "entregas" (imágenes que el agency reparte a las
 * tiendas para que las suban a su estado/historia de WhatsApp). Lee con
 * service-role; los llamadores ya limitan por rol/tienda.
 */

export type DestinoVista = {
  destinoId: string;
  tiendaId: string;
  tiendaNombre: string | null;
  descargadaEn: string | null;
  eliminarEn: string | null;
  eliminadaEn: string | null;
};

export type EntregaAdminVista = {
  id: string;
  nota: string | null;
  url: string;
  creadaEn: string;
  expiraSinDescargaEn: string;
  destinos: DestinoVista[];
};

/** SUPERADMIN: todas las entregas vigentes con el estado por tienda. */
export async function getEntregasAdmin(): Promise<EntregaAdminVista[]> {
  const admin = createServiceRoleClient();
  const { data } = await admin
    .from("entregas")
    .select(
      "id, nota, cloudinary_url, creada_en, expira_sin_descarga_en, eliminada_en, entrega_destinos(id, tienda_id, descargada_en, eliminar_en, eliminada_en, tiendas(nombre))",
    )
    .is("eliminada_en", null)
    .order("creada_en", { ascending: false });

  type Row = {
    id: string;
    nota: string | null;
    cloudinary_url: string;
    creada_en: string;
    expira_sin_descarga_en: string;
    entrega_destinos: Array<{
      id: string;
      tienda_id: string;
      descargada_en: string | null;
      eliminar_en: string | null;
      eliminada_en: string | null;
      tiendas: { nombre: string } | null;
    }>;
  };

  return ((data as unknown as Row[]) ?? []).map((e) => ({
    id: e.id,
    nota: e.nota,
    url: e.cloudinary_url,
    creadaEn: e.creada_en,
    expiraSinDescargaEn: e.expira_sin_descarga_en,
    destinos: (e.entrega_destinos ?? []).map((d) => ({
      destinoId: d.id,
      tiendaId: d.tienda_id,
      tiendaNombre: d.tiendas?.nombre ?? null,
      descargadaEn: d.descargada_en,
      eliminarEn: d.eliminar_en,
      eliminadaEn: d.eliminada_en,
    })),
  }));
}

export type MaterialVista = {
  destinoId: string;
  nota: string | null;
  url: string;
  creadaEn: string;
  descargadaEn: string | null;
  eliminarEn: string | null;
};

/** TIENDA: materiales dirigidos a una tienda, vigentes (no eliminados). */
export async function getMaterialesDeTienda(
  tiendaId: string,
): Promise<MaterialVista[]> {
  const admin = createServiceRoleClient();
  const { data } = await admin
    .from("entrega_destinos")
    .select(
      "id, descargada_en, eliminar_en, creada_en, entregas(nota, cloudinary_url, creada_en, eliminada_en)",
    )
    .eq("tienda_id", tiendaId)
    .is("eliminada_en", null)
    .order("creada_en", { ascending: false });

  type Row = {
    id: string;
    descargada_en: string | null;
    eliminar_en: string | null;
    creada_en: string;
    entregas: {
      nota: string | null;
      cloudinary_url: string;
      creada_en: string;
      eliminada_en: string | null;
    } | null;
  };

  return ((data as unknown as Row[]) ?? [])
    .filter((d) => d.entregas && !d.entregas.eliminada_en)
    .map((d) => ({
      destinoId: d.id,
      nota: d.entregas!.nota,
      url: d.entregas!.cloudinary_url,
      creadaEn: d.entregas!.creada_en,
      descargadaEn: d.descargada_en,
      eliminarEn: d.eliminar_en,
    }));
}
