"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  type UsuarioItem,
} from "./actions";

type Rol = "tienda" | "admin" | "superadmin";

const inputCls =
  "w-full rounded-xl border border-[var(--color-borde)] bg-white/70 px-3 py-2 text-sm text-[var(--color-tinta)] outline-none transition focus:border-[var(--color-azul)] focus:bg-white";

export function UsuariosClient({
  rolActual,
  usuarios,
  tiendas,
  errorCarga,
}: {
  rolActual: Rol;
  usuarios: UsuarioItem[];
  tiendas: { slug: string; nombre: string }[];
  errorCarga: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(errorCarga);

  // Alta
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<Rol>("tienda");
  const [tiendaSlug, setTiendaSlug] = useState(tiendas[0]?.slug ?? "");

  const rolesDisponibles: Rol[] =
    rolActual === "superadmin" ? ["tienda", "admin", "superadmin"] : ["tienda", "admin"];

  function run(fn: () => Promise<{ ok: boolean; error?: string }>, after?: () => void) {
    setError(null);
    startTransition(async () => {
      const r = await fn();
      if (!r.ok) setError(r.error ?? "Error");
      else {
        after?.();
        router.refresh();
      }
    });
  }

  function onCrear() {
    if (!email || !password) return setError("Email y contraseña son obligatorios.");
    run(
      () =>
        crearUsuario({
          email,
          password,
          nombre: nombre || null,
          rol,
          tiendaSlug: rol === "tienda" ? tiendaSlug : null,
        }),
      () => {
        setEmail("");
        setNombre("");
        setPassword("");
      },
    );
  }

  return (
    <div className="space-y-7">
      {error && (
        <p role="alert" className="rounded-2xl border border-[var(--color-rojo)]/20 bg-[var(--color-rojo)]/5 px-4 py-3 text-sm text-[var(--color-rojo-700)]">
          {error}
        </p>
      )}

      {/* Alta de usuario */}
      <div className="card-3d p-6">
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
          Nuevo usuario
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
            Nombre
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={`${inputCls} mt-1`} placeholder="Ej. Josué" />
          </label>
          <label className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
            Correo
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputCls} mt-1`} placeholder="tienda@americanoutlet.cr" />
          </label>
          <label className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
            Contraseña
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputCls} mt-1`} placeholder="mínimo 6 caracteres" />
          </label>
          <label className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
            Rol
            <select value={rol} onChange={(e) => setRol(e.target.value as Rol)} className={`${inputCls} mt-1`}>
              {rolesDisponibles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>
          {rol === "tienda" && (
            <label className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
              Tienda
              <select value={tiendaSlug} onChange={(e) => setTiendaSlug(e.target.value)} className={`${inputCls} mt-1`}>
                {tiendas.map((t) => (
                  <option key={t.slug} value={t.slug}>{t.nombre}</option>
                ))}
              </select>
            </label>
          )}
        </div>
        <button type="button" onClick={onCrear} disabled={pending} className="mt-4 rounded-full bg-[var(--color-azul-900)] px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:opacity-60">
          Crear usuario
        </button>
      </div>

      {/* Lista de usuarios */}
      <div className="card-3d p-6">
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
          Usuarios ({usuarios.length})
        </h2>
        <ul className="mt-4 space-y-2">
          {usuarios.map((u) => (
            <li key={u.userId} className="surface flex flex-wrap items-center justify-between gap-3 p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--color-tinta)]">
                  {u.nombre || u.email}
                </p>
                <p className="text-xs text-[var(--color-tinta-tenue)]">
                  {u.nombre ? `${u.email} · ` : ""}{u.tiendaNombre ?? "—"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  defaultValue={u.nombre ?? ""}
                  placeholder="Nombre"
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (v !== (u.nombre ?? "")) run(() => actualizarUsuario({ userId: u.userId, nombre: v || null }));
                  }}
                  disabled={pending}
                  className="w-28 rounded-lg border border-[var(--color-borde)] bg-white/70 px-2 py-1 text-xs text-[var(--color-tinta)]"
                />
                <select
                  defaultValue={u.rol}
                  onChange={(e) => run(() => actualizarUsuario({ userId: u.userId, rol: e.target.value as Rol }))}
                  disabled={pending}
                  className="rounded-lg border border-[var(--color-borde)] bg-white/70 px-2 py-1 text-xs text-[var(--color-tinta)]"
                >
                  {rolesDisponibles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <select
                  defaultValue={u.responsabilidad ?? ""}
                  title="Responsabilidad de contenido (para auto-asignar piezas)"
                  onChange={(e) =>
                    run(() =>
                      actualizarUsuario({
                        userId: u.userId,
                        responsabilidad: (e.target.value || null) as
                          | "estaticos"
                          | "dinamicos"
                          | null,
                      }),
                    )
                  }
                  disabled={pending}
                  className="rounded-lg border border-[var(--color-borde)] bg-white/70 px-2 py-1 text-xs text-[var(--color-tinta)]"
                >
                  <option value="">Sin resp.</option>
                  <option value="estaticos">Estáticos</option>
                  <option value="dinamicos">Dinámicos</option>
                </select>
                {u.rol === "tienda" && (
                  <select
                    defaultValue={u.tiendaSlug ?? ""}
                    onChange={(e) => run(() => actualizarUsuario({ userId: u.userId, tiendaSlug: e.target.value || null }))}
                    disabled={pending}
                    className="rounded-lg border border-[var(--color-borde)] bg-white/70 px-2 py-1 text-xs text-[var(--color-tinta)]"
                  >
                    <option value="">Sin tienda</option>
                    {tiendas.map((t) => (
                      <option key={t.slug} value={t.slug}>{t.nombre}</option>
                    ))}
                  </select>
                )}
                <button type="button" onClick={() => run(() => eliminarUsuario({ userId: u.userId }))} disabled={pending} aria-label="Eliminar usuario" className="rounded-lg px-2 py-1 text-xs font-medium text-[var(--color-tinta-tenue)] transition hover:text-[var(--color-rojo)] disabled:opacity-60">
                  Eliminar
                </button>
              </div>
            </li>
          ))}
          {usuarios.length === 0 && (
            <p className="text-sm text-[var(--color-tinta-tenue)]">No hay usuarios para mostrar.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
