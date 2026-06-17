import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUsuarioYRol } from "@/lib/auth/guards";
import { getMeses, getFasesDeMes, type Fase } from "@/lib/panel/datos";
import { PlanificacionClient } from "./PlanificacionClient";

export const metadata: Metadata = { title: "Planificación" };

export default async function PlanificacionPage() {
  const { rol } = await getUsuarioYRol();
  if (rol !== "superadmin") redirect("/panel/calendario");

  const meses = await getMeses();
  const fasesPorMes: Record<string, Fase[]> = {};
  await Promise.all(
    meses.map(async (m) => {
      fasesPorMes[m.id] = await getFasesDeMes(m.id);
    }),
  );

  return (
    <PlanificacionClient
      meses={meses.map((m) => ({
        id: m.id,
        anio: m.anio,
        mes: m.mes,
        slug: m.slug,
        titulo: m.titulo,
        bajada: m.bajada,
        estado: m.estado,
      }))}
      fasesPorMes={Object.fromEntries(
        Object.entries(fasesPorMes).map(([k, fs]) => [
          k,
          fs.map((f) => ({
            numero: f.numero,
            nombre: f.nombre,
            descuento: f.descuento,
            diaDesde: f.dia_desde,
            diaHasta: f.dia_hasta,
            colorAcento: f.color_acento ?? "",
            colorTexto: f.color_texto ?? "",
          })),
        ]),
      )}
    />
  );
}
