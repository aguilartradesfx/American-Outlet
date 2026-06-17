"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import {
  tipoPiezaMeta,
  tiposConCaption,
  tiposConIntencion,
  ordenTipos,
  type TipoPieza,
} from "@/lib/panel/piezas";
import { guardarPieza, eliminarPieza } from "@/app/panel/(app)/planificacion/actions";

type PiezaForm = {
  id?: string;
  tipo: TipoPieza;
  orden: number;
  gancho: string;
  titulo: string;
  descripcionVisual: string;
  cta: string;
  caption: string;
  intencion: string;
  descripcion: string;
};

type PiezaInicial = {
  id: string;
  tipo: TipoPieza;
  orden: number;
  gancho: string | null;
  titulo: string | null;
  descripcion_visual: string | null;
  cta: string | null;
  caption: string | null;
  intencion: string | null;
  descripcion: string | null;
};

const inputCls =
  "w-full rounded-xl border border-[var(--color-borde)] bg-white/70 px-3 py-2 text-sm text-[var(--color-tinta)] outline-none transition focus:border-[var(--color-azul)] focus:bg-white";

function vacia(orden: number): PiezaForm {
  return {
    tipo: "post",
    orden,
    gancho: "",
    titulo: "",
    descripcionVisual: "",
    cta: "",
    caption: "",
    intencion: "",
    descripcion: "",
  };
}

export function PiezasEditor({
  diaId,
  piezas,
}: {
  diaId: string;
  piezas: PiezaInicial[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<PiezaForm | null>(null);

  function abrirNueva() {
    setError(null);
    setForm(vacia(piezas.length));
  }
  function abrirEdicion(p: PiezaInicial) {
    setError(null);
    setForm({
      id: p.id,
      tipo: p.tipo,
      orden: p.orden,
      gancho: p.gancho ?? "",
      titulo: p.titulo ?? "",
      descripcionVisual: p.descripcion_visual ?? "",
      cta: p.cta ?? "",
      caption: p.caption ?? "",
      intencion: p.intencion ?? "",
      descripcion: p.descripcion ?? "",
    });
  }

  function set(patch: Partial<PiezaForm>) {
    setForm((f) => (f ? { ...f, ...patch } : f));
  }

  function guardar() {
    if (!form) return;
    setError(null);
    startTransition(async () => {
      const r = await guardarPieza({ diaId, pieza: form });
      if (!r.ok) return setError(r.error);
      setForm(null);
      router.refresh();
    });
  }

  function borrar(id: string) {
    setError(null);
    startTransition(async () => {
      const r = await eliminarPieza({ piezaId: id });
      if (!r.ok) return setError(r.error);
      router.refresh();
    });
  }

  const esCaption = form && tiposConCaption.includes(form.tipo);
  const esIntencion = form && tiposConIntencion.includes(form.tipo);

  return (
    <div className="card-3d p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-[-0.01em] text-[var(--color-tinta)]">
          Editar piezas
        </h2>
        {!form && (
          <button
            type="button"
            onClick={abrirNueva}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-azul-900)] px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5"
          >
            <Icon name="sparkle" className="h-4 w-4" /> Agregar pieza
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 rounded-xl border border-[var(--color-rojo)]/20 bg-[var(--color-rojo)]/5 px-3 py-2 text-sm text-[var(--color-rojo-700)]">
          {error}
        </p>
      )}

      {/* Lista de piezas con acciones */}
      {piezas.length > 0 && !form && (
        <ul className="mt-4 space-y-2">
          {piezas.map((p) => (
            <li key={p.id} className="surface flex items-center justify-between gap-3 p-3">
              <span className="flex min-w-0 items-center gap-2 text-sm text-[var(--color-tinta)]">
                <Icon name={tipoPiezaMeta[p.tipo].icon} className="h-4 w-4 shrink-0 text-[var(--color-tinta-tenue)]" />
                <span className="truncate">{p.titulo || tipoPiezaMeta[p.tipo].label}</span>
              </span>
              <span className="flex shrink-0 gap-1">
                <button type="button" onClick={() => abrirEdicion(p)} className="rounded-lg px-2 py-1 text-xs font-medium text-[var(--color-tinta-suave)] transition hover:bg-white">Editar</button>
                <button type="button" onClick={() => borrar(p.id)} disabled={pending} className="rounded-lg px-2 py-1 text-xs font-medium text-[var(--color-tinta-tenue)] transition hover:text-[var(--color-rojo)] disabled:opacity-60">Eliminar</button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Formulario de alta/edición */}
      {form && (
        <div className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
              Tipo
              <select value={form.tipo} onChange={(e) => set({ tipo: e.target.value as TipoPieza })} className={`${inputCls} mt-1`}>
                {ordenTipos.map((t) => (
                  <option key={t} value={t}>{tipoPiezaMeta[t].label}</option>
                ))}
              </select>
            </label>
            <label className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
              Orden
              <input type="number" value={form.orden} onChange={(e) => set({ orden: Number(e.target.value) })} className={`${inputCls} mt-1`} />
            </label>
          </div>

          <Campo label="Título"><input value={form.titulo} onChange={(e) => set({ titulo: e.target.value })} className={inputCls} /></Campo>

          {esCaption && (
            <>
              <Campo label="Gancho"><input value={form.gancho} onChange={(e) => set({ gancho: e.target.value })} className={inputCls} /></Campo>
              <Campo label={form.tipo === "carrusel" ? "Slides" : "Texto en pieza"}><textarea value={form.descripcion} onChange={(e) => set({ descripcion: e.target.value })} rows={3} className={inputCls} /></Campo>
              <Campo label="Contenido visual"><textarea value={form.descripcionVisual} onChange={(e) => set({ descripcionVisual: e.target.value })} rows={2} className={inputCls} /></Campo>
              <Campo label="CTA"><input value={form.cta} onChange={(e) => set({ cta: e.target.value })} className={inputCls} /></Campo>
              <Campo label="Caption (copiable)"><textarea value={form.caption} onChange={(e) => set({ caption: e.target.value })} rows={4} className={inputCls} /></Campo>
            </>
          )}

          {esIntencion && (
            <Campo label="Qué queremos transmitir (intención, sin guion)">
              <textarea value={form.intencion} onChange={(e) => set({ intencion: e.target.value })} rows={3} className={inputCls} />
            </Campo>
          )}

          {!esCaption && !esIntencion && (
            <Campo label="Descripción">
              <textarea value={form.descripcion} onChange={(e) => set({ descripcion: e.target.value })} rows={3} className={inputCls} />
            </Campo>
          )}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={guardar} disabled={pending} className="rounded-full bg-[var(--color-azul-900)] px-5 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:opacity-60">
              {pending ? "Guardando…" : "Guardar pieza"}
            </button>
            <button type="button" onClick={() => setForm(null)} className="rounded-full border border-[var(--color-borde)] bg-white/70 px-5 py-2 text-sm font-medium text-[var(--color-tinta-suave)] transition hover:bg-white">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {piezas.length === 0 && !form && (
        <p className="mt-4 text-sm text-[var(--color-tinta-tenue)]">Este día no tiene piezas. Agregá la primera.</p>
      )}
    </div>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}
