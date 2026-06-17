import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type Lead = Tables<"leads">;

/** Leads Web para el panel (RLS: cualquier usuario autenticado del panel). */
export async function getLeads(limite = 2000): Promise<Lead[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("creado_en", { ascending: false })
    .limit(limite);
  return data ?? [];
}
