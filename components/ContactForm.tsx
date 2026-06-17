"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { trackEvent } from "@/lib/analytics/track";
import { site } from "@/content/site";

/**
 * El formulario no requiere backend: compone un mensaje y abre WhatsApp,
 * el canal de venta principal. Fácil de migrar a un endpoint/CRM luego.
 */
export function ContactForm() {
  const [nombre, setNombre] = useState("");
  const [interes, setInteres] = useState("");
  const [mensaje, setMensaje] = useState("");

  const intereses = ["Tecnología", "Electrodomésticos", "Hogar", "Ropa y calzado", "Otro"];

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const texto =
      `¡Hola American Outlet! 👋\n\n` +
      `*Nombre:* ${nombre || "—"}\n` +
      `*Me interesa:* ${interes || "—"}\n` +
      `*Mensaje:* ${mensaje || "—"}`;
    trackEvent("contact", {
      contact_method: "whatsapp",
      contact_source: "/contacto",
      contact_label: `form_contacto:${interes || "sin_interes"}`,
    });
    window.open(`https://wa.me/${site.whatsapp.numero}?text=${encodeURIComponent(texto)}`, "_blank");
  }

  const field =
    "w-full rounded-2xl border border-[var(--color-borde)] bg-white/70 px-4 py-3 text-sm text-[var(--color-tinta)] placeholder:text-[var(--color-tinta-tenue)] transition-all duration-200 focus:border-[var(--color-azul)] focus:bg-white focus:outline-none";

  return (
    <form onSubmit={enviar} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium text-[var(--color-tinta)]">
          Tu nombre
        </label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="¿Cómo te llamás?"
          className={field}
          required
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--color-tinta)]">
          ¿Qué estás buscando?
        </label>
        <div className="flex flex-wrap gap-2">
          {intereses.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInteres(i)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                interes === i
                  ? "bg-[var(--color-azul-900)] text-white"
                  : "border border-[var(--color-borde)] bg-white/60 text-[var(--color-tinta-suave)] hover:bg-white"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="mensaje" className="mb-1.5 block text-sm font-medium text-[var(--color-tinta)]">
          Tu mensaje
        </label>
        <textarea
          id="mensaje"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Contanos qué necesitás…"
          rows={4}
          className={`${field} resize-none`}
          required
        />
      </div>

      <button
        type="submit"
        className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#1fae54] px-6 py-3.5 text-sm font-medium text-white shadow-[0_10px_30px_-12px_rgba(31,174,84,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1a9b4a]"
      >
        <Icon name="whatsapp" className="h-5 w-5" />
        Enviar por WhatsApp
      </button>
      <p className="text-center text-xs text-[var(--color-tinta-tenue)]">
        Te abriremos WhatsApp con tu mensaje listo para enviar.
      </p>
    </form>
  );
}
