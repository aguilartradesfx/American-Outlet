# Panel: sidebar + calendario instruccional — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mover la navegación del panel a un sidebar izquierdo (drawer en móvil) y reemplazar el manual operativo por tienda por un calendario instruccional mensual, general y compartido.

**Architecture:** Parte 1 — un componente cliente `PanelShell` envuelve top bar + sidebar y maneja el estado del drawer; `PanelNav` se reescribe a render vertical; `layout.tsx` (server) queda delgado (auth) y delega el chrome. Parte 2 — data estática compartida (`instruccional.ts`) con una plantilla de mes tipo (día 1–31) construida desde un ciclo de 7 días; un componente nuevo la renderiza como leyenda + grilla; la página se simplifica y se borran los manuales viejos.

**Tech Stack:** Next.js 15 (App Router, RSC + client components), TypeScript, Tailwind v4, Supabase (solo lectura de perfil en el layout).

## Global Constraints

- **Sin framework de tests en el repo** (no hay jest/vitest; `package.json` no tiene script `test`). La verificación de cada tarea es `npx tsc --noEmit` **y** `npm run build` sin errores, más los checks manuales indicados. **NO** agregar un framework de tests (fuera de alcance, YAGNI).
- Todo copy visible en **español de Costa Rica, voseo**.
- Reusar estilos existentes: clases `card-3d`, `surface`, `lift-3d`, `glass-strong`, `divider-brand`, y variables CSS `--color-*`. Componentes `Icon`, `Logo`. Íconos monocromo (`<Icon name>`).
- **La lógica de qué ítems ve cada rol NO cambia** (se copia verbatim de `PanelNav` actual).
- El calendario de fases de Ciudad Quesada (`meses/fases/dias/piezas` en Supabase) **no se toca**. Ciudad Quesada sigue redirigiendo a `/panel/calendario`.
- Commits frecuentes (uno por tarea). **NO** hacer `git push` (dispara deploy) — eso lo pide el usuario aparte.

---

### Task 1: Sidebar shell (nav vertical + drawer móvil)

**Files:**
- Modify: `components/ui/Icon.tsx` (agregar íconos `menu` y `x`)
- Modify: `app/panel/(app)/PanelNav.tsx` (render vertical + prop `onNavigate`)
- Create: `app/panel/(app)/PanelShell.tsx` (client: top bar + sidebar + drawer)
- Modify: `app/panel/(app)/layout.tsx` (delega el chrome a `PanelShell`)

**Interfaces:**
- Produces: `PanelNav({ rol, tiendaSlug, onNavigate? })` — render vertical.
- Produces: `PanelShell({ rol, tiendaSlug, tienda, rolLabel, esAdmin, children })` — client component con el chrome completo.
- Consumes: `signOut` (server action existente en `app/panel/actions.ts`), `plan` (de `@/content/plan-junio-2026`), `Logo`, `Icon`.

- [ ] **Step 1: Agregar íconos `menu` y `x` a `Icon.tsx`**

En `components/ui/Icon.tsx`, dentro del objeto `paths`, agregar (después de `"check-circle"`):

```tsx
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
```

- [ ] **Step 2: Reescribir `PanelNav.tsx` a render vertical + `onNavigate`**

Reemplazar el archivo completo `app/panel/(app)/PanelNav.tsx` por:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

type Rol = "tienda" | "admin" | "superadmin";

const restoBase = [
  { href: "/panel/historias", label: "Guía Historias", icon: "tech" },
  { href: "/panel/estudio", label: "Estudio IA", icon: "image" },
  { href: "/panel/leads", label: "Leads Web", icon: "chat" },
];

const adminItems = [
  { href: "/panel/usuarios", label: "Usuarios", icon: "baby", roles: ["admin", "superadmin"] },
  { href: "/panel/tiendas", label: "Tiendas", icon: "store", roles: ["admin", "superadmin"] },
];

const superadminItems = [
  { href: "/panel/planificacion", label: "Planificación", icon: "sparkle", roles: ["superadmin"] },
  { href: "/panel/promos", label: "Promo", icon: "tag", roles: ["superadmin"] },
];

export function PanelNav({
  rol,
  tiendaSlug,
  onNavigate,
}: {
  rol: Rol;
  tiendaSlug?: string | null;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const esTiendaOperativa =
    rol === "tienda" && !!tiendaSlug && tiendaSlug !== "ciudad-quesada";

  const calendarioItem = esTiendaOperativa
    ? { href: "/panel/calendario-operativo", label: "Calendario", icon: "calendar" }
    : { href: "/panel/calendario", label: "Calendario", icon: "calendar" };

  const entregasItem =
    rol === "superadmin"
      ? { href: "/panel/entregas", label: "Entregas", icon: "broadcast" }
      : rol === "tienda"
        ? { href: "/panel/entregas", label: "Materiales", icon: "broadcast" }
        : null;

  const items = [
    calendarioItem,
    ...(esTiendaOperativa
      ? []
      : [{ href: "/panel/fases", label: "Fases", icon: "chart" }]),
    ...restoBase,
    ...(entregasItem ? [entregasItem] : []),
    ...(rol === "superadmin"
      ? [{ href: "/panel/calendario-operativo", label: "Calendarios tienda", icon: "store" }]
      : []),
    ...superadminItems.filter((i) => i.roles.includes(rol)),
    ...adminItems.filter((i) => i.roles.includes(rol)),
  ];

  return (
    <nav className="flex flex-col gap-1">
      {items.map((v) => {
        const active = pathname === v.href || pathname.startsWith(v.href + "/");
        return (
          <Link
            key={v.href}
            href={v.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-[1.05rem] px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
              active
                ? "bg-[var(--color-azul-900)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_22px_-10px_rgba(16,29,39,0.85)]"
                : "text-[var(--color-tinta-suave)] hover:bg-white/70 hover:text-[var(--color-tinta)]"
            }`}
          >
            <Icon
              name={v.icon}
              className={`h-[18px] w-[18px] ${active ? "text-white" : "text-[var(--color-tinta-tenue)]"}`}
            />
            {v.label}
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 3: Crear `PanelShell.tsx` (client: top bar + sidebar + drawer)**

Crear `app/panel/(app)/PanelShell.tsx`:

```tsx
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
```

- [ ] **Step 4: Adelgazar `layout.tsx` para usar `PanelShell`**

Reemplazar el archivo completo `app/panel/(app)/layout.tsx` por:

```tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelShell } from "./PanelShell";

export const metadata: Metadata = {
  title: { default: "Panel interno", template: "%s · Panel American Outlet" },
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

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
  const rol = (perfil?.rol ?? "tienda") as "tienda" | "admin" | "superadmin";
  const tiendaSlug =
    (perfil as { tiendas?: { slug: string } | null } | null)?.tiendas?.slug ??
    null;
  const esAdmin = rol === "admin" || rol === "superadmin";
  const rolLabel =
    rol === "superadmin" ? "Superadmin" : rol === "admin" ? "Admin" : "Tienda";

  return (
    <PanelShell
      rol={rol}
      tiendaSlug={tiendaSlug}
      tienda={tienda}
      rolLabel={rolLabel}
      esAdmin={esAdmin}
    >
      {children}
    </PanelShell>
  );
}
```

- [ ] **Step 5: Verificar typecheck y build**

Run: `npx tsc --noEmit && npm run build`
Expected: ambos terminan sin errores; en la tabla de rutas `/panel/*` compilan.

- [ ] **Step 6: Verificación manual**

Run: `npm run dev`, entrar a `/panel` autenticado.
Expected:
- Desktop (ventana ancha): sidebar vertical fijo a la izquierda; ítem activo resaltado navy; el contenido a la derecha.
- Móvil (ventana angosta < 1024px): sidebar oculto; el botón hamburguesa abre el drawer con overlay; se cierra con la X, tocando el overlay, con `Esc`, o al elegir una opción.
- Cada rol (tienda operativa, Ciudad Quesada, superadmin) ve los mismos ítems que antes.

- [ ] **Step 7: Commit**

```bash
git add "components/ui/Icon.tsx" "app/panel/(app)/PanelNav.tsx" "app/panel/(app)/PanelShell.tsx" "app/panel/(app)/layout.tsx"
git commit -m "feat(panel): nav como sidebar izquierdo con drawer en móvil"
```

---

### Task 2: Tipos + data del calendario instruccional

**Files:**
- Modify: `content/calendarios-operativos/tipos.ts` (agregar tipos nuevos; los viejos se dejan por ahora)
- Create: `content/calendarios-operativos/instruccional.ts`

**Interfaces:**
- Produces: tipos `TipoAccion`, `AccionMeta`, `DiaInstruccional`, `CalendarioInstruccional`.
- Produces: `plantillaInstruccional: Omit<CalendarioInstruccional, "tiendaSlug" | "tiendaNombre">`.

- [ ] **Step 1: Agregar los tipos nuevos a `tipos.ts`**

Al inicio de `content/calendarios-operativos/tipos.ts` (después del comentario de cabecera, antes de los tipos viejos), agregar:

```ts
// ---------------------------------------------------------------------------
// Calendario instruccional (mes tipo que se repite). Reemplaza al manual rico.
// ---------------------------------------------------------------------------

/** Tipo de acción que ejecuta la tienda por sus propios canales. */
export type TipoAccion = "historias" | "bnb" | "marketplace" | "grupos-locales";

/** Metadatos de un tipo de acción (para la leyenda y los chips). */
export type AccionMeta = {
  tipo: TipoAccion;
  label: string;
  icon: string; // nombre de <Icon>
  color: string; // hex del acento
  descripcion: string;
};

/** Un día del mes tipo con su encargo general (NO contenido exacto). */
export type DiaInstruccional = {
  dia: number; // 1..31
  tipo: TipoAccion;
  meta?: string; // ej. "3 historias"
  tema?: string; // ej. "productos con +15 días"
  instruccion: string;
};

/** Calendario instruccional resuelto para una tienda. */
export type CalendarioInstruccional = {
  tiendaSlug: string;
  tiendaNombre: string;
  subtitulo: string;
  intro: string;
  acciones: AccionMeta[];
  dias: DiaInstruccional[];
  notas: string[];
};
```

- [ ] **Step 2: Crear `instruccional.ts` con la plantilla compartida**

Crear `content/calendarios-operativos/instruccional.ts`:

```ts
/**
 * Calendario instruccional COMPARTIDO por las tiendas operativas (Fortuna y
 * Florencia). Mes tipo (día 1–31) que se repite cada mes: no dice el contenido
 * exacto, solo el encargo general (qué acción, qué canal, qué tema). La gente
 * de tienda solo hace historias y distribución — no posts de feed.
 *
 * La grilla se construye desde un ciclo de 7 días. Para afinar un día puntual,
 * agregá una entrada en `ajustes` (por número de día).
 */
import type {
  AccionMeta,
  CalendarioInstruccional,
  DiaInstruccional,
} from "./tipos";

const acciones: AccionMeta[] = [
  {
    tipo: "historias",
    label: "Historias (IG/FB)",
    icon: "film",
    color: "#004a70",
    descripcion:
      "Subí historias sobre el tema del día: descuentos vigentes, inventario con +15 días, línea blanca, muebles. Es el pilar diario.",
  },
  {
    tipo: "bnb",
    label: "Grupos B&B / Airbnb",
    icon: "home",
    color: "#1f7a4d",
    descripcion:
      "Ofrecé producto en grupos de anfitriones y B&B de la zona (WhatsApp o Facebook): lo que sirve para equipar una propiedad.",
  },
  {
    tipo: "marketplace",
    label: "Facebook Marketplace",
    icon: "tag",
    color: "#b8551f",
    descripcion:
      "Subí productos al Marketplace de Facebook desde la cuenta de la tienda. Foto real + precio claro.",
  },
  {
    tipo: "grupos-locales",
    label: "Grupos locales",
    icon: "chat",
    color: "#6b3fa0",
    descripcion:
      "Publicá en grupos de compra-venta y comunidad de la zona.",
  },
];

/** Ciclo semanal (7 posiciones) que se repite a lo largo del mes. */
const ciclo: Omit<DiaInstruccional, "dia">[] = [
  {
    tipo: "historias",
    meta: "4–6 historias",
    tema: "Descuentos vigentes",
    instruccion:
      "Arrancá la semana mostrando lo que está en oferta hoy. Historias con el producto y el beneficio del día. Contá lo que hay en piso.",
  },
  {
    tipo: "historias",
    meta: "3 historias",
    tema: "Productos con +15 días",
    instruccion:
      "Elegí productos con más de 15 días en tienda y dales salida en historias. Mostralos como oportunidad: sigue acá y hay que moverlo.",
  },
  {
    tipo: "marketplace",
    meta: "5–8 publicaciones",
    tema: "Lo de mayor rotación",
    instruccion:
      "Subí productos al Marketplace de Facebook desde la cuenta de la tienda. Priorizá línea blanca y muebles. Foto real + precio claro.",
  },
  {
    tipo: "bnb",
    meta: "1 ronda",
    tema: "Anfitriones / B&B",
    instruccion:
      "Ofrecé en los grupos de B&B y Airbnb de la zona lo que sirve para equipar una propiedad: línea blanca, muebles, menaje. Mensaje corto + fotos.",
  },
  {
    tipo: "historias",
    meta: "4–6 historias",
    tema: "Empujón de fin de semana",
    instruccion:
      "Mostrá lo nuevo que entró y lo que quedó bueno para el finde. Historias con energía de 'vení hoy'.",
  },
  {
    tipo: "grupos-locales",
    meta: "3–5 grupos",
    tema: "Compra-venta local",
    instruccion:
      "Publicá en grupos de compra-venta y comunidad de la zona. Aprovechá para recordar la atención/activación en tienda del sábado.",
  },
  {
    tipo: "historias",
    meta: "1–2 historias",
    tema: "Ubicación y horario",
    instruccion:
      "Día suave: recordá dónde está la tienda y el horario. Una historia de ubicación (sticker de mapa) y una de cierre de semana.",
  },
];

/** Ajustes puntuales por número de día (opcional). Vacío por defecto. */
const ajustes: Record<number, Partial<Omit<DiaInstruccional, "dia">>> = {};

const dias: DiaInstruccional[] = Array.from({ length: 31 }, (_, i) => {
  const dia = i + 1;
  return { dia, ...ciclo[i % 7], ...(ajustes[dia] ?? {}) };
});

export const plantillaInstruccional = {
  subtitulo: "Calendario de acciones — qué hacer cada día",
  intro:
    "Esta es tu guía diaria. Vos no hacés posts de feed (eso lo maneja el equipo central): tu trabajo es subir historias y mover producto por tus canales — grupos de B&B, Marketplace y grupos locales. Cada día te dice qué acción toca y sobre qué tema, con lo que ya tenés en tienda. El contenido exacto lo elegís vos.",
  acciones,
  dias,
  notas: [
    "Historias es el pilar: todos los días hay al menos una. Las acciones de distribución (Marketplace, B&B, grupos) se intercalan.",
    "No inventes precios ni descuentos que no estén confirmados: hablá de 'oferta' y del producto, no de números que no manejás.",
    "Priorizá siempre el inventario con más días en tienda: eso es lo que hay que mover.",
    "Foto real del producto disponible ese día. Si algo se vendió, reemplazalo por otro parecido.",
  ],
} satisfies Omit<CalendarioInstruccional, "tiendaSlug" | "tiendaNombre">;
```

- [ ] **Step 3: Verificar typecheck y build**

Run: `npx tsc --noEmit && npm run build`
Expected: sin errores (la data nueva no se consume aún; los manuales viejos siguen compilando).

- [ ] **Step 4: Commit**

```bash
git add "content/calendarios-operativos/tipos.ts" "content/calendarios-operativos/instruccional.ts"
git commit -m "feat(operativo): tipos + plantilla del calendario instruccional compartido"
```

---

### Task 3: Componente `CalendarioInstruccional`

**Files:**
- Create: `components/panel/CalendarioInstruccional.tsx`

**Interfaces:**
- Consumes: tipo `CalendarioInstruccional` de `@/content/calendarios-operativos/tipos`, `Icon`.
- Produces: `CalendarioInstruccional({ data })` (React component).

- [ ] **Step 1: Crear el componente**

Crear `components/panel/CalendarioInstruccional.tsx`:

```tsx
import { Icon } from "@/components/ui/Icon";
import type { CalendarioInstruccional as Data } from "@/content/calendarios-operativos/tipos";

export function CalendarioInstruccional({ data }: { data: Data }) {
  const metaPorTipo = new Map(data.acciones.map((a) => [a.tipo, a]));

  return (
    <div className="space-y-7">
      {/* Encabezado */}
      <div className="card-3d p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-tinta-tenue)]">
          {data.tiendaNombre}
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
          {data.subtitulo}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-tinta-suave)]">
          {data.intro}
        </p>
      </div>

      {/* Leyenda de acciones */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {data.acciones.map((a) => (
          <div key={a.tipo} className="surface lift-3d flex items-start gap-3 p-4">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: a.color }}
            >
              <Icon name={a.icon} className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--color-tinta)]">{a.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-tinta-suave)]">
                {a.descripcion}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Grilla del mes tipo */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.dias.map((d) => {
          const a = metaPorTipo.get(d.tipo);
          return (
            <div key={d.dia} className="surface lift-3d flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-tinta-tenue)]">
                  Día {d.dia}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                  style={{ backgroundColor: a?.color ?? "#004a70" }}
                >
                  <Icon name={a?.icon ?? "sparkle"} className="h-3.5 w-3.5" />
                  {a?.label ?? d.tipo}
                </span>
              </div>
              {(d.tema || d.meta) && (
                <p className="text-sm font-semibold text-[var(--color-tinta)]">
                  {d.tema}
                  {d.tema && d.meta ? " · " : ""}
                  {d.meta}
                </p>
              )}
              <p className="text-sm leading-relaxed text-[var(--color-tinta-suave)]">
                {d.instruccion}
              </p>
            </div>
          );
        })}
      </div>

      {/* Reglas generales */}
      {data.notas.length > 0 && (
        <div className="card-3d p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-tinta-tenue)]">
            Reglas generales
          </p>
          <ul className="mt-3 space-y-2">
            {data.notas.map((n, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm leading-relaxed text-[var(--color-tinta-suave)]"
              >
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-azul)]" />
                {n}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verificar typecheck y build**

Run: `npx tsc --noEmit && npm run build`
Expected: sin errores (el componente aún no se usa).

- [ ] **Step 3: Commit**

```bash
git add "components/panel/CalendarioInstruccional.tsx"
git commit -m "feat(operativo): componente CalendarioInstruccional (leyenda + grilla mensual)"
```

---

### Task 4: Conectar `index.ts` y la página

**Files:**
- Modify: `content/calendarios-operativos/index.ts` (mapa slug→nombre + plantilla compartida)
- Modify: `app/panel/(app)/calendario-operativo/page.tsx` (sin selector, usa el componente nuevo)

**Interfaces:**
- Consumes: `plantillaInstruccional` (Task 2), `CalendarioInstruccional` componente (Task 3).
- Produces: `getCalendarioOperativo(slug): CalendarioInstruccional | null`, `slugsOperativos`.

- [ ] **Step 1: Reescribir `index.ts`**

Reemplazar el archivo completo `content/calendarios-operativos/index.ts` por:

```ts
import type { CalendarioInstruccional } from "./tipos";
import { plantillaInstruccional } from "./instruccional";

/**
 * Tiendas operativas y su nombre. El contenido del calendario instruccional es
 * COMPARTIDO (misma plantilla para todas); solo cambia el nombre del encabezado.
 *
 * ⚠️ Ciudad Quesada NO está aquí: su calendario es el de fases/descuentos.
 */
const nombresPorSlug: Record<string, string> = {
  fortuna: "American Outlet La Fortuna",
  florencia: "American Outlet Florencia",
};

/** Slugs con calendario operativo, en orden de presentación. */
export const slugsOperativos = ["fortuna", "florencia"] as const;

export function getCalendarioOperativo(
  slug: string | null | undefined,
): CalendarioInstruccional | null {
  if (!slug || !(slug in nombresPorSlug)) return null;
  return {
    tiendaSlug: slug,
    tiendaNombre: nombresPorSlug[slug],
    ...plantillaInstruccional,
  };
}

export type { CalendarioInstruccional } from "./tipos";
```

- [ ] **Step 2: Reescribir la página (sin selector)**

Reemplazar el archivo completo `app/panel/(app)/calendario-operativo/page.tsx` por:

```tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getRolActual, getTiendaActual } from "@/lib/panel/datos";
import {
  getCalendarioOperativo,
  slugsOperativos,
} from "@/content/calendarios-operativos";
import { CalendarioInstruccional } from "@/components/panel/CalendarioInstruccional";

export const metadata: Metadata = { title: "Calendario de acciones" };

function SinCalendario() {
  return (
    <div className="card-3d p-8 text-center">
      <p className="text-sm text-[var(--color-tinta-suave)]">
        Tu usuario no tiene un calendario de acciones asignado.
      </p>
    </div>
  );
}

export default async function CalendarioOperativoPage() {
  const [rol, tienda] = await Promise.all([getRolActual(), getTiendaActual()]);

  // Superadmin: ve la plantilla compartida (aplica a todas las tiendas operativas).
  if (rol === "superadmin") {
    const data = getCalendarioOperativo(slugsOperativos[0])!;
    return (
      <CalendarioInstruccional
        data={{ ...data, tiendaNombre: "Tiendas operativas · Fortuna y Florencia" }}
      />
    );
  }

  // Usuario de tienda (o admin con tienda): solo su propio calendario.
  // El slug se toma del perfil — nunca de params — para garantizar el aislamiento.
  const slug = tienda?.slug ?? null;

  // Ciudad Quesada usa el calendario de fases/descuentos, no el operativo.
  if (slug === "ciudad-quesada") {
    redirect("/panel/calendario");
  }

  const data = getCalendarioOperativo(slug);
  if (!data) {
    return <SinCalendario />;
  }

  return <CalendarioInstruccional data={data} />;
}
```

- [ ] **Step 3: Verificar typecheck y build**

Run: `npx tsc --noEmit && npm run build`
Expected: sin errores. `fortuna.ts`/`florencia.ts`/`CalendarioOperativo.tsx` siguen existiendo pero quedan sin consumir (se borran en Task 5); compilan igual.

- [ ] **Step 4: Verificación manual**

Run: `npm run dev`
Expected:
- Como usuario de La Fortuna o Florencia: `/panel/calendario-operativo` muestra el encabezado con el nombre de la tienda + leyenda de 4 acciones + grilla de 31 días con chips de color.
- Como superadmin (ítem "Calendarios tienda"): la misma grilla, encabezado "Tiendas operativas · Fortuna y Florencia", **sin** el selector de tienda.
- Como Ciudad Quesada: sigue redirigiendo a `/panel/calendario`.

- [ ] **Step 5: Commit**

```bash
git add "content/calendarios-operativos/index.ts" "app/panel/(app)/calendario-operativo/page.tsx"
git commit -m "feat(operativo): la página usa el calendario instruccional compartido (sin selector)"
```

---

### Task 5: Borrar el manual viejo y los tipos sin uso

**Files:**
- Delete: `content/calendarios-operativos/fortuna.ts`
- Delete: `content/calendarios-operativos/florencia.ts`
- Delete: `components/panel/CalendarioOperativo.tsx`
- Modify: `content/calendarios-operativos/tipos.ts` (quitar tipos viejos sin uso)

**Interfaces:**
- Ninguno nuevo. Solo eliminación de código muerto.

- [ ] **Step 1: Borrar los archivos del manual viejo**

```bash
git rm "content/calendarios-operativos/fortuna.ts" "content/calendarios-operativos/florencia.ts" "components/panel/CalendarioOperativo.tsx"
```

- [ ] **Step 2: Quitar los tipos viejos de `tipos.ts`**

En `content/calendarios-operativos/tipos.ts`, **eliminar** los tipos que ya no se usan: `SegmentoCliente`, `BloqueDiario`, `CategoriaFicha`, `PlantillaTexto`, `FormatoHistoria`, `HistoriaInteractiva`, `FocoDia`, `Temporada`, `FechaEspecial`, y el tipo viejo `CalendarioOperativo`. El archivo debe quedar **solo** con el comentario de cabecera y los tipos nuevos (`TipoAccion`, `AccionMeta`, `DiaInstruccional`, `CalendarioInstruccional`) agregados en Task 2.

- [ ] **Step 3: Verificar que no queden referencias colgando**

Run: `grep -rn "CalendarioOperativo\|SegmentoCliente\|CategoriaFicha\|HistoriaInteractiva\|FocoDia\|calendariosOperativos\|tieneCalendarioOperativo" --include="*.ts" --include="*.tsx" app components lib content`
Expected: **sin resultados** (todas las referencias viejas eliminadas).

- [ ] **Step 4: Verificar typecheck y build**

Run: `npx tsc --noEmit && npm run build`
Expected: sin errores.

- [ ] **Step 5: Commit**

El `git rm` del Step 1 ya dejó las 3 eliminaciones en el index; solo falta agregar la modificación de `tipos.ts` (usar rutas explícitas, **no** `git add -A`, para no arrastrar borrados de `.md` ajenos que puedan estar en el working tree):

```bash
git add "content/calendarios-operativos/tipos.ts"
git commit -m "chore(operativo): borrar el manual rico viejo y tipos sin uso"
```

---

## Self-Review (hecho al escribir el plan)

**Cobertura del spec:**
- Sidebar desktop fijo + drawer móvil (hamburguesa, overlay, Esc, cierra al navegar) → Task 1. ✓
- Lógica de rol intacta → Task 1 Step 2 (copia verbatim). ✓
- Modelo mensual repetible, estático, compartido → Task 2 (`plantillaInstruccional`, ciclo→31 días). ✓
- 4 tipos de acción + temas (descuentos, +15 días) + ritmo aprobado → Task 2 (`acciones`, `ciclo`). ✓
- Reemplaza el manual; presentación leyenda + grilla → Task 3. ✓
- Página sin selector; CQ redirige; aislamiento por perfil → Task 4. ✓
- Elimina `fortuna.ts`/`florencia.ts`/componente viejo/tipos viejos → Task 5. ✓

**Placeholders:** ninguno; todo el código está completo en cada step.

**Consistencia de tipos:** `plantillaInstruccional` = `Omit<CalendarioInstruccional,"tiendaSlug"|"tiendaNombre">`; `getCalendarioOperativo` la completa → `CalendarioInstruccional`; el componente consume ese tipo; los `icon` usados (`film`,`home`,`tag`,`chat`,`check`,`sparkle`) existen en `Icon`, y `menu`/`x` se agregan en Task 1. ✓
