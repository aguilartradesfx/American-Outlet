import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getMesPorSlug,
  getDiaPorFecha,
  getUsuariosAsignables,
} from "@/lib/panel/datos";
import { getUsuarioYRol } from "@/lib/auth/guards";
import { Icon } from "@/components/ui/Icon";
import { PiezaCard } from "@/components/panel/PiezaCard";
import { PiezasEditor } from "@/components/panel/PiezasEditor";

const diaSemanaLabel = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

type Params = { slug: string; fecha: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { fecha } = await params;
  return { title: `Día ${fecha}` };
}

export default async function DiaDetallePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, fecha: fechaStr } = await params;
  const fecha = Number(fechaStr);

  const mes = await getMesPorSlug(slug);
  if (!mes || !Number.isInteger(fecha)) notFound();

  const dia = await getDiaPorFecha(mes.id, fecha);
  if (!dia) notFound();

  const fase = dia.fase;
  const { userId, rol } = await getUsuarioYRol();
  const esSuperadmin = rol === "superadmin";
  const usuariosAsignables = esSuperadmin ? await getUsuariosAsignables() : undefined;

  return (
    <div className="space-y-6">
      {/* Cabecera del día */}
      <div>
        <Link
          href="/panel/calendario"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-tinta-tenue)] transition hover:text-[var(--color-tinta)]"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
          Volver al calendario
        </Link>

        <div className="card-3d mt-3 flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-4">
            <div className="surface flex h-16 w-16 flex-col items-center justify-center">
              <span className="text-2xl font-semibold tracking-tight text-[var(--color-tinta)]">
                {dia.fecha}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-tinta-tenue)]">
                {mes.titulo}
              </p>
              <h1 className="mt-0.5 text-xl font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
                {dia.dia_semana !== null ? diaSemanaLabel[dia.dia_semana] : `Día ${dia.fecha}`}
              </h1>
            </div>
          </div>

          {fase && (
            <span
              className="inline-flex items-center gap-2 rounded-full border bg-white/50 px-3 py-1.5 text-xs font-semibold"
              style={{ borderColor: fase.color_acento ?? "#004a70", color: fase.color_texto ?? "#004a70" }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: fase.color_acento ?? "#004a70" }}
                aria-hidden="true"
              />
              Fase {fase.numero} · {fase.descuento}%
            </span>
          )}
        </div>
      </div>

      {/* Piezas del día */}
      {dia.piezas.length === 0 ? (
        <div className="card-3d p-8 text-center">
          <p className="text-sm font-medium text-[var(--color-tinta)]">
            Sin contenido asignado
          </p>
          <p className="mt-1 text-sm text-[var(--color-tinta-suave)]">
            Este día todavía no tiene piezas. El superadmin puede asignarlas desde
            la planificación.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {dia.piezas.map((pieza) => (
            <PiezaCard
              key={pieza.id}
              pieza={pieza}
              esSuperadmin={esSuperadmin}
              usuariosAsignables={usuariosAsignables}
              currentUserId={userId}
            />
          ))}
        </div>
      )}

      {esSuperadmin && (
        <PiezasEditor
          diaId={dia.id}
          piezas={dia.piezas.map((p) => ({
            id: p.id,
            tipo: p.tipo,
            orden: p.orden,
            gancho: p.gancho,
            titulo: p.titulo,
            descripcion_visual: p.descripcion_visual,
            cta: p.cta,
            caption: p.caption,
            intencion: p.intencion,
            descripcion: p.descripcion,
          }))}
        />
      )}
    </div>
  );
}
