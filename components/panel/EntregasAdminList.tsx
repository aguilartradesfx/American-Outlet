"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import type { EntregaAdminVista } from "@/lib/panel/entregas";
import { eliminarEntrega } from "@/app/panel/(app)/entregas/actions";

function estadoDestino(d: EntregaAdminVista["destinos"][number]): {
  texto: string;
  cls: string;
} {
  if (d.eliminadaEn) {
    return { texto: "Eliminada", cls: "border-[var(--color-borde)] text-[var(--color-tinta-tenue)]" };
  }
  if (d.descargadaEn) {
    return { texto: "Descargada", cls: "border-emerald-300/60 bg-emerald-50 text-emerald-700" };
  }
  return { texto: "Pendiente", cls: "border-amber-300/60 bg-amber-50 text-amber-700" };
}

/** SUPERADMIN. Lista de entregas con el estado por tienda y opción de borrar. */
export function EntregasAdminList({ entregas }: { entregas: EntregaAdminVista[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function borrar(entregaId: string) {
    setError(null);
    startTransition(async () => {
      const r = await eliminarEntrega({ entregaId });
      if (!r.ok) {
        setError(r.error);
        return;
      }
      router.refresh();
    });
  }

  if (entregas.length === 0) {
    return (
      <div className="card-3d p-8 text-center">
        <p className="text-sm text-[var(--color-tinta-suave)]">
          Todavía no repartiste ningún material.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="rounded-xl border border-[var(--color-rojo)]/20 bg-[var(--color-rojo)]/5 px-3 py-2 text-sm text-[var(--color-rojo-700)]">
          {error}
        </p>
      )}
      {entregas.map((e) => (
        <article key={e.id} className="card-3d flex flex-col gap-4 p-4 sm:flex-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={e.url}
            alt={e.nota ?? "Material"}
            className="h-40 w-full shrink-0 rounded-xl bg-[var(--color-azul-900)]/5 object-contain sm:w-28"
          />
          <div className="min-w-0 flex-1">
            {e.nota ? (
              <p className="text-sm font-medium text-[var(--color-tinta)]">{e.nota}</p>
            ) : (
              <p className="text-sm italic text-[var(--color-tinta-tenue)]">Sin nota</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {e.destinos.map((d) => {
                const est = estadoDestino(d);
                return (
                  <span
                    key={d.destinoId}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${est.cls}`}
                  >
                    {d.tiendaNombre ?? "Tienda"} · {est.texto}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="flex shrink-0 items-start">
            <button
              type="button"
              onClick={() => borrar(e.id)}
              disabled={pending}
              aria-label="Eliminar entrega"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--color-tinta-tenue)] transition hover:text-[var(--color-rojo)] disabled:opacity-60"
            >
              <Icon name="alert" className="h-4 w-4" />
              Eliminar
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
