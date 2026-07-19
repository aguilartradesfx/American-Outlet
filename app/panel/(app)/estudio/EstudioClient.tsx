"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  generarImagen,
  guardarEnCloudinary,
  type ResultadoGuardado,
} from "./acciones";
import { optimizarImagen } from "./optimizar-imagen";

const inputCls =
  "w-full rounded-xl border border-[var(--color-borde)] bg-white/70 px-3 py-2 text-sm text-[var(--color-tinta)] outline-none transition focus:border-[var(--color-azul)] focus:bg-white";

// Mensajes que rotan durante la generación (sin revelar el motor).
const MENSAJES_CARGA = [
  "Analizando el producto…",
  "Imaginando la escena…",
  "Componiendo con el sello de marca…",
  "Ajustando luz y color…",
  "Puliendo los detalles…",
  "Casi listo…",
];

type Foto = { dataUri: string; base64: string; mime: string; nombre: string };

export function EstudioClient() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [foto, setFoto] = useState<Foto | null>(null);
  const [info, setInfo] = useState("");
  const [precioAnterior, setPrecioAnterior] = useState("");
  const [precioActual, setPrecioActual] = useState("");
  const [descuento, setDescuento] = useState("");
  const [nombre, setNombre] = useState("");

  const [generada, setGenerada] = useState<string | null>(null); // data URI
  const [textos, setTextos] = useState<string[]>([]);
  const [guardada, setGuardada] = useState<ResultadoGuardado | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [optimizando, setOptimizando] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);

  // Rota los mensajes de carga mientras se genera.
  const cargando = pending && !generada;
  useEffect(() => {
    if (!cargando) {
      setMsgIdx(0);
      return;
    }
    const id = setInterval(
      () => setMsgIdx((i) => (i + 1) % MENSAJES_CARGA.length),
      1800,
    );
    return () => clearInterval(id);
  }, [cargando]);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    // Optimización 100% en el navegador (sin tokens ni API): redimensiona y
    // recomprime. Así cualquier foto, incluso de varios MB de un celular, queda
    // liviana y nunca da error de subida.
    setOptimizando(true);
    try {
      const foto = await optimizarImagen(file);
      setFoto(foto);
      setGenerada(null);
      setGuardada(null);
    } catch {
      setError("No se pudo procesar la imagen. Probá con otra foto.");
    } finally {
      setOptimizando(false);
    }
  }

  function generar() {
    if (!foto) return;
    setError(null);
    setGenerada(null);
    setGuardada(null);
    startTransition(async () => {
      try {
        const r = await generarImagen({
          imagenBase64: foto.base64,
          mimeType: foto.mime,
          info,
          precioAnterior,
          precioActual,
          descuento,
        });
        if (!r.ok) return setError(r.error);
        setGenerada(r.data.dataUri);
        setTextos(r.data.textos);
      } catch {
        setError(
          "No se pudo generar la imagen. Probá de nuevo en un momento.",
        );
      }
    });
  }

  function guardar() {
    if (!generada) return;
    setError(null);
    startTransition(async () => {
      try {
        const r = await guardarEnCloudinary({ dataUri: generada, nombre: nombre || info });
        if (!r.ok) return setError(r.error);
        setGuardada(r.data);
      } catch {
        setError("No se pudo guardar la imagen. Probá de nuevo en un momento.");
      }
    });
  }

  async function copiar() {
    if (!guardada) return;
    await navigator.clipboard.writeText(guardada.url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  }

  function limpiar() {
    setFoto(null);
    setInfo("");
    setPrecioAnterior("");
    setPrecioActual("");
    setDescuento("");
    setNombre("");
    setGenerada(null);
    setTextos([]);
    setGuardada(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
          Estudio IA · Imágenes
        </h1>
        <p className="mt-1 text-sm text-[var(--color-tinta-tenue)]">
          Subí una foto de producto y generá una pieza con el sello de American Outlet:
          póster 1:1 sobre fondo blanco, con el logo oficial y la línea gráfica de la marca.
          El estilo es fijo; vos solo cambiás la info.
        </p>
      </header>

      {error && (
        <p role="alert" className="rounded-xl border border-[var(--color-rojo)]/20 bg-[var(--color-rojo)]/5 px-3 py-2 text-sm text-[var(--color-rojo-700)]">
          {error}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Columna izquierda: entrada */}
        <div className="card-3d space-y-4 p-6">
          <div className="flex items-center gap-2">
            <span className="surface flex h-9 w-9 items-center justify-center text-[var(--color-tinta-suave)]">
              <Icon name="image" className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
              Foto + info
            </h2>
          </div>

          {/* Dropzone / preview de la foto */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--color-borde)] bg-white/50 px-4 py-8 text-center transition hover:border-[var(--color-azul)] hover:bg-white"
          >
            {optimizando ? (
              <>
                <Icon name="image" className="h-8 w-8 text-[var(--color-tinta-tenue)]" />
                <span className="text-sm font-medium text-[var(--color-tinta-suave)]">
                  Optimizando la foto…
                </span>
              </>
            ) : foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={foto.dataUri} alt="Referencia" className="max-h-56 rounded-xl object-contain" />
            ) : (
              <>
                <Icon name="image" className="h-8 w-8 text-[var(--color-tinta-tenue)]" />
                <span className="text-sm font-medium text-[var(--color-tinta-suave)]">
                  Clic para subir la foto del producto
                </span>
                <span className="text-xs text-[var(--color-tinta-tenue)]">
                  JPG, PNG o WEBP · cualquier tamaño, se optimiza solo
                </span>
              </>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onFile}
            className="hidden"
          />
          {foto && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-xs font-medium text-[var(--color-azul)] hover:underline"
            >
              Cambiar foto
            </button>
          )}

          <label className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
            Info del producto / detalles
            <textarea
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              rows={5}
              placeholder="Escribí natural, como se lo dirías a un diseñador. Ej: 'Sillón mecedora beige, antes ₡149.990 ahora ₡124.990, 15% off solo hoy.' La IA interpreta y arma el texto promocional en la imagen."
              className={`${inputCls} mt-1`}
            />
            <span className="mt-1 block text-[11px] font-normal normal-case tracking-normal text-[var(--color-tinta-tenue)]">
              Si mencionás descuento, precio u oferta, la IA pone el texto en la imagen automáticamente.
            </span>
          </label>

          {/* Precio y descuento (todos opcionales) — alimentan el texto 3D de la imagen */}
          <fieldset className="space-y-2">
            <legend className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
              Precio y descuento (opcional)
            </legend>
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-[10px] font-medium uppercase tracking-wide text-[var(--color-tinta-tenue)]">
                Precio anterior
                <input
                  value={precioAnterior}
                  onChange={(e) => setPrecioAnterior(e.target.value)}
                  inputMode="numeric"
                  placeholder="₡149.990"
                  className={`${inputCls} mt-1`}
                />
              </label>
              <label className="block text-[10px] font-medium uppercase tracking-wide text-[var(--color-tinta-tenue)]">
                Precio actual
                <input
                  value={precioActual}
                  onChange={(e) => setPrecioActual(e.target.value)}
                  inputMode="numeric"
                  placeholder="₡124.990"
                  className={`${inputCls} mt-1`}
                />
              </label>
            </div>
            <label className="block text-[10px] font-medium uppercase tracking-wide text-[var(--color-tinta-tenue)]">
              % de descuento
              <input
                value={descuento}
                onChange={(e) => setDescuento(e.target.value)}
                inputMode="numeric"
                placeholder="15"
                className={`${inputCls} mt-1`}
              />
            </label>
            <span className="block text-[11px] font-normal normal-case tracking-normal text-[var(--color-tinta-tenue)]">
              Cualquiera que llenés se renderiza como badge de precio en 3D sobre la imagen.
            </span>
          </fieldset>

          <label className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
            Nombre del archivo (opcional)
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="zapatillas-deportivas"
              className={`${inputCls} mt-1`}
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={generar}
              disabled={pending || optimizando || !foto}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-azul-900)] px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Icon name="sparkle" className="h-4 w-4" />
              {cargando ? "Creando…" : "Generar imagen"}
            </button>
            {(foto || generada) && (
              <button
                type="button"
                onClick={limpiar}
                disabled={pending}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-borde)] px-5 py-2.5 text-sm font-medium text-[var(--color-tinta-suave)] transition hover:bg-white disabled:opacity-60"
              >
                <Icon name="refresh" className="h-4 w-4" />
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Columna derecha: resultado */}
        <div className="card-3d space-y-4 p-6">
          <div className="flex items-center gap-2">
            <span className="surface flex h-9 w-9 items-center justify-center text-[var(--color-tinta-suave)]">
              <Icon name="film" className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
              Resultado
            </h2>
          </div>

          {!generada && (
            <div className="flex aspect-square max-h-[28rem] w-full flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--color-borde)] bg-white/40">
              {cargando ? (
                <>
                  <span className="relative flex h-14 w-14 items-center justify-center">
                    <span className="absolute inset-0 animate-spin rounded-full border-2 border-[var(--color-azul)]/20 border-t-[var(--color-azul)]" />
                    <Icon name="sparkle" className="h-6 w-6 animate-pulse text-[var(--color-azul)]" />
                  </span>
                  <p className="text-sm font-medium text-[var(--color-tinta-suave)]">
                    {MENSAJES_CARGA[msgIdx]}
                  </p>
                  <span className="flex gap-1" aria-hidden="true">
                    {[0, 160, 320].map((d) => (
                      <span
                        key={d}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-azul)]"
                        style={{ animationDelay: `${d}ms` }}
                      />
                    ))}
                  </span>
                </>
              ) : (
                <p className="px-6 text-center text-sm text-[var(--color-tinta-tenue)]">
                  Acá aparece la imagen generada.
                </p>
              )}
            </div>
          )}

          {generada && (
            <>
              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={generada}
                  alt="Imagen generada"
                  className="max-h-[28rem] rounded-2xl object-contain shadow-[0_18px_40px_-18px_rgba(16,29,39,0.55)]"
                />
              </div>

              {textos.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-medium text-[var(--color-tinta-tenue)]">
                    Texto en la imagen:
                  </span>
                  {textos.map((t, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-[var(--color-azul-900)]/8 px-2.5 py-1 text-xs font-medium text-[var(--color-azul-900)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={guardar}
                  disabled={pending || !!guardada}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:opacity-60"
                >
                  <Icon name="check" className="h-4 w-4" />
                  {guardada ? "Guardada" : pending ? "Guardando…" : "Guardar en Cloudinary"}
                </button>
                <a
                  href={generada}
                  download={`${(nombre || "american-outlet").replace(/[^a-z0-9-]/gi, "-")}.png`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-borde)] px-5 py-2 text-sm font-medium text-[var(--color-tinta-suave)] transition hover:bg-white"
                >
                  <Icon name="image" className="h-4 w-4" />
                  Descargar
                </a>
                <button
                  type="button"
                  onClick={generar}
                  disabled={pending}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-borde)] px-5 py-2 text-sm font-medium text-[var(--color-tinta-suave)] transition hover:bg-white disabled:opacity-60"
                >
                  <Icon name="refresh" className="h-4 w-4" />
                  Regenerar
                </button>
              </div>

              {guardada && (
                <div className="surface space-y-2 p-3">
                  <p className="text-xs font-semibold text-[var(--color-tinta)]">
                    Subida a Cloudinary · {guardada.width}×{guardada.height}
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={guardada.url}
                      className={`${inputCls} font-mono text-xs`}
                      onFocus={(e) => e.currentTarget.select()}
                    />
                    <button
                      type="button"
                      onClick={copiar}
                      className="shrink-0 rounded-full bg-[var(--color-azul-900)] px-4 py-2 text-xs font-medium text-white transition hover:-translate-y-0.5"
                    >
                      {copiado ? "¡Copiado!" : "Copiar URL"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
