"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { plan } from "@/content/plan-junio-2026";
import { signOut } from "../actions";
import { PanelNav } from "./PanelNav";

type Rol = "tienda" | "admin" | "superadmin";

export function PanelShell({
  rol,
  tiendaSlug,
  tienda,
  rolLabel,
  esAdmin,
  children,
}: {
  rol: Rol;
  tiendaSlug: string | null;
  tienda: string;
  rolLabel: string;
  esAdmin: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-borde)] glass-strong">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={open}
              aria-controls="panel-sidebar"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-borde)] bg-white/60 text-[var(--color-tinta-suave)] transition hover:text-[var(--color-tinta)] lg:hidden"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>
            <Link href="/panel/calendario" aria-label="Panel — inicio">
              <Logo compact className="sm:hidden" />
              <Logo className="hidden sm:inline-flex" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-[var(--color-tinta-tenue)]">Sesión de</p>
              <p className="flex items-center justify-end gap-2 text-sm font-medium text-[var(--color-tinta)]">
                {tienda}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-borde)] bg-white/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-suave)]">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${esAdmin ? "bg-[var(--color-rojo)]" : "bg-[var(--color-azul)]"}`}
                    aria-hidden="true"
                  />
                  {rolLabel}
                </span>
              </p>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-full border border-[var(--color-borde)] bg-white/60 px-4 py-2 text-sm font-medium text-[var(--color-tinta-suave)] transition hover:bg-white hover:text-[var(--color-tinta)]"
              >
                <Icon name="arrow" className="h-4 w-4 rotate-180" />
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-5 sm:px-6 lg:px-8">
        {/* Overlay (móvil) */}
        {open && (
          <div
            className="fixed inset-0 z-40 bg-[var(--color-azul-900)]/40 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar / Drawer */}
        <aside
          id="panel-sidebar"
          className={`fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto border-r border-[var(--color-borde)] bg-[var(--color-niebla)] px-4 py-5 transition-transform duration-300 ease-out lg:sticky lg:top-[3.75rem] lg:z-auto lg:h-[calc(100vh-3.75rem)] lg:w-60 lg:shrink-0 lg:translate-x-0 lg:border-r-0 lg:bg-transparent lg:px-0 lg:py-8 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <Logo />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-tinta-suave)] hover:text-[var(--color-tinta)]"
            >
              <Icon name="x" className="h-5 w-5" />
            </button>
          </div>
          <PanelNav rol={rol} tiendaSlug={tiendaSlug} onNavigate={() => setOpen(false)} />
        </aside>

        {/* Contenido */}
        <main className="min-w-0 flex-1 pb-20 pt-6 lg:pt-8">
          <div className="flex items-center gap-3">
            <span className="divider-brand" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-azul)]">
              {plan.marca}
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-tinta)] sm:text-3xl">
            {plan.bajada}
          </h1>
          <div className="mt-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
