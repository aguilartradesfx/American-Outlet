"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";

type LeadItem = {
  id: string;
  nombre: string;
  correo: string;
  whatsapp: string | null;
  cupon: string;
  creado_en: string;
  ghl_sincronizado: boolean;
};

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, ""); // quita acentos para buscar "jose" y hallar "José"
}

const fmt = new Intl.DateTimeFormat("es-CR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function LeadsClient({ leads }: { leads: LeadItem[] }) {
  const [q, setQ] = useState("");

  const filtrados = useMemo(() => {
    const t = norm(q.trim());
    if (!t) return leads;
    return leads.filter((l) => {
      const hay = norm(`${l.nombre} ${l.correo} ${l.whatsapp ?? ""} ${l.cupon}`);
      return hay.includes(t);
    });
  }, [q, leads]);

  return (
    <div className="space-y-5">
      <div className="card-3d p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
              Leads Web
            </h1>
            <p className="mt-1 text-sm text-[var(--color-tinta-suave)]">
              {leads.length} registros del banner. Buscá por nombre para verificar
              en tienda si la persona está en la lista.
            </p>
          </div>
        </div>

        <div className="relative mt-4">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[var(--color-tinta-tenue)]">
            <Icon name="store" className="h-4 w-4" />
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
            placeholder="Buscar por nombre, correo, WhatsApp o cupón…"
            className="w-full rounded-2xl border border-[var(--color-borde)] bg-white/80 py-3 pl-11 pr-4 text-sm text-[var(--color-tinta)] outline-none transition focus:border-[var(--color-azul)] focus:bg-white"
          />
        </div>
        {q.trim() && (
          <p className="mt-2 text-xs text-[var(--color-tinta-tenue)]">
            {filtrados.length} coincidencia(s) para “{q.trim()}”.
          </p>
        )}
      </div>

      <div className="card-3d overflow-hidden p-0">
        {filtrados.length === 0 ? (
          <p className="p-8 text-center text-sm text-[var(--color-tinta-tenue)]">
            {leads.length === 0 ? "Todavía no hay leads." : "Sin coincidencias."}
          </p>
        ) : (
          <ul className="divide-y divide-[var(--color-borde)]">
            {filtrados.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--color-tinta)]">
                    {l.nombre}
                  </p>
                  <p className="truncate text-xs text-[var(--color-tinta-tenue)]">
                    {l.correo}
                    {l.whatsapp ? ` · ${l.whatsapp}` : ""}
                  </p>
                </div>
                <span className="rounded-lg bg-[var(--color-niebla-2)] px-2.5 py-1 font-mono text-xs font-semibold tracking-wider text-[var(--color-azul)]">
                  {l.cupon}
                </span>
                <span className="w-20 shrink-0 text-right text-[11px] text-[var(--color-tinta-tenue)]">
                  {fmt.format(new Date(l.creado_en))}
                </span>
                <span
                  title={l.ghl_sincronizado ? "Sincronizado con GHL" : "No sincronizado con GHL"}
                  className={`h-2 w-2 shrink-0 rounded-full ${l.ghl_sincronizado ? "bg-emerald-500" : "bg-[var(--color-tinta-tenue)]/40"}`}
                  aria-hidden="true"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
