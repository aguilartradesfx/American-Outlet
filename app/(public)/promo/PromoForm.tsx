"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { trackEvent } from "@/lib/analytics/track";
import { registrarLead } from "./actions";

const inputCls =
  "w-full rounded-2xl border border-[var(--color-borde)] bg-white/80 px-4 py-3 text-sm text-[var(--color-tinta)] outline-none transition focus:border-[var(--color-azul)] focus:bg-white";

export function PromoForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

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
          lead_origen: "banner-julio-2026",
          // Advanced matching de Meta — Adsmurai los hashea server-side (mejor EMQ).
          // NO mapear estos campos al tag de GA4 (PII prohibida en GA4).
          customer_email: correo,
          customer_phone: whatsapp,
          customer_name: nombre,
        });
      }
      // Página de gracias con URL propia: señal de registro robusta + UX.
      const q = new URLSearchParams({
        code: r.data.cupon,
        nombre: r.data.nombre,
        nuevo: r.data.yaRegistrado ? "0" : "1",
      });
      router.push(`/promo/gracias?${q.toString()}`);
    });
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
        {pending ? "Generando tu cupón…" : "Obtener mi 10% OFF"}
        {!pending && <Icon name="arrow" className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-0.5" />}
      </button>
      <p className="text-center text-[11px] leading-relaxed text-[var(--color-tinta-tenue)]">
        Al registrarte aceptás recibir novedades de American Outlet. Tus datos no se comparten con terceros.
      </p>
    </form>
  );
}
