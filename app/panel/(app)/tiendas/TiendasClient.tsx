"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { crearTienda, actualizarTienda, eliminarTienda } from "./actions";

const inputCls =
  "w-full rounded-xl border border-[var(--color-borde)] bg-white/70 px-3 py-2 text-sm text-[var(--color-tinta)] outline-none transition focus:border-[var(--color-azul)] focus:bg-white";

type TiendaItem = { id: string; slug: string; nombre: string; activa: boolean };

export function TiendasClient({ tiendas }: { tiendas: TiendaItem[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");

  function run(fn: () => Promise<{ ok: boolean; error?: string }>, after?: () => void) {
    setError(null);
    startTransition(async () => {
      const r = await fn();
      if (!r.ok) setError(r.error ?? "Error");
      else {
        after?.();
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-7">
      {error && (
        <p role="alert" className="rounded-2xl border border-[var(--color-rojo)]/20 bg-[var(--color-rojo)]/5 px-4 py-3 text-sm text-[var(--color-rojo-700)]">
          {error}
        </p>
      )}

      <div className="card-3d p-6">
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
          Nueva tienda
        </h2>
        <p className="mt-1 text-sm text-[var(--color-tinta-suave)]">
          El slug se genera del nombre automáticamente.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="flex-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
            Nombre
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} className={`${inputCls} mt-1`} placeholder="American Outlet …" />
          </label>
          <button
            type="button"
            onClick={() => nombre.trim() && run(() => crearTienda({ nombre }), () => setNombre(""))}
            disabled={pending}
            className="rounded-full bg-[var(--color-azul-900)] px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            Crear tienda
          </button>
        </div>
      </div>

      <div className="card-3d p-6">
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
          Tiendas ({tiendas.length})
        </h2>
        <ul className="mt-4 space-y-2">
          {tiendas.map((t) => (
            <li key={t.id} className="surface flex flex-wrap items-center justify-between gap-3 p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--color-tinta)]">
                  {t.nombre}
                  {!t.activa && (
                    <span className="ml-2 rounded-full bg-[var(--color-niebla-2)] px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--color-tinta-tenue)]">
                      archivada
                    </span>
                  )}
                </p>
                <p className="text-xs text-[var(--color-tinta-tenue)]">{t.slug}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => run(() => actualizarTienda({ id: t.id, activa: !t.activa }))} disabled={pending} className="rounded-lg px-2 py-1 text-xs font-medium text-[var(--color-tinta-suave)] transition hover:bg-white disabled:opacity-60">
                  {t.activa ? "Archivar" : "Reactivar"}
                </button>
                <button type="button" onClick={() => run(() => eliminarTienda({ id: t.id }))} disabled={pending} className="rounded-lg px-2 py-1 text-xs font-medium text-[var(--color-tinta-tenue)] transition hover:text-[var(--color-rojo)] disabled:opacity-60">
                  Eliminar
                </button>
              </div>
            </li>
          ))}
          {tiendas.length === 0 && (
            <p className="text-sm text-[var(--color-tinta-tenue)]">No hay tiendas.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
