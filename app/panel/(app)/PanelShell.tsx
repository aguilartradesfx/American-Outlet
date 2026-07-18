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
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Chip de sesión (tienda + rol) — reutilizado en el topbar.
  const sesionChip = (
    <div className="hidden text-right sm:block">
      <p className="text-[11px] text-[var(--color-tinta-tenue)]">Sesión de</p>
      <p className="flex items-center justify-end gap-2 text-sm font-medium text-[var(--color-tinta)]">
        {tienda}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--p-line)] bg-[var(--p-bg)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-suave)]">
          <span
            className={`h-1.5 w-1.5 rounded-full ${esAdmin ? "bg-[var(--color-rojo)]" : "bg-[var(--color-azul)]"}`}
            aria-hidden="true"
          />
          {rolLabel}
        </span>
      </p>
    </div>
  );

  return (
    <div className="panel-ui min-h-screen">
      <div className="mx-auto max-w-[1440px] p-3 sm:p-4 lg:p-6">
        <div className="panel-frame flex min-h-[calc(100vh-1.5rem)] overflow-hidden sm:min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-3rem)]">
          {/* Sidebar (desktop) — columna dentro del marco */}
          <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--p-line)] px-4 py-6 lg:flex">
            <Link
              href="/panel/calendario"
              aria-label="Panel — inicio"
              className="px-2"
            >
              <Logo />
            </Link>
            <div className="mt-8">
              <PanelNav rol={rol} tiendaSlug={tiendaSlug} />
            </div>
          </aside>

          {/* Columna de contenido */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Topbar */}
            <header className="flex items-center justify-between gap-4 border-b border-[var(--p-line)] px-5 py-3.5 sm:px-7">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-label="Abrir menú"
                  aria-expanded={open}
                  aria-controls="panel-sidebar"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--p-line)] bg-white text-[var(--color-tinta-suave)] transition hover:bg-[var(--p-active)] hover:text-[var(--color-azul)] lg:hidden"
                >
                  <Icon name="menu" className="h-5 w-5" />
                </button>
                <Link href="/panel/calendario" aria-label="Panel — inicio" className="lg:hidden">
                  <Logo compact className="sm:hidden" />
                  <Logo className="hidden sm:inline-flex" />
                </Link>
              </div>

              <div className="flex items-center gap-3">
                {sesionChip}
                <form action={signOut}>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-full border border-[var(--p-line)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-tinta-suave)] transition hover:bg-[var(--p-active)] hover:text-[var(--color-azul)]"
                  >
                    <Icon name="arrow" className="h-4 w-4 rotate-180" />
                    Salir
                  </button>
                </form>
              </div>
            </header>

            {/* Contenido */}
            <main className="min-w-0 flex-1 px-5 pb-16 pt-6 sm:px-7 lg:px-9 lg:pt-8">
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
      </div>

      {/* Overlay (móvil) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-[var(--color-azul-900)]/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer (móvil) */}
      <aside
        id="panel-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white px-4 py-5 shadow-[var(--shadow-p-frame)] transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between px-2">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-tinta-suave)] hover:bg-[var(--p-active)] hover:text-[var(--color-azul)]"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>
        <PanelNav rol={rol} tiendaSlug={tiendaSlug} onNavigate={() => setOpen(false)} />
      </aside>
    </div>
  );
}
