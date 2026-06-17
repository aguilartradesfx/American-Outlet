import {
  tipoPiezaMeta,
  tiposConCaption,
  tiposConIntencion,
} from "@/lib/panel/piezas";
import type { PiezaVista } from "@/lib/panel/vista";
import { Icon } from "@/components/ui/Icon";
import { CopyButton } from "@/components/panel/CopyButton";
import { CompletarPieza } from "@/components/panel/CompletarPieza";
import { AsignarPieza } from "@/components/panel/AsignarPieza";

function Campo({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-tinta-tenue)]">
        {etiqueta}
      </dt>
      <dd className="mt-1 whitespace-pre-line text-sm leading-relaxed text-[var(--color-tinta-suave)]">
        {valor}
      </dd>
    </div>
  );
}

/** Tarjeta de lectura de una pieza. Reutilizada por el detalle y el modal. */
export function PiezaCard({
  pieza,
  esSuperadmin = false,
  usuariosAsignables,
  currentUserId = null,
}: {
  pieza: PiezaVista;
  esSuperadmin?: boolean;
  usuariosAsignables?: { id: string; nombre: string | null }[];
  currentUserId?: string | null;
}) {
  const meta = tipoPiezaMeta[pieza.tipo];
  const esPost = tiposConCaption.includes(pieza.tipo);
  const esIntencion = tiposConIntencion.includes(pieza.tipo);
  const labelDescripcion =
    pieza.tipo === "carrusel"
      ? "Slides"
      : esPost
        ? "Texto en pieza"
        : "Descripción";

  return (
    <article className="card-3d p-6">
      <header className="flex items-center gap-3 border-b border-[var(--color-borde)] pb-4">
        <span
          className="surface flex h-11 w-11 shrink-0 items-center justify-center text-[var(--color-tinta-suave)]"
          aria-hidden="true"
        >
          <Icon name={meta.icon} className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-tinta-tenue)]">
            {meta.label}
          </p>
          <h3 className="truncate text-base font-semibold tracking-[-0.01em] text-[var(--color-tinta)]">
            {pieza.titulo || meta.label}
          </h3>
        </div>
      </header>

      <dl className="mt-4 space-y-4">
        {pieza.gancho && <Campo etiqueta="Gancho" valor={pieza.gancho} />}
        {pieza.descripcion_visual && (
          <Campo etiqueta="Contenido visual" valor={pieza.descripcion_visual} />
        )}
        {esIntencion && pieza.intencion && (
          <Campo etiqueta="Qué queremos transmitir" valor={pieza.intencion} />
        )}
        {pieza.descripcion && (
          <Campo etiqueta={labelDescripcion} valor={pieza.descripcion} />
        )}
        {pieza.cta && <Campo etiqueta="CTA" valor={pieza.cta} />}
      </dl>

      {esPost && pieza.caption && (
        <div className="mt-5 surface p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-tinta-tenue)]">
              Caption
            </p>
            <CopyButton text={pieza.caption} />
          </div>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[var(--color-tinta)]">
            {pieza.caption}
          </p>
        </div>
      )}

      {/* Asignación: el superadmin reasigna; el resto solo ve a quién le toca. */}
      <div className="mt-5 border-t border-[var(--color-borde)] pt-4">
        {esSuperadmin && usuariosAsignables ? (
          <AsignarPieza
            piezaId={pieza.id}
            asignadoAId={pieza.asignado_a_id}
            usuarios={usuariosAsignables}
          />
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-borde)] bg-white/60 px-3 py-1 text-xs font-medium text-[var(--color-tinta-suave)]">
            <Icon name="baby" className="h-4 w-4 text-[var(--color-tinta-tenue)]" />
            {pieza.asignado_a_nombre ? (
              <>Asignado a {pieza.asignado_a_nombre}</>
            ) : (
              "Sin asignar"
            )}
          </span>
        )}
      </div>

      <CompletarPieza
        piezaId={pieza.id}
        completadoEn={pieza.completado_en}
        completadoPorNombre={pieza.completado_por_nombre}
        completadoPorId={pieza.completado_por_id}
        currentUserId={currentUserId}
        esSuperadmin={esSuperadmin}
      />
    </article>
  );
}
