"use server";

import Anthropic from "@anthropic-ai/sdk";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRol } from "@/lib/auth/guards";
import type { ActionResult } from "@/lib/panel/resultado";
import type { PreviewIngesta, PiezaIngesta } from "@/lib/panel/ingesta";
import { ordenTipos, type TipoPieza } from "@/lib/panel/piezas";

const MODELO = "claude-sonnet-4-6";

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

const TIPOS_VALIDOS = new Set<TipoPieza>(ordenTipos);

// Esquema de salida estructurada que Claude debe rellenar.
const HERRAMIENTA = {
  name: "estructurar_mes",
  description:
    "Devuelve el plan del mes estructurado por día. Una entrada por día con piezas asignadas a su fecha.",
  input_schema: {
    type: "object" as const,
    properties: {
      dias: {
        type: "array",
        items: {
          type: "object",
          properties: {
            fecha: { type: "integer", description: "Día del mes (1–31)" },
            piezas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  tipo: {
                    type: "string",
                    enum: ordenTipos,
                    description:
                      "post/flyer/carrusel llevan caption; historia/reel/cinema llevan intención; live/activacion/mantenimiento llevan descripción.",
                  },
                  orden: { type: "integer" },
                  gancho: { type: "string" },
                  titulo: { type: "string" },
                  descripcionVisual: { type: "string" },
                  cta: { type: "string" },
                  caption: {
                    type: "string",
                    description: "Texto listo para copiar al pie del post.",
                  },
                  intencion: {
                    type: "string",
                    description:
                      "Para historias/reels: qué queremos transmitir, natural y corto. NO un guion palabra por palabra.",
                  },
                  descripcion: { type: "string" },
                },
                required: ["tipo"],
                additionalProperties: false,
              },
            },
          },
          required: ["fecha", "piezas"],
          additionalProperties: false,
        },
      },
    },
    required: ["dias"],
    additionalProperties: false,
  },
};

const SISTEMA = `Sos un asistente editorial de American Outlet (outlet de Costa Rica). Tu tarea es tomar el texto crudo de un plan de contenido mensual y estructurarlo día por día usando la herramienta estructurar_mes.

Reglas:
- Asigná cada pieza a su fecha (día del mes).
- Tipos: post/flyer/carrusel son piezas con "caption" (texto copiable). historia y reel y cinema se expresan con "intencion" (qué queremos transmitir, en tono natural y breve — NUNCA un guion palabra por palabra, porque alarga la producción). live/activacion/mantenimiento usan "descripcion".
- Para posts/flyers: completá gancho, titulo, descripcionVisual (qué se ve), cta y caption.
- Respetá la voz de marca: español de Costa Rica, voseo, tono directo y seco. El inventario es el protagonista.
- IMPORTANTE: alineá cualquier mención de porcentaje de descuento a la configuración de fases que te paso. Si el texto original menciona un % que no corresponde a la fase de ese día según la config, corregilo al % de la fase real de esa fecha, y ajustá los mensajes de transición de fase ("mañana sube a X%") al esquema de fases vigente.
- No inventes días que no estén en el texto. Si un día no aparece, no lo incluyas.`;

export async function analizarMesConIA(input: {
  mesId: string;
  fuente: string;
}): Promise<ActionResult<PreviewIngesta>> {
  try {
    await requireRol("superadmin");
    if (!process.env.ANTHROPIC_API_KEY) {
      return fail("Falta ANTHROPIC_API_KEY en el servidor. Agregala a .env.local.");
    }
    if (!input.fuente.trim()) return fail("Pegá el texto del mes primero.");

    const supabase = await createClient();
    const { data: fases } = await supabase
      .from("fases")
      .select("numero, nombre, descuento, dia_desde, dia_hasta")
      .eq("mes_id", input.mesId)
      .order("numero");

    const configFases =
      (fases ?? [])
        .map(
          (f) =>
            `Fase ${f.numero} (${f.nombre}): ${f.descuento}% — días ${f.dia_desde} a ${f.dia_hasta}`,
        )
        .join("\n") || "Sin fases configuradas.";

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const resp = await client.messages.create({
      model: MODELO,
      max_tokens: 8000,
      system: [
        { type: "text", text: SISTEMA, cache_control: { type: "ephemeral" } },
      ],
      tools: [HERRAMIENTA],
      tool_choice: { type: "tool", name: "estructurar_mes" },
      messages: [
        {
          role: "user",
          content: `Configuración de fases del mes:\n${configFases}\n\n--- TEXTO DEL PLAN ---\n${input.fuente}`,
        },
      ],
    });

    const bloque = resp.content.find((c) => c.type === "tool_use");
    if (!bloque || bloque.type !== "tool_use") {
      return fail("La IA no devolvió una estructura válida. Probá de nuevo.");
    }

    const raw = bloque.input as { dias?: Array<{ fecha: number; piezas: PiezaIngesta[] }> };
    const dias = (raw.dias ?? [])
      .filter((d) => Number.isInteger(d.fecha) && d.fecha >= 1 && d.fecha <= 31)
      .map((d) => ({
        fecha: d.fecha,
        piezas: (d.piezas ?? [])
          .filter((p) => TIPOS_VALIDOS.has(p.tipo))
          .map((p, i) => ({ ...p, orden: p.orden ?? i })),
      }))
      .filter((d) => d.piezas.length > 0)
      .sort((a, b) => a.fecha - b.fecha);

    return { ok: true, data: { dias } };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error llamando a la IA");
  }
}

/** Persiste el preview: reemplaza las piezas de cada día incluido. */
export async function guardarIngesta(input: {
  mesId: string;
  preview: PreviewIngesta;
}): Promise<ActionResult<{ piezasCreadas: number }>> {
  try {
    await requireRol("superadmin");
    const supabase = await createClient();

    const { data: dias } = await supabase
      .from("dias")
      .select("id, fecha")
      .eq("mes_id", input.mesId);
    const idPorFecha = new Map((dias ?? []).map((d) => [d.fecha, d.id]));

    let creadas = 0;
    for (const d of input.preview.dias) {
      const diaId = idPorFecha.get(d.fecha);
      if (!diaId) continue;
      // Reemplazo por día: limpiar y reinsertar.
      await supabase.from("piezas").delete().eq("dia_id", diaId);
      const filas = d.piezas.map((p, i) => ({
        dia_id: diaId,
        tipo: p.tipo,
        orden: p.orden ?? i,
        gancho: p.gancho?.trim() || null,
        titulo: p.titulo?.trim() || null,
        descripcion_visual: p.descripcionVisual?.trim() || null,
        cta: p.cta?.trim() || null,
        caption: p.caption?.trim() || null,
        intencion: p.intencion?.trim() || null,
        descripcion: p.descripcion?.trim() || null,
      }));
      if (filas.length > 0) {
        const { error } = await supabase.from("piezas").insert(filas);
        if (error) return fail(error.message);
        creadas += filas.length;
      }
    }
    revalidatePath("/panel/calendario");
    return { ok: true, data: { piezasCreadas: creadas } };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error guardando la ingesta");
  }
}
