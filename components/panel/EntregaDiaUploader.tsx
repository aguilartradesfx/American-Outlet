"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import type { EntregaVista } from "@/lib/panel/vista";
import {
  subirEntregaDia,
  borrarEntregaDia,
} from "@/app/panel/(app)/calendario/entregas-acciones";

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString("es-CR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EntregaDiaUploader({
  diaId,
  entregas,
  currentUserId,
  esSuperadmin,
}: {
  diaId: string;
  entregas: EntregaVista[];
  currentUserId: string | null;
  esSuperadmin: boolean;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSubiendo(true);
    const fd = new FormData();
    fd.set("diaId", diaId);
    fd.set("file", file);
    const res = await subirEntregaDia(fd);
    setSubiendo(false);
    if (inputRef.current) inputRef.current.value = "";
    if (!res.ok) {
      setError(res.error);
      return;
    }
    startTransition(() => router.refresh());
  }

  async function onDelete(id: string) {
    setError(null);
    const res = await borrarEntregaDia({ entregaId: id });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <div className="card-3d p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-tinta-tenue)]">
            Entregar contenido
          </p>
          <p className="mt-0.5 text-sm text-[var(--color-tinta-suave)]">
            Subí lo que se publicó este día. Queda como registro (quién y cuándo);
            luego solo lo puede cambiar quien lo subió o un superadmin.
          </p>
        </div>
        <label className="shrink-0 cursor-pointer">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onFile}
            disabled={subiendo}
          />
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-azul)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
            <Icon name={subiendo ? "sparkle" : "image"} className="h-4 w-4" />
            {subiendo ? "Subiendo…" : "Subir imagen"}
          </span>
        </label>
      </div>

      {error && (
        <p className="mt-3 text-sm font-medium text-[var(--color-rojo)]">{error}</p>
      )}

      {entregas.length > 0 ? (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {entregas.map((e) => {
            const puedeBorrar = esSuperadmin || e.subido_por_id === currentUserId;
            return (
              <li key={e.id} className="surface overflow-hidden">
                <a href={e.url} target="_blank" rel="noopener noreferrer" className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={e.url}
                    alt={e.nota ?? "Entrega"}
                    className="aspect-square w-full object-cover"
                  />
                </a>
                <div className="flex items-start justify-between gap-1 p-2">
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium text-[var(--color-tinta)]">
                      {e.subido_por_nombre ?? "—"}
                    </p>
                    <p className="text-[10px] text-[var(--color-tinta-tenue)]">
                      {formatFecha(e.creado_en)}
                    </p>
                  </div>
                  {puedeBorrar && (
                    <button
                      type="button"
                      onClick={() => onDelete(e.id)}
                      disabled={pending}
                      aria-label="Borrar entrega"
                      className="shrink-0 text-[var(--color-tinta-tenue)] transition hover:text-[var(--color-rojo)]"
                    >
                      <Icon name="x" className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-[var(--color-tinta-tenue)]">
          Todavía no hay entregas para este día.
        </p>
      )}
    </div>
  );
}
