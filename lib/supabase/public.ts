import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Cliente Supabase anónimo SIN cookies, para lecturas públicas del sitio
 * (no toca la sesión ni vuelve dinámica la página por usar cookies()).
 * Solo lee datos con políticas RLS abiertas a `anon` (p. ej. promos activas).
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
