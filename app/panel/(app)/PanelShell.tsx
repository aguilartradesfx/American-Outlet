"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
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

  // Bloque de sesión + salir (pie del sidebar, como en la referencia).
  const sesionBox = (
    <div className="rounded-2xl border border-[var(--p-line)] bg-[var(--p-bg)] p-3">
      <p className="text-[11px] text-[var(--color-tinta-tenue)]">Sesión</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-[var(--color-tinta)]">
        {tienda}
      </p>
      <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-[var(--p-line)] bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-suave)]">
        <span
          className={`h-1.5 w-1.5 rounded-full ${esAdmin ? "bg-[var(--color-rojo)]" : "bg-[var(--color-azul)]"}`}
          aria-hidden="true"
        />
        {rolLabel}
      </span>
      <form action={signOut} className="mt-3">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--p-line)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-tinta-suave)] transition hover:bg-[var(--p-active)] hover:text-[var(--color-azul)]"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
          Salir
        </button>
      </form>
    </div>
  );

  return (
    <div className="panel-ui min-h-screen p-2.5 sm:p-3">
      {/* Marco: una gran tarjeta que ocupa TODA la pantalla (edge-to-edge). */}
      <div className="panel-frame flex min-h-[calc(100vh-1.25rem)] overflow-hidden sm:min-h-[calc(100vh-1.5rem)]">
        {/* Sidebar (desktop) — pegado al borde izquierdo del marco */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--p-line)] lg:flex">
          <div className="px-5 py-6">
            <Link href="/panel/calendario" aria-label="Panel — inicio">
              <Logo />
            </Link>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-3">
            <PanelNav rol={rol} tiendaSlug={tiendaSlug} />
          </div>
          <div className="px-3 pb-4 pt-2">{sesionBox}</div>
        </aside>

        {/* Columna de contenido */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--p-line)] px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-2.5">
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Abrir menú"
                aria-expanded={open}
                aria-controls="panel-sidebar"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--p-line)] bg-white text-[var(--color-tinta-suave)] transition hover:bg-[var(--p-active)] hover:text-[var(--color-azul)] lg:hidden"
              >
                <Icon name="menu" className="h-5 w-5" />
              </button>
              <Link href="/panel/calendario" aria-label="Panel — inicio" className="lg:hidden">
                <Logo compact />
              </Link>
              <h1 className="hidden truncate text-lg font-semibold tracking-[-0.02em] text-[var(--color-tinta)] lg:block">
                {tienda}
              </h1>
            </div>
            <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-[var(--p-line)] bg-[var(--p-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--color-tinta-suave)] sm:inline-flex">
              <span
                className={`h-2 w-2 rounded-full ${esAdmin ? "bg-[var(--color-rojo)]" : "bg-[var(--color-azul)]"}`}
                aria-hidden="true"
              />
              {rolLabel}
            </span>
          </header>

          {/* Contenido */}
          <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-7">
            {children}
          </main>
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
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-[var(--shadow-p-frame)] transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between px-5 py-4">
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
        <div className="min-h-0 flex-1 overflow-y-auto px-3">
          <PanelNav rol={rol} tiendaSlug={tiendaSlug} onNavigate={() => setOpen(false)} />
        </div>
        <div className="px-3 pb-4 pt-2">{sesionBox}</div>
      </aside>
    </div>
  );
}
