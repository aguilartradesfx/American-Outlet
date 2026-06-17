"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import {
  crearMes,
  generarDias,
  setEstadoMes,
  guardarFases,
} from "./actions";
import { IngestaIA } from "./IngestaIA";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const inputCls =
  "w-full rounded-xl border border-[var(--color-borde)] bg-white/70 px-3 py-2 text-sm text-[var(--color-tinta)] outline-none transition focus:border-[var(--color-azul)] focus:bg-white";

type FaseForm = {
  numero: number;
  nombre: string;
  descuento: number;
  diaDesde: number;
  diaHasta: number;
  colorAcento: string;
  colorTexto: string;
};

type MesItem = {
  id: string;
  anio: number;
  mes: number;
  slug: string | null;
  titulo: string;
  bajada: string | null;
  estado: "borrador" | "publicado" | "archivado";
};

export function PlanificacionClient({
  meses,
  fasesPorMes,
}: {
  meses: MesItem[];
  fasesPorMes: Record<string, FaseForm[]>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // --- Crear mes ---
  const [anio, setAnio] = useState(2026);
  const [mesNum, setMesNum] = useState(7);

  function onCrearMes() {
    setError(null);
    startTransition(async () => {
      const titulo = `${MESES[mesNum - 1]} ${anio}`;
      const r = await crearMes({ anio, mes: mesNum, titulo });
      if (!r.ok) return setError(r.error);
      await generarDias({ mesId: r.data.mesId });
      router.refresh();
    });
  }

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const r = await fn();
      if (!r.ok) setError(r.error ?? "Error");
      else router.refresh();
    });
  }

  return (
    <div className="space-y-7">
      {error && (
        <p role="alert" className="rounded-2xl border border-[var(--color-rojo)]/20 bg-[var(--color-rojo)]/5 px-4 py-3 text-sm text-[var(--color-rojo-700)]">
          {error}
        </p>
      )}

      {/* Crear mes */}
      <div className="card-3d p-6">
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
          Nuevo mes
        </h2>
        <p className="mt-1 text-sm text-[var(--color-tinta-suave)]">
          Crea un mes en borrador y genera su grilla de días. Las tiendas no lo
          ven hasta que lo publiques.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
            Mes
            <select value={mesNum} onChange={(e) => setMesNum(Number(e.target.value))} className={`${inputCls} mt-1`}>
              {MESES.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
            Año
            <input type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} className={`${inputCls} mt-1 w-28`} />
          </label>
          <button
            type="button"
            onClick={onCrearMes}
            disabled={pending}
            className="rounded-full bg-[var(--color-azul-900)] px-5 py-2.5 text-sm font-medium text-white shadow-[0_10px_30px_-12px_rgba(16,29,39,0.8)] transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            Crear mes
          </button>
        </div>
      </div>

      {/* Ingesta con IA */}
      {meses.length > 0 && (
        <IngestaIA meses={meses.map((m) => ({ id: m.id, titulo: m.titulo }))} />
      )}

      {/* Lista de meses */}
      <div className="space-y-5">
        {meses.map((m) => (
          <MesCard
            key={m.id}
            mes={m}
            fases={fasesPorMes[m.id] ?? []}
            pending={pending}
            onPublicar={(estado) => run(() => setEstadoMes({ mesId: m.id, estado }))}
            onGenerarDias={() => run(() => generarDias({ mesId: m.id }))}
            onGuardarFases={(fases) => run(() => guardarFases({ mesId: m.id, fases }))}
          />
        ))}
        {meses.length === 0 && (
          <p className="text-sm text-[var(--color-tinta-tenue)]">Todavía no hay meses.</p>
        )}
      </div>
    </div>
  );
}

function MesCard({
  mes,
  fases,
  pending,
  onPublicar,
  onGenerarDias,
  onGuardarFases,
}: {
  mes: MesItem;
  fases: FaseForm[];
  pending: boolean;
  onPublicar: (estado: "borrador" | "publicado") => void;
  onGenerarDias: () => void;
  onGuardarFases: (fases: FaseForm[]) => void;
}) {
  const [editando, setEditando] = useState(false);
  const [filas, setFilas] = useState<FaseForm[]>(fases);

  function setFila(i: number, patch: Partial<FaseForm>) {
    setFilas((fs) => fs.map((f, j) => (j === i ? { ...f, ...patch } : f)));
  }
  function addFila() {
    setFilas((fs) => [
      ...fs,
      {
        numero: fs.length + 1,
        nombre: "",
        descuento: 0,
        diaDesde: 1,
        diaHasta: 1,
        colorAcento: "#004a70",
        colorTexto: "#004a70",
      },
    ]);
  }
  function delFila(i: number) {
    setFilas((fs) => fs.filter((_, j) => j !== i).map((f, k) => ({ ...f, numero: k + 1 })));
  }

  const publicado = mes.estado === "publicado";

  return (
    <article className="card-3d p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
            {mes.titulo}
          </h3>
          <p className="text-xs text-[var(--color-tinta-tenue)]">{mes.slug}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
            publicado
              ? "border-emerald-300/60 bg-emerald-50 text-emerald-700"
              : "border-amber-300/60 bg-amber-50 text-amber-700"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${publicado ? "bg-emerald-500" : "bg-amber-500"}`} />
          {mes.estado}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/panel/calendario"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-borde)] bg-white/70 px-4 py-2 text-sm font-medium text-[var(--color-tinta-suave)] transition hover:bg-white hover:text-[var(--color-tinta)]"
        >
          <Icon name="calendar" className="h-4 w-4" /> Ver calendario
        </Link>
        <button type="button" onClick={onGenerarDias} disabled={pending} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-borde)] bg-white/70 px-4 py-2 text-sm font-medium text-[var(--color-tinta-suave)] transition hover:bg-white hover:text-[var(--color-tinta)] disabled:opacity-60">
          <Icon name="refresh" className="h-4 w-4" /> Generar días
        </button>
        <button type="button" onClick={() => { setFilas(fases); setEditando((v) => !v); }} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-borde)] bg-white/70 px-4 py-2 text-sm font-medium text-[var(--color-tinta-suave)] transition hover:bg-white hover:text-[var(--color-tinta)]">
          <Icon name="chart" className="h-4 w-4" /> {editando ? "Cerrar fases" : "Editar fases"}
        </button>
        <button
          type="button"
          onClick={() => onPublicar(publicado ? "borrador" : "publicado")}
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-azul-900)] px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          <Icon name={publicado ? "shield" : "check"} className="h-4 w-4" />
          {publicado ? "Despublicar" : "Publicar"}
        </button>
      </div>

      {editando && (
        <div className="mt-5 surface p-4">
          <div className="space-y-3">
            {filas.map((f, i) => (
              <div key={i} className="grid grid-cols-2 items-end gap-2 sm:grid-cols-[3rem_1fr_4.5rem_4.5rem_4.5rem_3rem_2rem]">
                <Field label="N°"><input type="number" value={f.numero} onChange={(e) => setFila(i, { numero: Number(e.target.value) })} className={inputCls} /></Field>
                <Field label="Nombre"><input value={f.nombre} onChange={(e) => setFila(i, { nombre: e.target.value })} className={inputCls} /></Field>
                <Field label="% desc"><input type="number" value={f.descuento} onChange={(e) => setFila(i, { descuento: Number(e.target.value) })} className={inputCls} /></Field>
                <Field label="Día desde"><input type="number" value={f.diaDesde} onChange={(e) => setFila(i, { diaDesde: Number(e.target.value) })} className={inputCls} /></Field>
                <Field label="Día hasta"><input type="number" value={f.diaHasta} onChange={(e) => setFila(i, { diaHasta: Number(e.target.value) })} className={inputCls} /></Field>
                <Field label="Color"><input type="color" value={f.colorAcento || "#004a70"} onChange={(e) => setFila(i, { colorAcento: e.target.value, colorTexto: e.target.value })} className="h-9 w-full rounded-lg border border-[var(--color-borde)]" /></Field>
                <button type="button" onClick={() => delFila(i)} aria-label="Eliminar fase" className="mb-0.5 flex h-9 items-center justify-center rounded-lg text-[var(--color-tinta-tenue)] transition hover:text-[var(--color-rojo)]">✕</button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={addFila} className="rounded-full border border-[var(--color-borde)] bg-white/70 px-4 py-2 text-sm font-medium text-[var(--color-tinta-suave)] transition hover:bg-white">+ Fase</button>
            <button type="button" onClick={() => onGuardarFases(filas)} disabled={pending} className="rounded-full bg-[var(--color-azul-900)] px-5 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:opacity-60">Guardar fases</button>
          </div>
        </div>
      )}
    </article>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}
