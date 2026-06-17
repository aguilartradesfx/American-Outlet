# American Outlet — Hub de marca

Sitio canónico de marca de **American Outlet** — *El único outlet virtual de Costa Rica*.
Next.js 15 (App Router) + Tailwind v4, estático (SSG), listo para desplegar en Vercel.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm start        # servir el build
```

## Estructura

```
app/                     Rutas (App Router)
  page.tsx               Home
  tiendas/               Índice + [slug] por ubicación (SSG, SEO local)
  como-comprar/          Proceso de compra + FAQ (FAQPage schema)
  nosotros/              Historia, modelo de importación, CEDI
  contacto/              Formulario → WhatsApp + canales
  sitemap.ts robots.ts   SEO técnico
  icon.tsx opengraph-image.tsx manifest.ts
components/              UI, layout (Header/Footer/FAB), home, store
content/                 ⭐ CONTENIDO EDITABLE (sin tocar componentes)
  site.ts                Datos globales: WhatsApp, redes, e-commerce, CEDI
  stores.ts              Tiendas (fuente de verdad de índice y detalle)
  categories.ts          Líneas de producto
lib/schema.ts            JSON-LD: Organization, Store, BreadcrumbList
```

## Diseño

- Base clara y limpia con **glassmorphism**; rojo `#df0e0b` / azul `#004a70` de marca
  **solo como acentos**. Tokens centralizados en `app/globals.css` (`@theme`).
- Tipografía **Poppins** (vía `next/font`).
- Transiciones elegantes + revelado al scroll (`components/ui/Reveal.tsx`),
  respeta `prefers-reduced-motion`.

## SEO incluido

- Metadata real y única por página (title + description escritos a mano).
- Datos estructurados: `Organization`, `Store` por sede, `BreadcrumbList`, `FAQPage`.
- `sitemap.xml`, `robots.txt`, OG image dinámica, favicon de marca, manifest.
- Idioma `es-CR`. Páginas de tienda con contenido único para SEO local.

## ⚠️ Pendientes antes de producción (datos MOCK)

Buscar el comentario `MOCK` en el código. En concreto:

- **`content/site.ts`** — número de WhatsApp, email, redes y **dominio canónico** (`site.url`).
- **`content/stores.ts`** — direcciones, horarios, teléfonos, **coordenadas geo** y URLs
  de Google Maps reales de cada tienda; vincular al perfil de Google Business.
- **`lib/schema.ts`** — confirmar la **sociedad legal** que respalda la marca retail
  (para `Organization`, footer legal y garantía).
- Incrustar el **mapa real** (iframe / Place ID) en la página de tienda.
- Reemplazar los degradados placeholder de las "fotos" de tienda por imágenes reales
  (usar `next/image`).
- Integrar **GA4 + GTM** con los eventos de conversión (clic WhatsApp, envío form, clic e-commerce).

## Notas

- La **tienda en línea** (aostores.com) maneja surtido **independiente** al de las
  tiendas físicas; el copy ya lo aclara para no confundir al cliente.
- Venta principal por **WhatsApp**: el formulario de contacto compone el mensaje y abre
  `wa.me` (sin backend); fácil de migrar a un endpoint/CRM después.

---

## 🔒 Área interna `/panel` — Plan de contenido (Supabase Auth)

Área **autenticada y privada** (no pública, `noindex`, fuera de `robots.txt` y del
sitemap) con el plan de contenido de **Junio 2026** para las tiendas. Origen del
contenido: `ao-calendario-junio-2026-contenido.md`.

### Rutas

```
/panel/login         Login (público) — Supabase signInWithPassword
/panel               Redirige a /panel/calendario
/panel/calendario    Cuadrícula mensual LUN–DOM (parametrizada por 30 días) + cuadre
/panel/fases         Las 3 Fases (15% → 20% → 25%) y su desglose
/panel/historias     6 playbooks de Historias (H1–H5 por tipo de día)
```

El sitio público vive en el route group `app/(public)/` (con Header/Footer/WhatsApp);
el panel vive en `app/panel/` con su propio layout, sin ese chrome.

### Seguridad (defensa en profundidad)

- `middleware.ts` refresca la sesión y redirige a `/panel/login` sin sesión.
- **Además**, `app/panel/(app)/layout.tsx` revalida server-side con
  `supabase.auth.getUser()` antes de renderizar. **Nunca se confía solo en el
  middleware** (mitiga la clase de bug CVE-2025-29927 de Next.js middleware).
- RLS activo en la tabla `perfiles`: cada usuario solo lee su propio perfil.
- La `service_role` key jamás se expone al cliente (solo en `scripts/`).

### ⚙️ Cuentas a crear (las crea el DUEÑO, no están en el código)

Las **3 cuentas reales y sus contraseñas las crea el dueño** — no se hardcodean.
Una sola clase de usuario: **`tienda`** (solo lectura del calendario). Las 3 ven el
**mismo** calendario.

| Tienda                          | Email sugerido                          | Rol      |
| ------------------------------- | --------------------------------------- | -------- |
| American Outlet Ciudad Quesada  | `ciudadquesada@americanoutlet.cr`       | `tienda` |
| American Outlet Fortuna         | `fortuna@americanoutlet.cr`             | `tienda` |
| American Outlet Florencia       | `florencia@americanoutlet.cr`           | `tienda` |

**Opción A — Dashboard de Supabase:** Authentication → Users → *Add user*. Marcá
*Auto Confirm*. En *User metadata* poné `{ "tienda": "American Outlet Fortuna", "rol": "tienda" }`.
El trigger `on_auth_user_created` crea el perfil solo.

**Opción B — Script de seed local** (las contraseñas se leen de env, no del código):

```bash
# En .env.local (NO se versiona):
#   SUPABASE_SERVICE_ROLE_KEY=...
#   SEED_PASSWORD_CIUDAD_QUESADA=...
#   SEED_PASSWORD_FORTUNA=...
#   SEED_PASSWORD_FLORENCIA=...
npm run seed-tiendas
```

### Esquema de base de datos (ya aplicado vía migración)

- Tabla `public.perfiles` (`id` → `auth.users`, `tienda`, `rol`, `creado_en`) con RLS.
- Función `handle_new_user()` + trigger `on_auth_user_created` que materializa el
  perfil al dar de alta un usuario (lee `tienda`/`rol` del metadata).
- `check (rol in ('tienda','admin'))`: si más adelante se quiere un rol **admin**
  que edite el contenido, el esquema ya lo admite (no es requisito de esta versión).

### Datos del plan

`content/plan-junio-2026.ts` — **data separada de la presentación** (fases, totales,
playbooks, y el arreglo de 30 días). Editable sin tocar layout; la data es **única y
global** (las 3 tiendas comparten el mismo plan).

> ⚠️ **Pendiente (§6 del MD):** la asignación **día por día** (qué pieza concreta cae
> cada fecha) todavía no se pudo extraer del despliegue original. La cuadrícula ya está
> lista y parametrizada: cada día es un objeto con `pieza: null`. Apenas se carguen los
> valores `pieza`/`tema` en el arreglo `dias`, las celdas se llenan solas, la secuencia
> H1–H5 se deriva del tipo de día, y la tarjeta **"Cuadre de producción"** valida
> automáticamente contra el objetivo del mes (3 Reels · 8 Flyers · 3 Carruseles · 7
> Lives · 2 Cinema · 4 Activaciones · 150 Historias).

### Variables de entorno (ver `.env.local.example`)

```
NEXT_PUBLIC_SUPABASE_URL          pública
NEXT_PUBLIC_SUPABASE_ANON_KEY     pública
SUPABASE_SERVICE_ROLE_KEY         privada (solo scripts locales)
```

### ⚠️ Recomendación de seguridad

`next@15.1.6` tiene CVEs conocidos (incl. el bypass de auth en middleware
CVE-2025-29927). El gate server-side ya neutraliza esa clase de bug, pero conviene
**actualizar Next.js** a la última 15.x parcheada (`npm i next@^15.5`) y correr
`npm audit` antes de producción.
