"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { tipoPiezaMeta } from "@/lib/panel/piezas";
import type { PreviewIngesta } from "@/lib/panel/ingesta";
import { analizarMesConIA, guardarIngesta } from "./ia";

const inputCls =
  "w-full rounded-xl border border-[var(--color-borde)] bg-white/70 px-3 py-2 text-sm text-[var(--color-tinta)] outline-none transition focus:border-[var(--color-azul)] focus:bg-white";

export function IngestaIA({ meses }: { meses: { id: string; titulo: string }[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [mesId, setMesId] = useState(meses[0]?.id ?? "");
  const [fuente, setFuente] = useState("");
  const [preview, setPreview] = useState<PreviewIngesta | null>(null);

  function analizar() {
    setError(null);
    setOk(null);
    setPreview(null);
    startTransition(async () => {
      const r = await analizarMesConIA({ mesId, fuente });
      if (!r.ok) return setError(r.error);
      setPreview(r.data);
      if (r.data.dias.length === 0) setError("La IA no encontró días para estructurar.");
    });
  }

  function guardar() {
    if (!preview) return;
    setError(null);
    startTransition(async () => {
      const r = await guardarIngesta({ mesId, preview });
      if (!r.ok) return setError(r.error);
      setOk(`Guardado: ${r.data.piezasCreadas} piezas en ${preview.dias.length} días.`);
      setPreview(null);
      setFuente("");
      router.refresh();
    });
  }

  const totalPiezas = preview?.dias.reduce((n, d) => n + d.piezas.length, 0) ?? 0;

  return (
    <div className="card-3d p-6">
      <div className="flex items-center gap-2">
        <span className="surface flex h-9 w-9 items-center justify-center text-[var(--color-tinta-suave)]">
          <Icon name="sparkle" className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
            Ingesta con IA
          </h2>
          <p className="text-xs text-[var(--color-tinta-tenue)]">
            Pegá el texto del mes y Claude lo ordena por día. Revisás antes de guardar.
          </p>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-[var(--color-rojo)]/20 bg-[var(--color-rojo)]/5 px-3 py-2 text-sm text-[var(--color-rojo-700)]">
          {error}
        </p>
      )}
      {ok && (
        <p className="mt-4 rounded-xl border border-emerald-300/60 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {ok}
        </p>
      )}

      <div className="mt-4 space-y-3">
        <label className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
          Mes destino
          <select value={mesId} onChange={(e) => setMesId(e.target.value)} className={`${inputCls} mt-1 max-w-xs`}>
            {meses.map((m) => (
              <option key={m.id} value={m.id}>{m.titulo}</option>
            ))}
          </select>
        </label>

        <label className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
          Texto del plan
          <textarea
            value={fuente}
            onChange={(e) => setFuente(e.target.value)}
            rows={8}
            placeholder="Pegá acá todo el plan del mes (día por día, captions, fases, actividades…)."
            className={`${inputCls} mt-1 font-mono text-xs`}
          />
        </label>

        <button
          type="button"
          onClick={analizar}
          disabled={pending || !mesId || !fuente.trim()}
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-azul-900)] px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          <Icon name="sparkle" className="h-4 w-4" />
          {pending && !preview ? "Analizando…" : "Analizar con IA"}
        </button>
      </div>

      {/* Preview */}
      {preview && preview.dias.length > 0 && (
        <div className="mt-6 border-t border-[var(--color-borde)] pt-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--color-tinta)]">
              Preview · {preview.dias.length} días · {totalPiezas} piezas
            </p>
            <button
              type="button"
              onClick={guardar}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Icon name="check" className="h-4 w-4" />
              {pending ? "Guardando…" : "Guardar todo"}
            </button>
          </div>

          <div className="mt-4 max-h-[28rem] space-y-3 overflow-y-auto pr-1">
            {preview.dias.map((d) => (
              <div key={d.fecha} className="surface p-3">
                <p className="text-xs font-semibold text-[var(--color-tinta)]">Día {d.fecha}</p>
                <ul className="mt-2 space-y-1.5">
                  {d.piezas.map((p, i) => (
                    <li key={i} className="flex gap-2 text-xs text-[var(--color-tinta-suave)]">
                      <Icon name={tipoPiezaMeta[p.tipo].icon} className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-tinta-tenue)]" />
                      <span className="min-w-0">
                        <span className="font-medium text-[var(--color-tinta)]">
                          {tipoPiezaMeta[p.tipo].label}
                          {p.titulo ? ` · ${p.titulo}` : ""}
                        </span>
                        {p.caption && <span className="line-clamp-2 block">{p.caption}</span>}
                        {p.intencion && <span className="line-clamp-2 block italic">{p.intencion}</span>}
                        {p.descripcion && <span className="line-clamp-2 block">{p.descripcion}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
