"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import type { MaterialVista } from "@/lib/panel/entregas";

function diasRestantes(eliminarEn: string | null): number | null {
  if (!eliminarEn) return null;
  const ms = new Date(eliminarEn).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86400_000));
}

/** TIENDA. Lista de materiales para descargar con aviso de borrado. */
export function MaterialesTienda({ materiales }: { materiales: MaterialVista[] }) {
  const router = useRouter();
  const [abierta, setAbierta] = useState<string | null>(null);

  function descargar(destinoId: string) {
    setAbierta(destinoId);
    // Abre la descarga; el servidor registra la descarga e inicia el contador.
    window.open(`/api/entregas/${destinoId}/descargar`, "_blank");
    // Refrescar para mostrar el aviso de "se eliminará en N días".
    setTimeout(() => router.refresh(), 2000);
  }

  if (materiales.length === 0) {
    return (
      <div className="card-3d p-8 text-center">
        <p className="text-sm font-medium text-[var(--color-tinta)]">
          No hay materiales para descargar.
        </p>
        <p className="mt-1 text-sm text-[var(--color-tinta-suave)]">
          Cuando subamos una imagen para tu tienda, aparecerá aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {materiales.map((m) => {
        const dias = diasRestantes(m.eliminarEn);
        const descargada = Boolean(m.descargadaEn);
        return (
          <article key={m.destinoId} className="card-3d overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.url}
              alt={m.nota ?? "Material para descargar"}
              className="max-h-80 w-full bg-[var(--color-azul-900)]/5 object-contain"
            />
            <div className="space-y-3 p-4">
              {m.nota && (
                <p className="text-sm leading-relaxed text-[var(--color-tinta)]">
                  {m.nota}
                </p>
              )}

              <button
                type="button"
                onClick={() => descargar(m.destinoId)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-azul-900)] px-4 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5"
              >
                <Icon name="arrow" className="h-4 w-4 rotate-90" />
                {descargada ? "Descargar de nuevo" : "Descargar imagen"}
              </button>

              {descargada ? (
                <p className="flex items-center gap-2 rounded-xl border border-amber-300/50 bg-amber-50/70 px-3 py-2 text-xs font-medium text-amber-800">
                  <Icon name="clock" className="h-4 w-4 shrink-0" />
                  {dias !== null && dias > 0
                    ? `Esta imagen se eliminará en ${dias} día${dias === 1 ? "" : "s"}.`
                    : "Esta imagen se eliminará hoy."}
                </p>
              ) : (
                <p className="text-xs text-[var(--color-tinta-tenue)]">
                  Al descargarla, se eliminará automáticamente 3 días después.
                </p>
              )}
              {abierta === m.destinoId && !descargada && (
                <p className="text-xs text-[var(--color-tinta-tenue)]">
                  Si ya la descargaste, actualizá la página para ver el aviso.
                </p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
