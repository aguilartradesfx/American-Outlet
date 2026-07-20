"use client";

import { useState } from "react";
import { EstudioClient } from "./EstudioClient";
import { EstudioHistorial, type Historial } from "./EstudioHistorial";

export function EstudioTabs({
  esSuperadmin,
  historial,
}: {
  esSuperadmin: boolean;
  historial: Historial | null;
}) {
  const [tab, setTab] = useState<"generador" | "historial">("generador");

  // Sin historial (no superadmin): solo el generador.
  if (!esSuperadmin || !historial) return <EstudioClient />;

  return (
    <div className="space-y-5">
      <div className="flex gap-1.5">
        {(
          [
            ["generador", "Generador"],
            ["historial", "Historial y gastos"],
          ] as const
        ).map(([v, label]) => (
          <button
            key={v}
            type="button"
            onClick={() => setTab(v)}
            aria-pressed={tab === v}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === v
                ? "bg-[var(--color-azul)] text-white"
                : "border border-[var(--color-borde)] bg-white/60 text-[var(--color-tinta-suave)] hover:bg-white hover:text-[var(--color-tinta)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "generador" ? (
        <EstudioClient />
      ) : (
        <EstudioHistorial historial={historial} />
      )}
    </div>
  );
}
