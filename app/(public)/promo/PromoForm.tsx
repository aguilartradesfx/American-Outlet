"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import { CopyButton } from "@/components/panel/CopyButton";
import { CuponTicket } from "@/components/promo/CuponTicket";
import { trackEvent } from "@/lib/analytics/track";
import { registrarLead } from "./actions";

const inputCls =
  "w-full rounded-2xl border border-[var(--color-borde)] bg-white/80 px-4 py-3 text-sm text-[var(--color-tinta)] outline-none transition focus:border-[var(--color-azul)] focus:bg-white";

export function PromoForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [res, setRes] = useState<{ cupon: string; nombre: string; yaRegistrado: boolean } | null>(null);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const r = await registrarLead({ nombre, correo, whatsapp });
      if (!r.ok) return setError(r.error);
      // Conversión solo en lead NUEVO (no en quien ya estaba registrado).
      if (!r.data.yaRegistrado) {
        trackEvent("generate_lead", {
          lead_type: "promo_cupon",
          lead_origen: "banner-junio-2026",
          // Advanced matching de Meta — Adsmurai los hashea server-side (mejor EMQ).
          // NO mapear estos campos al tag de GA4 (PII prohibida en GA4).
          customer_email: correo,
          customer_phone: whatsapp,
          customer_name: nombre,
        });
      }
      setRes(r.data);
    });
  }

  if (res) {
    const descargaUrl = `/cupon?code=${encodeURIComponent(res.cupon)}&nombre=${encodeURIComponent(res.nombre)}`;
    return (
      <div className="card-3d p-7 text-center sm:p-9">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <Icon name="check" className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
          {res.yaRegistrado ? `¡Ya estabas registrado, ${res.nombre}!` : `¡Listo, ${res.nombre}!`}
        </h2>
        <p className="mt-1 text-sm text-[var(--color-tinta-suave)]">
          Este es tu cupón. Descargalo o tomale una captura y mostralo en cualquiera de nuestras tiendas.
        </p>

        <div className="mt-6">
          <CuponTicket nombre={res.nombre} codigo={res.cupon} />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <a
            href={descargaUrl}
            download="cupon-american-outlet.png"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-azul-900)] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            <Icon name="arrow" className="h-4 w-4 rotate-90" />
            Descargar cupón
          </a>
          <CopyButton text={res.cupon} label="Copiar código" />
        </div>
        <p className="mt-5 text-xs leading-relaxed text-[var(--color-tinta-tenue)]">
          En tienda verificamos tu registro por tu nombre. ¡Te esperamos!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-3d space-y-4 p-7 sm:p-9" noValidate>
      <div>
        <label htmlFor="nombre" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-tinta-tenue)]">
          Nombre completo
        </label>
        <input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required autoComplete="name" placeholder="Tu nombre" className={inputCls} />
      </div>
      <div>
        <label htmlFor="correo" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-tinta-tenue)]">
          Correo
        </label>
        <input id="correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required autoComplete="email" placeholder="vos@correo.com" className={inputCls} />
      </div>
      <div>
        <label htmlFor="whatsapp" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-tinta-tenue)]">
          WhatsApp
        </label>
        <input id="whatsapp" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required autoComplete="tel" placeholder="8888-8888" className={inputCls} />
      </div>

      {error && (
        <p role="alert" className="rounded-2xl border border-[var(--color-rojo)]/20 bg-[var(--color-rojo)]/5 px-4 py-3 text-sm text-[var(--color-rojo-700)]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-rojo)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(223,14,11,0.7)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
      >
        {pending ? "Generando tu cupón…" : "Obtener mi 15% OFF"}
        {!pending && <Icon name="arrow" className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-0.5" />}
      </button>
      <p className="text-center text-[11px] leading-relaxed text-[var(--color-tinta-tenue)]">
        Al registrarte aceptás recibir novedades de American Outlet. Tus datos no se comparten con terceros.
      </p>
    </form>
  );
}
