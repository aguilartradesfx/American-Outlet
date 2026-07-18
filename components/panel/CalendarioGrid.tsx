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

// Color base por tipo de pieza → del que se derivan los pasteles del día.
const tipoColor: Record<TipoPieza, string> = {
  post: "#1a73a8",
  carrusel: "#1a73a8",
  flyer: "#6d5bd0",
  cinema: "#6d5bd0",
  historia: "#c0392b",
  activacion: "#c0392b",
  reel: "#b26a12",
  live: "#1f8a54",
  mantenimiento: "#5b6472",
};

const pastelBg = (color: string) => `color-mix(in srgb, ${color} 12%, #fff)`;

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
          const color = principal ? tipoColor[principal.tipo] : null;
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
                {meta && principal && color ? (
                  <>
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{ backgroundColor: pastelBg(color), color }}
                    >
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

      {/* Desktop: grilla mensual contigua de 7 columnas, celdas grandes. */}
      <div className="hidden overflow-hidden rounded-2xl border border-[var(--p-line)] bg-white sm:block">
        {/* Cabecera de días */}
        <div className="grid grid-cols-7 bg-[var(--p-bg)]">
          {diasSemana.map((d) => (
            <div
              key={d}
              className="border-b border-[var(--p-line)] py-3 text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-tinta-tenue)]"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Celdas */}
        <div className="grid grid-cols-7">
          {Array.from({ length: offset }).map((_, i) => (
            <div
              key={`pad-${i}`}
              aria-hidden="true"
              className="min-h-[7rem] border-b border-r border-[var(--p-line)] bg-[var(--p-bg)]/50 lg:min-h-[8.5rem]"
            />
          ))}
          {dias.map((dia) => {
            const fase = dia.fase;
            const principal = dia.piezas[0];
            const meta = principal ? tipoPiezaMeta[principal.tipo] : null;
            const color = principal ? tipoColor[principal.tipo] : null;
            const extra = dia.piezas.length - 1;
            return (
              <button
                key={dia.id}
                type="button"
                onClick={() => setSelId(dia.id)}
                style={color ? { backgroundColor: pastelBg(color) } : undefined}
                className="group flex min-h-[7rem] flex-col gap-1.5 border-b border-r border-[var(--p-line)] p-3 text-left transition-colors hover:brightness-[0.98] lg:min-h-[8.5rem]"
              >
                <div className="flex items-start justify-between gap-2">
                  {meta && color ? (
                    <span
                      className="inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em]"
                      style={{ color }}
                    >
                      <Icon name={meta.icon} className="h-3 w-3 shrink-0" />
                      {meta.abrev}
                    </span>
                  ) : (
                    <span aria-hidden="true" />
                  )}
                  <span
                    className="text-sm font-semibold text-[var(--color-tinta)]"
                    style={color ? { color } : undefined}
                  >
                    {dia.fecha}
                  </span>
                </div>

                {meta && principal ? (
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-semibold leading-tight text-[var(--color-tinta)]">
                      {principal.titulo || meta.label}
                    </p>
                    {extra > 0 && (
                      <p className="mt-0.5 text-[11px] leading-tight text-[var(--color-tinta-suave)]">
                        +{extra} más
                      </p>
                    )}
                  </div>
                ) : null}

                <div className="mt-auto flex items-center justify-between gap-1">
                  {fase ? (
                    <span
                      className="flex items-center gap-1.5 text-[10px] font-semibold text-[var(--color-tinta-tenue)]"
                      title={`Fase ${fase.numero} · ${fase.descuento}%`}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: fase.color_acento ?? "#004a70" }}
                        aria-hidden="true"
                      />
                      {fase.descuento}%
                    </span>
                  ) : (
                    <span aria-hidden="true" />
                  )}
                  {dia.entregas.length > 0 && (
                    <span
                      className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600"
                      title={`${dia.entregas.length} entrega(s) subida(s)`}
                    >
                      <Icon name="check" className="h-3 w-3" />
                      {dia.entregas.length}
                    </span>
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
