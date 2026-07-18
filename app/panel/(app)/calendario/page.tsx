import type { Metadata } from "next";
import Link from "next/link";
import {
  getMesActivo,
  getFasesDeMes,
  getDiasDeMes,
  getUsuariosAsignables,
  getTiendas,
  getTiendaActual,
} from "@/lib/panel/datos";
import { getUsuarioYRol } from "@/lib/auth/guards";
import type { DiaVista } from "@/lib/panel/vista";
import { CalendarioGrid } from "@/components/panel/CalendarioGrid";

export const metadata: Metadata = { title: "Calendario" };

function SinTienda({ mensaje }: { mensaje: string }) {
  return (
    <div className="card-3d p-8 text-center">
      <p className="text-sm text-[var(--color-tinta-suave)]">{mensaje}</p>
    </div>
  );
}

export default async function CalendarioPage({
  searchParams,
}: {
  searchParams: Promise<{ tienda?: string }>;
}) {
  const [{ userId, rol }, tiendaActual] = await Promise.all([
    getUsuarioYRol(),
    getTiendaActual(),
  ]);
  const esSuperadmin = rol === "superadmin";
  const esAdmin = rol === "admin" || esSuperadmin;

  // Resolver de qué tienda es el calendario que se muestra.
  // Usuario de tienda → el suyo. Admin/superadmin → el seleccionado (?tienda=slug), default Ciudad Quesada.
  const tiendas = esAdmin ? await getTiendas() : [];
  let tiendaId: string;
  let tiendaSlug: string;
  if (esAdmin) {
    const sel = (await searchParams)?.tienda;
    const t =
      tiendas.find((x) => x.slug === sel) ??
      tiendas.find((x) => x.slug === "ciudad-quesada") ??
      tiendas[0];
    if (!t) return <SinTienda mensaje="No hay tiendas configuradas." />;
    tiendaId = t.id;
    tiendaSlug = t.slug;
  } else {
    if (!tiendaActual) {
      return <SinTienda mensaje="Tu usuario no tiene una tienda asignada." />;
    }
    tiendaId = tiendaActual.tiendaId;
    tiendaSlug = tiendaActual.slug;
  }

  // Selector de tienda (solo admin/superadmin).
  const selector = esAdmin ? (
    <div className="flex flex-wrap gap-1.5">
      {tiendas.map((t) => {
        const activo = t.slug === tiendaSlug;
        return (
          <Link
            key={t.id}
            href={`/panel/calendario?tienda=${t.slug}`}
            aria-current={activo ? "page" : undefined}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              activo
                ? "bg-[var(--color-azul)] text-white"
                : "border border-[var(--p-line)] bg-white text-[var(--color-tinta-suave)] hover:bg-[var(--p-active)] hover:text-[var(--color-azul)]"
            }`}
          >
            {t.nombre.replace(/^American Outlet\s*/, "")}
          </Link>
        );
      })}
    </div>
  ) : null;

  const mes = await getMesActivo(tiendaId);
  if (!mes) {
    return (
      <div className="space-y-6">
        {selector}
        <SinTienda mensaje="Esta tienda todavía no tiene un mes de contenido." />
      </div>
    );
  }

  const [fases, dias] = await Promise.all([
    getFasesDeMes(mes.id),
    getDiasDeMes(mes.id),
  ]);
  const usuariosAsignables = esSuperadmin ? await getUsuariosAsignables() : undefined;

  const totalPiezas = dias.reduce((n, d) => n + d.piezas.length, 0);
  const diasConContenido = dias.filter((d) => d.piezas.length > 0).length;

  const diasVista: DiaVista[] = dias.map((d) => ({
    id: d.id,
    fecha: d.fecha,
    dia_semana: d.dia_semana,
    fase: d.fase
      ? {
          numero: d.fase.numero,
          nombre: d.fase.nombre,
          descuento: d.fase.descuento,
          color_acento: d.fase.color_acento,
          color_texto: d.fase.color_texto,
        }
      : null,
    piezas: d.piezas,
  }));

  return (
    <div className="space-y-7">
      {selector}

      {/* Resumen del mes */}
      <div className="card-3d flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-tinta-tenue)]">
            {mes.titulo}
          </p>
          <p className="mt-1 text-sm text-[var(--color-tinta-suave)]">
            {diasConContenido} de {dias.length} días con contenido · {totalPiezas} piezas
          </p>
        </div>
        {mes.estado !== "publicado" && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/60 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
            Borrador
          </span>
        )}
      </div>

      {/* Leyenda de fases (solo si el mes tiene fases) */}
      {fases.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {fases.map((f) => (
            <div key={f.id} className="surface lift-3d flex items-center gap-3 p-4">
              <span
                className="h-9 w-9 shrink-0 rounded-full"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${f.color_acento ?? "#004a70"}, ${f.color_texto ?? "#004a70"})`,
                  boxShadow: `inset 0 1px 1px rgba(255,255,255,0.4), 0 6px 14px -6px ${f.color_acento ?? "#004a70"}`,
                }}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-tinta-tenue)]">
                  Fase {f.numero} · {f.nombre}
                </p>
                <p className="mt-0.5 flex items-baseline gap-2">
                  <span className="text-xl font-semibold tracking-tight text-[var(--color-tinta)]">
                    {f.descuento}%
                  </span>
                  <span className="truncate text-xs text-[var(--color-tinta-suave)]">
                    Días {f.dia_desde}–{f.dia_hasta}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cuadrícula clickeable (abre modal por día) */}
      <CalendarioGrid
        dias={diasVista}
        mesTitulo={mes.titulo}
        esSuperadmin={esSuperadmin}
        usuariosAsignables={usuariosAsignables}
        currentUserId={userId}
      />
    </div>
  );
}
