import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { plan } from "@/content/plan-junio-2026";
import { signOut } from "../actions";
import { PanelNav } from "./PanelNav";

export const metadata: Metadata = {
  title: { default: "Panel interno", template: "%s · Panel American Outlet" },
  // El área interna nunca se indexa ni se cachea.
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Gate real (defensa en profundidad): getUser() revalida contra Supabase.
  // No se confía solo en el middleware.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/panel/login");
  }

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("tienda, rol, tiendas(slug)")
    .eq("id", user.id)
    .maybeSingle();

  const tienda = perfil?.tienda ?? "American Outlet";
  const rol = perfil?.rol ?? "tienda";
  const tiendaSlug =
    (perfil as { tiendas?: { slug: string } | null } | null)?.tiendas?.slug ??
    null;
  const esAdmin = rol === "admin" || rol === "superadmin";
  const rolLabel =
    rol === "superadmin" ? "Superadmin" : rol === "admin" ? "Admin" : "Tienda";

  return (
    <div className="min-h-screen">
      {/* Barra superior */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-borde)] glass-strong">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-6 lg:px-8">
          <Link href="/panel/calendario" aria-label="Panel — inicio">
            <Logo compact className="sm:hidden" />
            <Logo className="hidden sm:inline-flex" />
          </Link>

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

      {/* Encabezado del plan + navegación entre vistas */}
      <div className="mx-auto max-w-6xl px-5 pt-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="divider-brand" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-azul)]">
            {plan.marca}
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-tinta)] sm:text-3xl">
          {plan.bajada}
        </h1>

        <div className="sticky top-[3.75rem] z-30 -mx-5 mt-6 px-5 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <PanelNav
            rol={rol as "tienda" | "admin" | "superadmin"}
            tiendaSlug={tiendaSlug}
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
