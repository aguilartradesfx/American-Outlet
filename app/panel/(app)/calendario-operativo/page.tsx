import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getRolActual, getTiendaActual } from "@/lib/panel/datos";
import {
  calendariosOperativos,
  getCalendarioOperativo,
  slugsOperativos,
} from "@/content/calendarios-operativos";
import { CalendarioOperativo } from "@/components/panel/CalendarioOperativo";

export const metadata: Metadata = { title: "Calendario operativo" };

function SinCalendario() {
  return (
    <div className="card-3d p-8 text-center">
      <p className="text-sm text-[var(--color-tinta-suave)]">
        Tu usuario no tiene un calendario operativo asignado.
      </p>
    </div>
  );
}

export default async function CalendarioOperativoPage({
  searchParams,
}: {
  searchParams: Promise<{ tienda?: string }>;
}) {
  const [rol, tienda] = await Promise.all([getRolActual(), getTiendaActual()]);

  // Superadmin: ve todos los calendarios operativos con selector de tienda.
  if (rol === "superadmin") {
    const params = await searchParams;
    const slug =
      params.tienda && (slugsOperativos as readonly string[]).includes(params.tienda)
        ? params.tienda
        : slugsOperativos[0];
    const data = getCalendarioOperativo(slug)!;

    return (
      <div className="space-y-7">
        <nav className="card-3d flex gap-1 overflow-x-auto p-1.5">
          {slugsOperativos.map((s) => {
            const active = s === slug;
            return (
              <Link
                key={s}
                href={`/panel/calendario-operativo?tienda=${s}`}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center rounded-[1.05rem] px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                  active
                    ? "bg-[var(--color-azul-900)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_22px_-10px_rgba(16,29,39,0.85)]"
                    : "text-[var(--color-tinta-suave)] hover:bg-white/70 hover:text-[var(--color-tinta)]"
                }`}
              >
                {calendariosOperativos[s].tiendaNombre}
              </Link>
            );
          })}
        </nav>
        <CalendarioOperativo data={data} />
      </div>
    );
  }

  // Usuario de tienda (o admin con tienda): solo su propio calendario.
  // El slug se toma del perfil — nunca de los params — para garantizar el aislamiento.
  const slug = tienda?.slug ?? null;

  // Ciudad Quesada usa el calendario de fases/descuentos, no el operativo.
  if (slug === "ciudad-quesada") {
    redirect("/panel/calendario");
  }

  const data = getCalendarioOperativo(slug);
  if (!data) {
    return <SinCalendario />;
  }

  return <CalendarioOperativo data={data} />;
}
