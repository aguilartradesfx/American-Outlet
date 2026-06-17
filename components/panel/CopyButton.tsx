"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * Botón para copiar un caption (u otro texto) al portapapeles.
 * Muestra confirmación "Copiado" por unos segundos.
 */
export function CopyButton({
  text,
  label = "Copiar caption",
}: {
  text: string;
  label?: string;
}) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(text);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Fallback silencioso: si el portapapeles no está disponible, no rompe.
    }
  }

  return (
    <button
      type="button"
      onClick={copiar}
      aria-live="polite"
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
        copiado
          ? "border-emerald-300/70 bg-emerald-50 text-emerald-700"
          : "border-[var(--color-borde)] bg-white/70 text-[var(--color-tinta-suave)] hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-tinta)]"
      }`}
    >
      <Icon name={copiado ? "check" : "tag"} className="h-3.5 w-3.5" />
      {copiado ? "Copiado" : label}
    </button>
  );
}
