"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { subirPromo, actualizarPromo, eliminarPromo } from "./actions";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const inputCls =
  "w-full rounded-xl border border-[var(--color-borde)] bg-white/70 px-3 py-2 text-sm text-[var(--color-tinta)] outline-none transition focus:border-[var(--color-azul)] focus:bg-white";

type PromoItem = {
  id: string;
  anio: number;
  mes: number;
  titulo: string | null;
  enlace: string | null;
  imagen_url: string | null;
  activa: boolean;
};

export function PromosClient({ promos }: { promos: PromoItem[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const ahora = new Date();
  const [anio, setAnio] = useState(ahora.getFullYear());
  const [mes, setMes] = useState(ahora.getMonth() + 1);
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [enlace, setEnlace] = useState("");
  const [ctaTexto, setCtaTexto] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  function onSubir() {
    setError(null);
    setOk(null);
    const file = fileRef.current?.files?.[0];
    if (!file) return setError("Elegí una imagen para el banner.");
    const fd = new FormData();
    fd.set("anio", String(anio));
    fd.set("mes", String(mes));
    fd.set("titulo", titulo);
    fd.set("subtitulo", subtitulo);
    fd.set("enlace", enlace);
    fd.set("cta_texto", ctaTexto);
    fd.set("file", file);
    startTransition(async () => {
      const r = await subirPromo(fd);
      if (!r.ok) return setError(r.error);
      setOk("Banner subido y publicado. La imagen anterior de ese mes se eliminó.");
      setPreview(null);
      setTitulo("");
      setSubtitulo("");
      setEnlace("");
      setCtaTexto("");
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    });
  }

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    setOk(null);
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
      {ok && (
        <p className="rounded-2xl border border-emerald-300/60 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {ok}
        </p>
      )}

      {/* Subir / reemplazar banner */}
      <div className="card-3d p-6">
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
          Banner de promo mensual
        </h2>
        <p className="mt-1 text-sm text-[var(--color-tinta-suave)]">
          La imagen se convierte a WebP y se sube a Supabase. Si ese mes ya tenía
          banner, la imagen anterior se elimina y queda la nueva.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
            Mes
            <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className={`${inputCls} mt-1`}>
              {MESES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </label>
          <label className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
            Año
            <input type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} className={`${inputCls} mt-1`} />
          </label>
          <label className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
            Título (titular del banner)
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} className={`${inputCls} mt-1`} placeholder="15% OFF para papá" />
          </label>
          <label className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)] sm:col-span-2">
            Subtítulo (descripción sobre el banner)
            <input value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} className={`${inputCls} mt-1`} placeholder="Registrate gratis y llevate tu cupón…" />
          </label>
          <label className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
            Enlace del botón (opcional)
            <input value={enlace} onChange={(e) => setEnlace(e.target.value)} className={`${inputCls} mt-1`} placeholder="/promo · https://wa.me/…" />
          </label>
          <label className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
            Texto del botón (CTA)
            <input value={ctaTexto} onChange={(e) => setCtaTexto(e.target.value)} className={`${inputCls} mt-1`} placeholder="Registrate y llevate tu cupón" />
          </label>
        </div>
        <p className="mt-2 text-xs text-[var(--color-tinta-tenue)]">
          Si ponés texto del botón, el banner muestra un botón rojo con ese texto que lleva al enlace. Si no, la imagen entera enlaza (o no enlaza si dejás el enlace vacío).
        </p>

        <div className="mt-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFile}
            className="block w-full text-sm text-[var(--color-tinta-suave)] file:mr-3 file:rounded-full file:border-0 file:bg-[var(--color-azul-900)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90"
          />
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Vista previa" className="mt-3 max-h-56 w-auto rounded-xl ring-1 ring-[var(--color-borde)]" />
          )}
        </div>

        <button
          type="button"
          onClick={onSubir}
          disabled={pending}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-azul-900)] px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          <Icon name="sparkle" className="h-4 w-4" />
          {pending ? "Subiendo…" : "Subir y publicar"}
        </button>
      </div>

      {/* Promos existentes */}
      <div className="card-3d p-6">
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
          Promos ({promos.length})
        </h2>
        <ul className="mt-4 space-y-3">
          {promos.map((p) => (
            <li key={p.id} className="surface flex flex-wrap items-center gap-4 p-3">
              {p.imagen_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imagen_url} alt={p.titulo ?? ""} className="h-16 w-28 shrink-0 rounded-lg object-cover ring-1 ring-[var(--color-borde)]" />
              ) : (
                <div className="h-16 w-28 shrink-0 rounded-lg bg-[var(--color-niebla-2)]" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--color-tinta)]">
                  {MESES[p.mes - 1]} {p.anio}
                </p>
                <p className="truncate text-xs text-[var(--color-tinta-tenue)]">
                  {p.titulo || "Sin título"}{p.enlace ? ` · ${p.enlace}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${p.activa ? "border-emerald-300/60 bg-emerald-50 text-emerald-700" : "border-[var(--color-borde)] bg-white/60 text-[var(--color-tinta-tenue)]"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${p.activa ? "bg-emerald-500" : "bg-[var(--color-tinta-tenue)]"}`} />
                  {p.activa ? "activa" : "oculta"}
                </span>
                <button type="button" onClick={() => run(() => actualizarPromo({ id: p.id, titulo: p.titulo ?? undefined, enlace: p.enlace ?? undefined, activa: !p.activa }))} disabled={pending} className="rounded-lg px-2 py-1 text-xs font-medium text-[var(--color-tinta-suave)] transition hover:bg-white disabled:opacity-60">
                  {p.activa ? "Ocultar" : "Activar"}
                </button>
                <button type="button" onClick={() => run(() => eliminarPromo({ id: p.id }))} disabled={pending} className="rounded-lg px-2 py-1 text-xs font-medium text-[var(--color-tinta-tenue)] transition hover:text-[var(--color-rojo)] disabled:opacity-60">
                  Eliminar
                </button>
              </div>
            </li>
          ))}
          {promos.length === 0 && (
            <p className="text-sm text-[var(--color-tinta-tenue)]">Todavía no hay ninguna promo. Subí la primera arriba.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
