"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { tipoPiezaMeta } from "@/lib/panel/piezas";
import type { DiaVista } from "@/lib/panel/vista";
import { DiaModal } from "@/components/panel/DiaModal";

const diasSemana = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"] as const;
// Etiqueta corta indexada por dia_semana (0=DOM..6=SÁB) para la vista móvil.
const diaSemanaCorto = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"] as const;

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
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-[0.9rem] bg-white/70">
                <span className="text-base font-semibold leading-none text-[var(--color-tinta)]">
                  {dia.fecha}
                </span>
                <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
                  {dia.dia_semana !== null ? diaSemanaCorto[dia.dia_semana] : ""}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                {meta ? (
                  <div className="flex items-center gap-1.5">
                    <Icon
                      name={meta.icon}
                      className="h-4 w-4 shrink-0 text-[var(--color-tinta-suave)]"
                    />
                    <p className="truncate text-sm font-medium text-[var(--color-tinta)]">
                      {principal?.titulo || meta.abrev}
                    </p>
                  </div>
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
                <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--color-borde)] bg-white/60 px-2.5 py-1 text-[11px] font-semibold text-[var(--color-tinta-suave)]">
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

      {/* Desktop: grilla mensual de 7 columnas (sin cambios). */}
      <div className="card-3d hidden overflow-hidden p-1.5 sm:block">
        <div className="grid grid-cols-7 gap-1.5">
          {diasSemana.map((d) => (
            <div
              key={d}
              className="px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-tinta-tenue)]"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
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
                className="surface group flex min-h-[5.75rem] flex-col p-2.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/85 sm:min-h-[7rem]"
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

                <div className="mt-auto pt-2">
                  {meta ? (
                    <div className="flex items-start gap-1.5">
                      <Icon
                        name={meta.icon}
                        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-tinta-suave)]"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-medium leading-tight text-[var(--color-tinta)]">
                          {principal?.titulo || meta.abrev}
                        </p>
                        {extra > 0 && (
                          <p className="mt-0.5 text-[10px] leading-tight text-[var(--color-tinta-suave)]">
                            +{extra} más
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-tinta-tenue)]/60">
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
