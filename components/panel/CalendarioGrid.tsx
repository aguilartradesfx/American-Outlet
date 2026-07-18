"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { tipoPiezaMeta } from "@/lib/panel/piezas";
import type { TipoPieza } from "@/lib/panel/piezas";
import type { DiaVista } from "@/lib/panel/vista";
import { DiaModal } from "@/components/panel/DiaModal";

const diasSemana = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"] as const;
// Etiqueta corta indexada por dia_semana (0=DOM..6=SÁB) para la vista móvil.
const diaSemanaCorto = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"] as const;

// Cada tipo de pieza se pinta con un tag pastel (fondo claro + texto del tono).
const tipoTag: Record<TipoPieza, string> = {
  post: "tag-pastel--azul",
  flyer: "tag-pastel--violeta",
  historia: "tag-pastel--rosa",
  reel: "tag-pastel--ambar",
  live: "tag-pastel--verde",
  carrusel: "tag-pastel--azul",
  cinema: "tag-pastel--violeta",
  activacion: "tag-pastel--rosa",
  mantenimiento: "tag-pastel--gris",
};

// dia_semana 0=DOM..6=SÁB → columna en grilla LUN-primero (0..6).
function colDeDiaSemana(ds: number | null): number {
  if (ds === null) return 0;
  return ds === 0 ? 6 : ds - 1;
}

export function CalendarioGrid({
  dias,
  mesTitulo,
  esSuperadmin,
  usuariosAsignables,
  currentUserId = null,
}: {
  dias: DiaVista[];
  mesTitulo: string;
  esSuperadmin: boolean;
  usuariosAsignables?: { id: string; nombre: string | null }[];
  currentUserId?: string | null;
}) {
  const [selId, setSelId] = useState<string | null>(null);
  // Derivar el día seleccionado de los datos vigentes → tras editar y refrescar,
  // el modal muestra las piezas actualizadas sin cerrarse.
  const sel = dias.find((d) => d.id === selId) ?? null;
  const offset = colDeDiaSemana(dias[0]?.dia_semana ?? null);

  return (
    <>
      {/* Móvil: lista vertical — la grilla de 7 columnas no cabe bien en teléfono. */}
      <div className="space-y-1.5 sm:hidden">
        {dias.map((dia) => {
          const fase = dia.fase;
          const principal = dia.piezas[0];
          const meta = principal ? tipoPiezaMeta[principal.tipo] : null;
          const extra = dia.piezas.length - 1;
          return (
            <button
              key={dia.id}
              type="button"
              onClick={() => setSelId(dia.id)}
              className="surface flex w-full items-center gap-3 p-3 text-left transition active:scale-[0.99]"
            >
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-[0.9rem] bg-[var(--p-bg)]">
                <span className="text-base font-semibold leading-none text-[var(--color-tinta)]">
                  {dia.fecha}
                </span>
                <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
                  {dia.dia_semana !== null ? diaSemanaCorto[dia.dia_semana] : ""}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                {meta && principal ? (
                  <>
                    <span className={`tag-pastel ${tipoTag[principal.tipo]}`}>
                      <Icon name={meta.icon} className="h-3 w-3" />
                      {meta.abrev}
                    </span>
                    <p className="mt-1 truncate text-sm font-medium text-[var(--color-tinta)]">
                      {principal.titulo || meta.label}
                    </p>
                  </>
                ) : (
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-tinta-tenue)]/70">
                    sin contenido
                  </p>
                )}
                {extra > 0 && (
                  <p className="mt-0.5 text-[11px] text-[var(--color-tinta-suave)]">
                    +{extra} más
                  </p>
                )}
              </div>
              {fase && (
                <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--p-line)] bg-[var(--p-bg)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-tinta-suave)]">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: fase.color_acento ?? "#004a70" }}
                    aria-hidden="true"
                  />
                  {fase.descuento}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop: grilla mensual de 7 columnas. */}
      <div className="card-3d hidden overflow-hidden p-3 sm:block">
        <div className="grid grid-cols-7 gap-2">
          {diasSemana.map((d) => (
            <div
              key={d}
              className="px-2 pb-1 text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-tinta-tenue)]"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: offset }).map((_, i) => (
            <div key={`pad-${i}`} aria-hidden="true" />
          ))}
          {dias.map((dia) => {
            const fase = dia.fase;
            const principal = dia.piezas[0];
            const meta = principal ? tipoPiezaMeta[principal.tipo] : null;
            const extra = dia.piezas.length - 1;
            return (
              <button
                key={dia.id}
                type="button"
                onClick={() => setSelId(dia.id)}
                className="surface group flex min-h-[6rem] flex-col gap-2 p-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--p-line-2)] sm:min-h-[7.5rem]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--color-tinta)]">
                    {dia.fecha}
                  </span>
                  {fase && (
                    <span
                      className="flex items-center gap-1 text-[10px] font-semibold text-[var(--color-tinta-tenue)]"
                      title={`Fase ${fase.numero} · ${fase.descuento}%`}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: fase.color_acento ?? "#004a70" }}
                        aria-hidden="true"
                      />
                      {fase.descuento}%
                    </span>
                  )}
                </div>

                <div className="mt-auto">
                  {meta && principal ? (
                    <div className={`rounded-xl border px-2 py-1.5 ${tipoTag[principal.tipo]}`}>
                      <span className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.08em]">
                        <Icon name={meta.icon} className="h-3 w-3 shrink-0" />
                        {meta.abrev}
                      </span>
                      <p className="mt-0.5 truncate text-[11px] font-medium leading-tight">
                        {principal.titulo || meta.label}
                      </p>
                      {extra > 0 && (
                        <p className="mt-0.5 text-[10px] leading-tight opacity-80">
                          +{extra} más
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="px-1 text-[10px] font-medium uppercase tracking-wide text-[var(--color-tinta-tenue)]/60">
                      sin contenido
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {sel && (
        <DiaModal
          dia={sel}
          mesTitulo={mesTitulo}
          esSuperadmin={esSuperadmin}
          usuariosAsignables={usuariosAsignables}
          currentUserId={currentUserId}
          onClose={() => setSelId(null)}
        />
      )}
    </>
  );
}
