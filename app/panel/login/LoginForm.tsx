"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/ui/Icon";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/panel/calendario";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError("Correo o contraseña incorrectos. Revisá los datos e intentá de nuevo.");
      setCargando(false);
      return;
    }

    // Refresca los Server Components con la nueva sesión y entra al panel.
    router.replace(next.startsWith("/panel") ? next : "/panel/calendario");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-tinta-tenue)]"
        >
          Correo
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tienda@americanoutlet.cr"
          className="w-full rounded-2xl border border-[var(--color-borde)] bg-white/70 px-4 py-3 text-sm text-[var(--color-tinta)] outline-none transition focus:border-[var(--color-azul)] focus:bg-white"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-tinta-tenue)]"
        >
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            type={mostrar ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-[var(--color-borde)] bg-white/70 px-4 py-3 pr-12 text-sm text-[var(--color-tinta)] outline-none transition focus:border-[var(--color-azul)] focus:bg-white"
          />
          <button
            type="button"
            onClick={() => setMostrar((v) => !v)}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[var(--color-tinta-tenue)] transition hover:text-[var(--color-tinta)]"
            aria-label={mostrar ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            <Icon name={mostrar ? "star" : "shield"} className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-2xl border border-[var(--color-rojo)]/20 bg-[var(--color-rojo)]/5 px-4 py-3 text-sm text-[var(--color-rojo-700)]"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={cargando}
        className="group flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-azul-900)] px-6 py-3.5 text-sm font-medium text-white shadow-[0_10px_30px_-12px_rgba(16,29,39,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-12px_rgba(16,29,39,0.9)] disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {cargando ? "Entrando…" : "Entrar al panel"}
        {!cargando && (
          <Icon
            name="arrow"
            className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-0.5"
          />
        )}
      </button>
    </form>
  );
}
