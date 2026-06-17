"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { marcarPiezaCompletada } from "@/app/panel/(app)/planificacion/actions";

/**
 * Control de "Marcar como completado" para una pieza. Cualquier usuario del
 * panel puede marcarla; queda registrado el nombre de quien la completó.
 */
export function CompletarPieza({
  piezaId,
  completadoEn,
  completadoPorNombre,
  completadoPorId = null,
  currentUserId = null,
  esSuperadmin = false,
}: {
  piezaId: string;
  completadoEn: string | null;
  completadoPorNombre: string | null;
  completadoPorId?: string | null;
  currentUserId?: string | null;
  esSuperadmin?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const completado = Boolean(completadoEn);
  // Candado: solo quien lo marcó (o un superadmin) puede deshacerlo.
  const puedeDesmarcar =
    esSuperadmin || !completadoPorId || completadoPorId === currentUserId;

  function toggle(completar: boolean) {
    setError(null);
    startTransition(async () => {
      const r = await marcarPiezaCompletada({ piezaId, completar });
      if (!r.ok) {
        setError(r.error);
        return;
      }
      router.refresh();
    });
  }

  if (completado) {
    return (
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-300/50 bg-emerald-50/70 px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-medium text-emerald-800">
          <Icon name="check-circle" className="h-4.5 w-4.5 shrink-0" />
          Marcado como completado
          {completadoPorNombre ? <> por {completadoPorNombre}</> : null}
        </span>
        {puedeDesmarcar ? (
          <button
            type="button"
            onClick={() => toggle(false)}
            disabled={pending}
            className="rounded-lg px-2 py-1 text-xs font-medium text-emerald-700/80 underline-offset-2 transition hover:underline disabled:opacity-60"
          >
            {pending ? "…" : "Desmarcar"}
          </button>
        ) : (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-700/60">
            <Icon name="shield" className="h-3.5 w-3.5" />
            Solo {completadoPorNombre ?? "quien lo marcó"} puede deshacer
          </span>
        )}
        {error && (
          <p role="alert" className="w-full text-xs text-[var(--color-rojo-700)]">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={() => toggle(true)}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full border border-[var(--color-borde)] bg-white/70 px-4 py-2 text-sm font-medium text-[var(--color-tinta-suave)] transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:text-emerald-700 disabled:opacity-60"
      >
        <Icon name="check" className="h-4 w-4" />
        {pending ? "Marcando…" : "Marcar como completado"}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-xs text-[var(--color-rojo-700)]">
          {error}
        </p>
      )}
    </div>
  );
}
