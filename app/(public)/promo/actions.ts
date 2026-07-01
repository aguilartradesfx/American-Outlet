"use server";

import { registrarLeadCore, type LeadRegistrado } from "@/lib/leads/registrar";
import type { ActionResult } from "@/lib/panel/resultado";

export async function registrarLead(input: {
  nombre: string;
  correo: string;
  whatsapp: string;
}): Promise<ActionResult<LeadRegistrado>> {
  return registrarLeadCore({
    ...input,
    origen: "banner-julio-2026",
    ghlSource: "Banner Web — Promo del mes",
    cuponPrefijo: "CASA",
  });
}
