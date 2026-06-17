"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { asignarPieza } from "@/app/panel/(app)/planificacion/actions";

/**
 * Selector de asignación de una pieza (solo superadmin). Override de la
 * auto-asignación por tipo. Muestra a quién está asignada y permite cambiarla.
 */
export function AsignarPieza({
  piezaId,
  asignadoAId,
  usuarios,
}: {
  piezaId: string;
  asignadoAId: string | null;
  usuarios: { id: string; nombre: string | null }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function cambiar(value: string) {
    setError(null);
    startTransition(async () => {
      const r = await asignarPieza({ piezaId, asignadoAId: value || null });
      if (!r.ok) {
        setError(r.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-tinta-tenue)]">
        <Icon name="baby" className="h-4 w-4" />
        Asignado a
      </span>
      <select
        value={asignadoAId ?? ""}
        onChange={(e) => cambiar(e.target.value)}
        disabled={pending}
        className="rounded-lg border border-[var(--color-borde)] bg-white/70 px-2.5 py-1.5 text-sm text-[var(--color-tinta)] outline-none transition focus:border-[var(--color-azul)] focus:bg-white disabled:opacity-60"
      >
        <option value="">Sin asignar</option>
        {usuarios.map((u) => (
          <option key={u.id} value={u.id}>
            {u.nombre ?? "—"}
          </option>
        ))}
      </select>
      {error && (
        <span role="alert" className="text-xs text-[var(--color-rojo-700)]">
          {error}
        </span>
      )}
    </div>
  );
}
