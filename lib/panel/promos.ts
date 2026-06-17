import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type Promo = Tables<"promos">;

/**
 * Promo activa para el banner público: la del mes/año actual si existe y está
 * activa; si no, la promo activa más reciente. Usa el cliente anónimo (RLS
 * permite a `anon` leer promos activas).
 */
export async function getPromoActiva(): Promise<Promo | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("promos")
    .select("*")
    .eq("activa", true)
    .order("anio", { ascending: false })
    .order("mes", { ascending: false });
  if (!data || data.length === 0) return null;

  const now = new Date();
  const actual = data.find(
    (p) => p.anio === now.getFullYear() && p.mes === now.getMonth() + 1,
  );
  return actual ?? data[0];
}

/** Todas las promos (para el panel: superadmin ve también inactivas vía RLS). */
export async function getPromos(): Promise<Promo[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("promos")
    .select("*")
    .order("anio", { ascending: false })
    .order("mes", { ascending: false });
  return data ?? [];
}
