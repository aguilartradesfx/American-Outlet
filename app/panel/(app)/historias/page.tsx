import type { Metadata } from "next";
import { playbooks, tiposPieza, totales } from "@/content/plan-junio-2026";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Guía Historias" };

export default function HistoriasPage() {
  return (
    <div className="space-y-7">
      {/* Intro */}
      <div className="card-3d p-6 sm:p-7">
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
          Playbooks de Historias
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-tinta-suave)]">
          Cada día principal arrastra una secuencia de 5 historias (H1–H5). Hay
          6 plantillas según el tipo de contenido principal del día. La historia
          H5 casi siempre cierra con{" "}
          <span className="font-medium text-[var(--color-tinta)]">
            ubicación + horario
          </span>{" "}
          — es lo más visto.
        </p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-borde)] bg-white/60 px-3 py-1 text-xs font-medium text-[var(--color-tinta-suave)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-azul)]" aria-hidden="true" />
          Meta del mes: {totales.historias} historias · ≈5 por día × 30
        </p>
      </div>

      {/* Playbooks */}
      <div className="grid gap-5 lg:grid-cols-2">
        {playbooks.map((pb) => (
          <article key={pb.tipo} className="card-3d lift-3d flex flex-col p-6">
            <header className="flex items-center gap-3 border-b border-[var(--color-borde)] pb-4">
              <span
                className="surface flex h-11 w-11 shrink-0 items-center justify-center text-[var(--color-tinta-suave)]"
                aria-hidden="true"
              >
                <Icon name={tiposPieza[pb.tipo].icon} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold tracking-[-0.01em] text-[var(--color-tinta)]">
                  {pb.titulo}
                </h3>
                <p className="text-xs text-[var(--color-tinta-tenue)]">{pb.subtitulo}</p>
              </div>
            </header>

            <ol className="mt-4 space-y-3">
              {pb.historias.map((h) => (
                <li key={h.id} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-azul-900)] text-[11px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                    {h.id}
                  </span>
                  <p className="text-sm leading-relaxed text-[var(--color-tinta-suave)]">
                    {h.momento && (
                      <span className="mr-1.5 rounded-md bg-[var(--color-niebla-2)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
                        {h.momento}
                      </span>
                    )}
                    {h.texto}
                  </p>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </div>
  );
}
