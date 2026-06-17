"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { PiezaCard } from "@/components/panel/PiezaCard";
import { PiezasEditor } from "@/components/panel/PiezasEditor";
import type { DiaVista } from "@/lib/panel/vista";

const diaSemanaLabel = [
  "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado",
];

export function DiaModal({
  dia,
  mesTitulo,
  esSuperadmin,
  usuariosAsignables,
  currentUserId = null,
  onClose,
}: {
  dia: DiaVista;
  mesTitulo: string;
  esSuperadmin: boolean;
  usuariosAsignables?: { id: string; nombre: string | null }[];
  currentUserId?: string | null;
  onClose: () => void;
}) {
  // Cerrar con Escape + bloquear scroll del fondo mientras está abierto.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const fase = dia.fase;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[var(--color-azul-900)]/40 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Día ${dia.fecha}`}
    >
      <div
        className="my-4 w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="card-3d flex flex-wrap items-center justify-between gap-3 p-4 sm:gap-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="surface flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16">
              <span className="text-2xl font-semibold tracking-tight text-[var(--color-tinta)]">
                {dia.fecha}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-tinta-tenue)]">
                {mesTitulo}
              </p>
              <h2 className="mt-0.5 text-xl font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
                {dia.dia_semana !== null ? diaSemanaLabel[dia.dia_semana] : `Día ${dia.fecha}`}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-borde)] bg-white/70 text-[var(--color-tinta-suave)] transition hover:bg-white hover:text-[var(--color-tinta)]"
            >
              <Icon name="arrow" className="h-4 w-4 rotate-180" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="mt-4 space-y-4">
          {dia.piezas.length === 0 ? (
            <div className="card-3d p-8 text-center">
              <p className="text-sm font-medium text-[var(--color-tinta)]">Sin contenido asignado</p>
              <p className="mt-1 text-sm text-[var(--color-tinta-suave)]">
                {esSuperadmin
                  ? "Agregá la primera pieza abajo."
                  : "Este día todavía no tiene piezas."}
              </p>
            </div>
          ) : (
            dia.piezas.map((p) => (
              <PiezaCard
                key={p.id}
                pieza={p}
                esSuperadmin={esSuperadmin}
                usuariosAsignables={usuariosAsignables}
                currentUserId={currentUserId}
              />
            ))
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
      </div>
    </div>
  );
}
