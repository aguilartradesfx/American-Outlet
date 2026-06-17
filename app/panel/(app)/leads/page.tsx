import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUsuarioYRol } from "@/lib/auth/guards";
import { getLeads } from "@/lib/panel/leads";
import { LeadsClient } from "./LeadsClient";

export const metadata: Metadata = { title: "Leads Web" };

export default async function LeadsPage() {
  const { rol } = await getUsuarioYRol();
  if (!rol) redirect("/panel/login");

  const leads = await getLeads();

  return (
    <LeadsClient
      leads={leads.map((l) => ({
        id: l.id,
        nombre: l.nombre,
        correo: l.correo,
        whatsapp: l.whatsapp,
        cupon: l.cupon,
        creado_en: l.creado_en,
        ghl_sincronizado: l.ghl_sincronizado,
      }))}
    />
  );
}
