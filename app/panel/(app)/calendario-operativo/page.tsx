import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getRolActual, getTiendaActual } from "@/lib/panel/datos";
import {
  getCalendarioOperativo,
  slugsOperativos,
} from "@/content/calendarios-operativos";
import { CalendarioInstruccional } from "@/components/panel/CalendarioInstruccional";

export const metadata: Metadata = { title: "Calendario de acciones" };

function SinCalendario() {
  return (
    <div className="card-3d p-8 text-center">
      <p className="text-sm text-[var(--color-tinta-suave)]">
        Tu usuario no tiene un calendario de acciones asignado.
      </p>
    </div>
  );
}

export default async function CalendarioOperativoPage() {
  const [rol, tienda] = await Promise.all([getRolActual(), getTiendaActual()]);

  // Superadmin: ve la plantilla compartida (aplica a todas las tiendas operativas).
  if (rol === "superadmin") {
    const data = getCalendarioOperativo(slugsOperativos[0])!;
    return (
      <CalendarioInstruccional
        data={{ ...data, tiendaNombre: "Tiendas operativas · Fortuna y Florencia" }}
      />
    );
  }

  // Usuario de tienda (o admin con tienda): solo su propio calendario.
  // El slug se toma del perfil — nunca de params — para garantizar el aislamiento.
  const slug = tienda?.slug ?? null;

  // Ciudad Quesada usa el calendario de fases/descuentos, no el operativo.
  if (slug === "ciudad-quesada") {
    redirect("/panel/calendario");
  }

  const data = getCalendarioOperativo(slug);
  if (!data) {
    return <SinCalendario />;
  }

  return <CalendarioInstruccional data={data} />;
}
