"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { requireRol, getUsuarioYRol } from "@/lib/auth/guards";
import type { ActionResult } from "@/lib/panel/resultado";
import { responsabilidadDeTipo, type TipoPieza } from "@/lib/panel/piezas";

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

/**
 * Resuelve a quién se auto-asigna una pieza según su tipo: busca el perfil con
 * la `responsabilidad` correspondiente (estaticos/dinamicos). Devuelve null para
 * tipos administrativos o si no hay nadie con esa responsabilidad.
 */
async function resolverAsignadoPorTipo(
  admin: ReturnType<typeof createServiceRoleClient>,
  tipo: TipoPieza,
): Promise<{ id: string; nombre: string | null } | null> {
  const grupo = responsabilidadDeTipo[tipo];
  if (!grupo) return null;
  const { data } = await admin
    .from("perfiles")
    .select("id, nombre")
    .eq("responsabilidad", grupo)
    .order("creado_en", { ascending: true })
    .limit(1)
    .maybeSingle();
  return data ? { id: data.id, nombre: data.nombre } : null;
}

/** Re-vincula cada día del mes a su fase según el rango de fechas. */
async function relinkDias(
  supabase: Awaited<ReturnType<typeof createClient>>,
  mesId: string,
) {
  const { data: fases } = await supabase
    .from("fases")
    .select("id, dia_desde, dia_hasta")
    .eq("mes_id", mesId);
  for (const f of fases ?? []) {
    await supabase
      .from("dias")
      .update({ fase_id: f.id })
      .eq("mes_id", mesId)
      .gte("fecha", f.dia_desde)
      .lte("fecha", f.dia_hasta);
  }
}

// ---------------------------------------------------------------------------
// Meses
// ---------------------------------------------------------------------------
export async function crearMes(input: {
  anio: number;
  mes: number;
  titulo: string;
  bajada?: string;
}): Promise<ActionResult<{ mesId: string }>> {
  try {
    await requireRol("superadmin");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("meses")
      .insert({
        anio: input.anio,
        mes: input.mes,
        titulo: input.titulo.trim(),
        bajada: input.bajada?.trim() || null,
        estado: "borrador",
      })
      .select("id")
      .single();
    if (error) return fail(error.message);
    revalidatePath("/panel/planificacion");
    return { ok: true, data: { mesId: data.id } };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}

export async function setEstadoMes(input: {
  mesId: string;
  estado: "borrador" | "publicado" | "archivado";
}): Promise<ActionResult> {
  try {
    await requireRol("superadmin");
    const supabase = await createClient();
    const { error } = await supabase
      .from("meses")
      .update({
        estado: input.estado,
        publicado_en: input.estado === "publicado" ? new Date().toISOString() : null,
      })
      .eq("id", input.mesId);
    if (error) return fail(error.message);
    revalidatePath("/panel/planificacion");
    revalidatePath("/panel/calendario");
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}

export async function actualizarMes(input: {
  mesId: string;
  titulo?: string;
  bajada?: string;
  reglaOroFrase?: string;
  reglaOroContexto?: string;
  voz?: string;
}): Promise<ActionResult> {
  try {
    await requireRol("superadmin");
    const supabase = await createClient();
    const { error } = await supabase
      .from("meses")
      .update({
        titulo: input.titulo?.trim(),
        bajada: input.bajada?.trim() || null,
        regla_oro_frase: input.reglaOroFrase?.trim() || null,
        regla_oro_contexto: input.reglaOroContexto?.trim() || null,
        voz: input.voz?.trim() || null,
      })
      .eq("id", input.mesId);
    if (error) return fail(error.message);
    revalidatePath("/panel/planificacion");
    revalidatePath("/panel/calendario");
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}

// ---------------------------------------------------------------------------
// Fases
// ---------------------------------------------------------------------------
export async function guardarFases(input: {
  mesId: string;
  fases: Array<{
    numero: number;
    nombre: string;
    descuento: number;
    diaDesde: number;
    diaHasta: number;
    objetivo?: string;
    cita?: string;
    logica?: string;
    colorAcento?: string;
    colorSuave?: string;
    colorTexto?: string;
  }>;
}): Promise<ActionResult> {
  try {
    await requireRol("superadmin");
    const supabase = await createClient();
    // Reemplazo total: borrar y reinsertar (nulea fase_id de dias por FK).
    await supabase.from("fases").delete().eq("mes_id", input.mesId);
    if (input.fases.length > 0) {
      const { error } = await supabase.from("fases").insert(
        input.fases.map((f) => ({
          mes_id: input.mesId,
          numero: f.numero,
          nombre: f.nombre.trim(),
          descuento: f.descuento,
          dia_desde: f.diaDesde,
          dia_hasta: f.diaHasta,
          objetivo: f.objetivo?.trim() || null,
          cita: f.cita?.trim() || null,
          logica: f.logica?.trim() || null,
          color_acento: f.colorAcento || null,
          color_suave: f.colorSuave || null,
          color_texto: f.colorTexto || null,
        })),
      );
      if (error) return fail(error.message);
    }
    await relinkDias(supabase, input.mesId);
    revalidatePath("/panel/calendario");
    revalidatePath("/panel/fases");
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}

// ---------------------------------------------------------------------------
// Días — genera la grilla del mes (1..N) y vincula fases
// ---------------------------------------------------------------------------
export async function generarDias(input: {
  mesId: string;
}): Promise<ActionResult<{ dias: number }>> {
  try {
    await requireRol("superadmin");
    const supabase = await createClient();
    const { data: mes, error: mesErr } = await supabase
      .from("meses")
      .select("anio, mes")
      .eq("id", input.mesId)
      .single();
    if (mesErr || !mes) return fail(mesErr?.message ?? "Mes no encontrado");

    const diasEnMes = new Date(mes.anio, mes.mes, 0).getDate();
    const filas = Array.from({ length: diasEnMes }, (_, i) => {
      const fecha = i + 1;
      return {
        mes_id: input.mesId,
        fecha,
        dia_semana: new Date(mes.anio, mes.mes - 1, fecha).getDay(),
      };
    });
    const { error } = await supabase
      .from("dias")
      .upsert(filas, { onConflict: "mes_id,fecha" });
    if (error) return fail(error.message);

    await relinkDias(supabase, input.mesId);
    revalidatePath("/panel/calendario");
    return { ok: true, data: { dias: diasEnMes } };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}

// ---------------------------------------------------------------------------
// Piezas
// ---------------------------------------------------------------------------
export async function guardarPieza(input: {
  diaId: string;
  pieza: {
    id?: string;
    tipo: TipoPieza;
    orden?: number;
    gancho?: string;
    titulo?: string;
    descripcionVisual?: string;
    cta?: string;
    caption?: string;
    intencion?: string;
    descripcion?: string;
  };
}): Promise<ActionResult<{ piezaId: string }>> {
  try {
    await requireRol("superadmin");
    const supabase = await createClient();
    const p = input.pieza;
    const fila = {
      dia_id: input.diaId,
      tipo: p.tipo,
      orden: p.orden ?? 0,
      gancho: p.gancho?.trim() || null,
      titulo: p.titulo?.trim() || null,
      descripcion_visual: p.descripcionVisual?.trim() || null,
      cta: p.cta?.trim() || null,
      caption: p.caption?.trim() || null,
      intencion: p.intencion?.trim() || null,
      descripcion: p.descripcion?.trim() || null,
    };

    if (p.id) {
      // Editar no cambia la asignación (se respeta lo que haya, auto u override).
      const { error } = await supabase.from("piezas").update(fila).eq("id", p.id);
      if (error) return fail(error.message);
      revalidatePath("/panel/calendario");
      return { ok: true, data: { piezaId: p.id } };
    }

    // Pieza nueva → auto-asignar según el tipo (estaticos/dinamicos).
    const admin = createServiceRoleClient();
    const asignado = await resolverAsignadoPorTipo(admin, p.tipo);
    const { data, error } = await supabase
      .from("piezas")
      .insert({
        ...fila,
        asignado_a_id: asignado?.id ?? null,
        asignado_a_nombre: asignado?.nombre ?? null,
      })
      .select("id")
      .single();
    if (error) return fail(error.message);
    revalidatePath("/panel/calendario");
    return { ok: true, data: { piezaId: data.id } };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}

/**
 * SUPERADMIN. Reasigna una pieza a otra persona (override de la auto-asignación),
 * o la deja sin asignar con `asignadoAId: null`.
 */
export async function asignarPieza(input: {
  piezaId: string;
  asignadoAId: string | null;
}): Promise<ActionResult<{ asignadoANombre: string | null }>> {
  try {
    await requireRol("superadmin");
    const admin = createServiceRoleClient();

    let nombre: string | null = null;
    if (input.asignadoAId) {
      const { data } = await admin
        .from("perfiles")
        .select("nombre")
        .eq("id", input.asignadoAId)
        .maybeSingle();
      nombre = data?.nombre ?? null;
    }

    const { error } = await admin
      .from("piezas")
      .update({ asignado_a_id: input.asignadoAId, asignado_a_nombre: nombre })
      .eq("id", input.piezaId);
    if (error) return fail(error.message);
    revalidatePath("/panel/calendario");
    return { ok: true, data: { asignadoANombre: nombre } };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}

/**
 * Marca/desmarca una pieza como completada. Disponible para CUALQUIER usuario
 * autenticado del panel (no solo superadmin): el RLS de `piezas` solo permite
 * UPDATE a superadmin, así que escribimos con el cliente service-role y dejamos
 * la barrera en la sesión. Guarda el nombre del perfil de quien la marca.
 */
export async function marcarPiezaCompletada(input: {
  piezaId: string;
  completar: boolean;
}): Promise<ActionResult<{ completadoPorNombre: string | null; completadoEn: string | null }>> {
  try {
    const { userId, rol } = await getUsuarioYRol();
    if (!userId) return fail("No autorizado para esta acción.");

    const admin = createServiceRoleClient();

    if (!input.completar) {
      // Candado: solo quien la marcó (o un superadmin) puede deshacerla.
      const { data: actual } = await admin
        .from("piezas")
        .select("completado_por_id")
        .eq("id", input.piezaId)
        .maybeSingle();
      const completadoPor = actual?.completado_por_id ?? null;
      if (completadoPor && completadoPor !== userId && rol !== "superadmin") {
        return fail("Solo quien lo marcó puede deshacerlo.");
      }

      const { error } = await admin
        .from("piezas")
        .update({ completado_en: null, completado_por_id: null, completado_por_nombre: null })
        .eq("id", input.piezaId);
      if (error) return fail(error.message);
      revalidatePath("/panel/calendario");
      return { ok: true, data: { completadoPorNombre: null, completadoEn: null } };
    }

    // Nombre legible de quien marca (fallback al email si no tiene nombre).
    const { data: perfil } = await admin
      .from("perfiles")
      .select("nombre")
      .eq("id", userId)
      .maybeSingle();
    let nombre = perfil?.nombre ?? null;
    if (!nombre) {
      const { data: u } = await admin.auth.admin.getUserById(userId);
      nombre = u.user?.email ?? null;
    }

    const completadoEn = new Date().toISOString();
    const { error } = await admin
      .from("piezas")
      .update({
        completado_en: completadoEn,
        completado_por_id: userId,
        completado_por_nombre: nombre,
      })
      .eq("id", input.piezaId);
    if (error) return fail(error.message);
    revalidatePath("/panel/calendario");
    return { ok: true, data: { completadoPorNombre: nombre, completadoEn } };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}

export async function eliminarPieza(input: {
  piezaId: string;
}): Promise<ActionResult> {
  try {
    await requireRol("superadmin");
    const supabase = await createClient();
    const { error } = await supabase.from("piezas").delete().eq("id", input.piezaId);
    if (error) return fail(error.message);
    revalidatePath("/panel/calendario");
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}
