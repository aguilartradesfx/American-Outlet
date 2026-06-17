import "server-only";

import crypto from "node:crypto";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/lib/panel/resultado";

const GHL_TAG = "Lead Web";

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

/** Cupón legible: PAPA-XXXX (base32 sin caracteres ambiguos). */
function generarCupon(): string {
  const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(5);
  let code = "";
  for (let i = 0; i < 5; i++) code += abc[bytes[i] % abc.length];
  return `PAPA-${code}`;
}

/** Normaliza el WhatsApp a E.164 de Costa Rica para GHL. */
function normalizarTel(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (!d) return "";
  if (raw.trim().startsWith("+")) return "+" + d;
  if (d.length === 8) return "+506" + d;
  if (d.startsWith("506")) return "+" + d;
  return "+" + d;
}

async function sincronizarGHL(input: {
  nombre: string;
  correo: string;
  telefono: string;
  source: string;
}): Promise<string | null> {
  const base = process.env.GHL_API_BASE_URL;
  const token = process.env.GHL_PRIVATE_INTEGRATION_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  const version = process.env.GHL_API_VERSION || "2021-07-28";
  if (!base || !token || !locationId) return null;

  try {
    const res = await fetch(`${base}/contacts/upsert`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Version: version,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        locationId,
        name: input.nombre,
        email: input.correo,
        phone: input.telefono || undefined,
        tags: [GHL_TAG],
        source: input.source,
        customFields: [],
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { contact?: { id?: string } };
    return data.contact?.id ?? null;
  } catch {
    return null;
  }
}

export type LeadRegistrado = { cupon: string; nombre: string; yaRegistrado: boolean };

/**
 * Registra un lead web: lo sincroniza con GHL y lo guarda en Supabase (sección
 * "Leads Web" del panel), generando un cupón único. Si el correo ya existe,
 * devuelve el mismo cupón sin duplicar. Reutilizado por el banner /promo y por
 * la landing de ruleta /papa.
 */
export async function registrarLeadCore(input: {
  nombre: string;
  correo: string;
  whatsapp: string;
  origen: string;
  ghlSource: string;
}): Promise<ActionResult<LeadRegistrado>> {
  try {
    const nombre = input.nombre.trim();
    const correo = input.correo.trim().toLowerCase();
    const whatsapp = input.whatsapp.trim();

    if (nombre.length < 2) return fail("Escribí tu nombre.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return fail("Revisá tu correo.");
    if (whatsapp.replace(/\D/g, "").length < 8) return fail("Revisá tu número de WhatsApp.");

    const admin = createServiceRoleClient();

    // ¿Ya registrado? Devolvemos el mismo cupón (sin duplicar).
    const { data: existente } = await admin
      .from("leads")
      .select("cupon, nombre")
      .eq("correo", correo)
      .maybeSingle();
    if (existente) {
      return {
        ok: true,
        data: { cupon: existente.cupon, nombre: existente.nombre, yaRegistrado: true },
      };
    }

    const telefono = normalizarTel(whatsapp);
    const ghlId = await sincronizarGHL({ nombre, correo, telefono, source: input.ghlSource });

    // Insertar con reintento ante colisión de cupón (muy improbable).
    let cupon = generarCupon();
    for (let intento = 0; intento < 3; intento++) {
      const { error } = await admin.from("leads").insert({
        nombre,
        correo,
        whatsapp: telefono || whatsapp,
        cupon,
        origen: input.origen,
        ghl_contact_id: ghlId,
        ghl_sincronizado: ghlId !== null,
      });
      if (!error) {
        return { ok: true, data: { cupon, nombre, yaRegistrado: false } };
      }
      // Colisión por correo (carrera) → devolver el existente.
      if (error.code === "23505" && /correo/.test(error.message)) {
        const { data: e2 } = await admin
          .from("leads")
          .select("cupon, nombre")
          .eq("correo", correo)
          .maybeSingle();
        if (e2) return { ok: true, data: { cupon: e2.cupon, nombre: e2.nombre, yaRegistrado: true } };
      }
      // Colisión de cupón → regenerar.
      cupon = generarCupon();
    }
    return fail("No pudimos generar tu cupón. Probá de nuevo.");
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}
