import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Cliente Supabase con SERVICE ROLE — bypassa RLS. SOLO para server actions
 * de gestión (crear/eliminar usuarios de Auth). NUNCA importar desde el cliente.
 * La key vive en SUPABASE_SERVICE_ROLE_KEY (sin prefijo NEXT_PUBLIC).
 */
export function createServiceRoleClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
