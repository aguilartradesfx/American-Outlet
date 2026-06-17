import "server-only";
import { createClient } from "@/lib/supabase/server";

export type Rol = "tienda" | "admin" | "superadmin";

const nivel: Record<Rol, number> = { tienda: 0, admin: 1, superadmin: 2 };

/** Usuario actual + su rol (o null si no hay sesión). */
export async function getUsuarioYRol(): Promise<{
  userId: string | null;
  rol: Rol | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { userId: null, rol: null };

  const { data } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("id", user.id)
    .maybeSingle();

  const rol = (data?.rol as Rol) ?? "tienda";
  return { userId: user.id, rol };
}

/**
 * Barrera de rol para server actions (defensa en profundidad sobre RLS).
 * Lanza si el usuario no alcanza el rol mínimo. Las actions la atrapan y
 * devuelven { ok:false }.
 */
export async function requireRol(min: "admin" | "superadmin"): Promise<{
  userId: string;
  rol: Rol;
}> {
  const { userId, rol } = await getUsuarioYRol();
  if (!userId || !rol || nivel[rol] < nivel[min]) {
    throw new Error("No autorizado para esta acción.");
  }
  return { userId, rol };
}

/**
 * Barrera mínima para server actions accesibles a cualquier rol (incluye tienda).
 * Solo exige sesión iniciada. Lanza si no hay usuario.
 */
export async function requireSesion(): Promise<{ userId: string; rol: Rol }> {
  const { userId, rol } = await getUsuarioYRol();
  if (!userId || !rol) {
    throw new Error("No autorizado para esta acción.");
  }
  return { userId, rol };
}
