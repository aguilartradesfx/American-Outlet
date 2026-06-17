/**
 * Capa de lectura del panel — queries al plan de contenido en Supabase.
 * Todo pasa por el client SSR (RLS aplica): las tiendas solo ven meses
 * publicados; el superadmin ve también borradores.
 */
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { Tables } from "@/lib/supabase/database.types";

export type Mes = Tables<"meses">;
export type Fase = Tables<"fases">;
export type Dia = Tables<"dias">;
export type Pieza = Tables<"piezas">;
export type Tienda = Tables<"tiendas">;

export async function getTiendas(): Promise<Tienda[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tiendas")
    .select("*")
    .order("orden", { ascending: true })
    .order("nombre", { ascending: true });
  return data ?? [];
}

export type DiaConPiezas = Dia & { fase: Fase | null; piezas: Pieza[] };

/**
 * Mes "activo" por defecto: el publicado que corresponde a hoy, o el publicado
 * más reciente. Para el superadmin, RLS también deja ver borradores, pero el
 * default sigue priorizando publicados para no aterrizar en un borrador.
 */
export async function getMesActivo(): Promise<Mes | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("meses")
    .select("*")
    .order("anio", { ascending: false })
    .order("mes", { ascending: false });

  if (!data || data.length === 0) return null;
  const publicados = data.filter((m) => m.estado === "publicado");
  return publicados[0] ?? data[0];
}

export async function getMesPorSlug(slug: string): Promise<Mes | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("meses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

/** Todos los meses visibles para el usuario (RLS filtra por rol). */
export async function getMeses(): Promise<Mes[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("meses")
    .select("*")
    .order("anio", { ascending: false })
    .order("mes", { ascending: false });
  return data ?? [];
}

export async function getFasesDeMes(mesId: string): Promise<Fase[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("fases")
    .select("*")
    .eq("mes_id", mesId)
    .order("numero", { ascending: true });
  return data ?? [];
}

/**
 * Días del mes con su fase resuelta y el conteo de piezas. Trae las piezas
 * embebidas para poder mostrar la pieza principal en cada card sin N+1.
 */
export async function getDiasDeMes(mesId: string): Promise<DiaConPiezas[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("dias")
    .select("*, fase:fases(*), piezas(*)")
    .eq("mes_id", mesId)
    .order("fecha", { ascending: true });

  return (
    (data as unknown as DiaConPiezas[]) ?? []
  ).map((d) => ({
    ...d,
    piezas: [...(d.piezas ?? [])].sort((a, b) => a.orden - b.orden),
  }));
}

/** Un día concreto del mes (por número de fecha) con fase y piezas ordenadas. */
export async function getDiaPorFecha(
  mesId: string,
  fecha: number,
): Promise<DiaConPiezas | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("dias")
    .select("*, fase:fases(*), piezas(*)")
    .eq("mes_id", mesId)
    .eq("fecha", fecha)
    .maybeSingle();

  if (!data) return null;
  const dia = data as unknown as DiaConPiezas;
  return {
    ...dia,
    piezas: [...(dia.piezas ?? [])].sort((a, b) => a.orden - b.orden),
  };
}

/**
 * Personas asignables a piezas: los perfiles con `responsabilidad` definida
 * (el equipo de contenido — Josué/Mauro). Se lee con service-role porque RLS de
 * `perfiles` restringe lecturas cruzadas; el llamador (calendario) ya lo limita
 * a superadmin.
 */
export async function getUsuariosAsignables(): Promise<
  { id: string; nombre: string | null }[]
> {
  const admin = createServiceRoleClient();
  const { data } = await admin
    .from("perfiles")
    .select("id, nombre, responsabilidad")
    .not("responsabilidad", "is", null)
    .order("nombre", { ascending: true });
  return (data ?? []).map((p) => ({ id: p.id, nombre: p.nombre }));
}

export type TiendaActual = { tiendaId: string; slug: string; nombre: string };

/**
 * Tienda del usuario actual (vía perfiles.tienda_id → tiendas). Devuelve null si
 * el usuario no tiene tienda asignada (ej. superadmin/admin sin tienda).
 * Se usa para aislar los calendarios operativos por tienda.
 */
export async function getTiendaActual(): Promise<TiendaActual | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("perfiles")
    .select("tienda_id, tiendas(slug, nombre)")
    .eq("id", user.id)
    .maybeSingle();

  const tiendaId = (data?.tienda_id as string | null | undefined) ?? null;
  const tienda =
    (data as { tiendas?: { slug: string; nombre: string } | null } | null)
      ?.tiendas ?? null;

  if (!tiendaId || !tienda?.slug) return null;
  return { tiendaId, slug: tienda.slug, nombre: tienda.nombre };
}

/** Rol del usuario actual (para gating de UI). */
export async function getRolActual(): Promise<
  "tienda" | "admin" | "superadmin" | null
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("id", user.id)
    .maybeSingle();
  const rol = data?.rol;
  if (rol === "admin" || rol === "superadmin" || rol === "tienda") return rol;
  return "tienda";
}
