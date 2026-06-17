"use server";

import { registrarLeadCore, type LeadRegistrado } from "@/lib/leads/registrar";
import type { ActionResult } from "@/lib/panel/resultado";

export async function registrarLeadRuleta(input: {
  nombre: string;
  correo: string;
  whatsapp: string;
}): Promise<ActionResult<LeadRegistrado>> {
  return registrarLeadCore({
    ...input,
    origen: "ruleta-papa-ads",
    ghlSource: "Landing Ruleta — Día del Padre (Ads)",
  });
}
