import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

/**
 * Cliente Supabase para Server Components, Route Handlers y Server Actions.
 * Lee/escribe la sesión en cookies. La escritura desde un Server Component
 * puro lanza error (cookies de solo lectura): se ignora con seguridad porque
 * el middleware ya refresca la sesión en cada request.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Invocado desde un Server Component sin acceso de escritura.
            // El middleware se encarga de refrescar la cookie de sesión.
          }
        },
      },
    },
  );
}
