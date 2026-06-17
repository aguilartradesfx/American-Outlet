import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Acceso interno",
  // El área interna nunca se indexa.
  robots: { index: false, follow: false, nocache: true },
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="glass-strong glass-hairline rounded-[var(--radius-glass)] p-8 sm:p-10">
          <Link href="/" aria-label="American Outlet — inicio" className="inline-block">
            <Logo />
          </Link>

          <div className="mt-7 flex items-center gap-3">
            <span className="divider-brand" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-azul)]">
              Área interna
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
            Plan de contenido
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-tinta-suave)]">
            Acceso exclusivo para tiendas. Ingresá con la cuenta de tu tienda
            para ver el calendario de Junio 2026.
          </p>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--color-tinta-tenue)]">
          ¿Problemas para entrar? Escribí a Bralto / administración.
        </p>
      </div>
    </main>
  );
}
