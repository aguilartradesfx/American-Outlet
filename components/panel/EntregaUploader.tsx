"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { subirEntrega } from "@/app/panel/(app)/entregas/actions";

const inputCls =
  "w-full rounded-xl border border-[var(--color-borde)] bg-white/70 px-3 py-2 text-sm text-[var(--color-tinta)] outline-none transition focus:border-[var(--color-azul)] focus:bg-white";

/** SUPERADMIN. Sube una imagen y elige a qué tiendas repartirla. */
export function EntregaUploader({
  tiendas,
}: {
  tiendas: { slug: string; nombre: string }[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOk(false);
    const fd = new FormData(e.currentTarget);
    if (fd.getAll("tiendas").length === 0) {
      setError("Elegí al menos una tienda.");
      return;
    }
    startTransition(async () => {
      const r = await subirEntrega(fd);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setOk(true);
      formRef.current?.reset();
      router.refresh();
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="card-3d space-y-4 p-6">
      <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
        Subir material para una tienda
      </h2>
      <p className="text-sm text-[var(--color-tinta-suave)]">
        La imagen se optimiza (liviana) y queda disponible para que la tienda la
        descargue y la suba a su estado/historia. Se borra sola 3 días después de
        descargada (o 14 días si nadie la descarga).
      </p>

      <label className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
        Imagen
        <input type="file" name="file" accept="image/*" required className={`${inputCls} mt-1`} />
      </label>

      <label className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
        Nota / instrucción (opcional)
        <input
          type="text"
          name="nota"
          placeholder="Ej. Subir hoy a la historia · arroba a la cuenta"
          className={`${inputCls} mt-1`}
        />
      </label>

      <fieldset className="space-y-2">
        <legend className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
          Tiendas destino
        </legend>
        <div className="flex flex-wrap gap-2">
          {tiendas.map((t) => (
            <label
              key={t.slug}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-borde)] bg-white/60 px-3 py-1.5 text-sm text-[var(--color-tinta-suave)] transition hover:bg-white has-[:checked]:border-[var(--color-azul)] has-[:checked]:bg-[var(--color-azul-900)] has-[:checked]:text-white"
            >
              <input type="checkbox" name="tiendas" value={t.slug} className="accent-[var(--color-azul-900)]" />
              {t.nombre}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-azul-900)] px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          <Icon name="broadcast" className="h-4 w-4" />
          {pending ? "Subiendo…" : "Subir y repartir"}
        </button>
        {ok && <span className="text-sm text-emerald-700">✓ Material repartido.</span>}
      </div>
      {error && (
        <p role="alert" className="text-sm text-[var(--color-rojo-700)]">
          {error}
        </p>
      )}
    </form>
  );
}
