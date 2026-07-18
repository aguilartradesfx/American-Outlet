# Rediseño estético del panel — "look suave" (referencia Health Care)

**Fecha:** 2026-07-18
**Rama:** `feat/panel-restyle`
**Tipo:** Rediseño puramente estético (CSS/tokens + clases en shell, nav y calendarios). Sin cambios de contenido, rutas, roles ni lógica.

## 1. Contexto y objetivo

El panel interno (`/panel/*`) usa hoy un lenguaje glassmorphism + "3D" (blur, sombras en capas, hover `lift` de 4-6px, highlights internos) que se siente pesado. El usuario entregó una imagen de referencia (dashboard "Health Care") **solo como referencia estética**: quiere ese look limpio, aireado y suave — app dentro de una gran tarjeta blanca redondeada sobre fondo lavanda, sidebar sólido con ítem activo en pill pastel, tarjetas planas con sombra difusa y tags de categoría pastel.

**Objetivo:** trasladar ese lenguaje visual al panel **conservando la identidad AO** (azul `#004a70` primario, rojo `#df0e0b` como acento puntual) y sin tocar nada funcional.

## 2. Decisiones ya aprobadas (conversación)

1. **Paleta:** Identidad AO en look suave — primario azul AO, acento rojo AO, fondo lavanda-niebla claro, tarjetas blancas redondeadas, tags pastel. (No se adopta el índigo de la referencia.)
2. **Alcance de este envión:** Chasis compartido (shell + sidebar + topbar + tokens) **+ los dos calendarios**. El resto de páginas heredan el marco y las superficies automáticamente; se pulen después.
3. **Naturaleza:** 100% estético. Contenido, textos, permisos, rutas, datos e íconos intactos.

## 3. Restricción crítica — aislamiento del sitio público

`app/globals.css` es **compartido**. Las clases a restilizar se usan también fuera del panel:

- `card-3d` / `surface` / `lift-3d` → además del panel, en `app/(public)/promo/gracias/page.tsx` y `app/(public)/promo/PromoForm.tsx`.
- `glass` / `glass-strong` / `bg-ambient` → por todo el sitio público (home, layout raíz, tiendas, etc.).

**Regla:** ningún cambio puede alterar el sitio público. Todo el rediseño se **scopea bajo un root `.panel-ui`**:

- Se añade la clase `panel-ui` al contenedor raíz del panel (en `PanelShell`).
- En `globals.css`, los restyles se escriben como `.panel-ui .card-3d { … }`, `.panel-ui .surface { … }`, `.panel-ui .glass-strong { … }`, etc. — solo aplican dentro del panel.
- Los tokens de color/fondo del panel se redefinen como CSS custom properties locales en `.panel-ui { --… }`, sin tocar el `@theme` global.

Así, las páginas públicas que usan `card-3d`/`glass` quedan idénticas.

## 4. Sistema visual (antes → después, dentro de `.panel-ui`)

| Token / superficie | Hoy | Después |
|---|---|---|
| Fondo del panel | niebla `#f6f8fb` + malla ambiental (radiales rojo/azul) | lavanda-niebla plano `#f3f4fb`; se neutraliza `bg-ambient` dentro del panel |
| Marco de la app | full-bleed, sidebar transparente, header sticky glass | **tarjeta blanca grande `rounded-[1.75rem]`** con sombra suave, flotando sobre el lavanda; sidebar + topbar + contenido viven dentro |
| `card-3d` | cristal esmerilado + 4 capas de sombra + highlight interno | **blanco sólido**, `rounded-2xl`, borde `1px` tenue, sombra suave 2 capas: `0 1px 2px rgba(16,29,39,.04), 0 10px 30px -18px rgba(16,29,39,.14)` |
| `surface` | translúcida con inset highlight | blanco `#fff`, borde tenue, sombra mínima; `rounded-2xl` |
| `lift-3d:hover` | `translateY(-4px)` + sombra fuerte en capas | `translateY(-2px)` + leve aumento de sombra suave (más sobrio) |
| `glass-strong` (topbar) | blur fuerte + sombra elevada | blanco casi sólido, borde inferior tenue, sin blur pesado |
| Primario | azul AO | azul AO `#004a70` (botones, foco, activo) |
| Acento | rojo AO | rojo AO `#df0e0b` — solo estados (pendiente/alerta) |
| Radios | `--radius-glass: 1.5rem` | tarjetas `1rem`, marco `1.75rem`, pills `full` |

## 5. Cambios por archivo

### `app/globals.css`
- Bloque nuevo `/* ===== Panel UI — look suave (scoped) ===== */` con:
  - `.panel-ui { --color-niebla: #f3f4fb; ... }` (tokens locales + fondo lavanda del panel).
  - `.panel-ui .card-3d`, `.panel-ui .surface`, `.panel-ui .lift-3d(:hover)`, `.panel-ui .glass-strong` → versiones suaves/planas descritas arriba.
  - `.panel-ui` neutraliza el `bg-ambient` heredado (fondo plano lavanda).
  - Utilidades de **tag pastel**: `.tag-pastel` base + variantes `--azul`, `--verde`, `--rosa`, `--ambar` (fondo claro del tono + texto oscuro del mismo tono + borde suave). Reemplazan los tags de color sólido saturado.
- **No se modifica** el `@theme` global ni las clases usadas por el público.

### `app/panel/(app)/PanelShell.tsx`
- Root del panel recibe `panel-ui` + fondo lavanda.
- **Marco tarjeta-en-tarjeta:** contenedor central `rounded-[1.75rem] bg-white shadow-suave` que envuelve topbar + (sidebar + main).
- **Topbar** rediseñado dentro de la tarjeta: alineación tipo referencia (identidad/sesión izq., acciones der.), botones pill; se conserva logo, sesión/rol y "Salir".
- **Sidebar** sólido (fondo blanco/lavanda muy claro), logo arriba; se conserva el drawer móvil y su scroll-lock.

### `app/panel/(app)/PanelNav.tsx`
- Ítem **activo**: de pill navy oscuro (`bg-azul-900` texto blanco) → **pill lavanda suave** (`bg` azul-AO al ~8-10%, texto e ícono azul AO). Hover: fondo lavanda aún más tenue.
- Íconos, labels, lógica de roles y rutas: **sin cambios**.

### `components/panel/CalendarioGrid.tsx` (grilla-mes, `/panel/calendario`)
- Cabecera de días (SUN–SAT) fina y en mayúsculas tenues.
- Celdas con bordes tenues y número de día discreto.
- **Eventos como cards pastel** (`tag-pastel` por categoría) con etiqueta de categoría arriba y estado (`PENDIENTE`/`CONFIRMADO`) en color de estado (rojo AO / verde). Alinea con la referencia usando paleta AO.
- Se mantiene la estructura de datos y navegación de mes existentes.

### `components/panel/CalendarioInstruccional.tsx` (vista instruccional)
- Mismas secciones (encabezado, leyenda, días, reglas), aplanadas al look suave.
- Chips de categoría → `tag-pastel` (fondo pastel + texto del tono) en lugar de color sólido; el color por tipo (`a.color`) se mapea al pastel correspondiente.

## 6. Mapa de categorías → pastel

Los tipos de acción/categoría mantienen su color base AO/temático, pero se renderizan como pastel (fondo ~10-14% + texto oscuro del tono + borde suave). Ej.: interno→verde, externo→rosa/rojo suave, virtual→azul/violeta suave, destacado→ámbar. El color exacto por tipo se toma del dato existente y se convierte a su versión pastel vía `tag-pastel--*`.

## 7. No-objetivos (fuera de alcance de este envión)

- Rediseñar el cuerpo detallado de las ~14 páginas (tablas, formularios, modales) una por una — heredan marco/superficies ahora; se pulen en un envión posterior.
- Tocar el sitio público, el login, o cualquier lógica/permiso/ruta.
- Cambiar íconos, copy o estructura de datos.

## 8. Verificación (antes de dar por hecho)

1. `npm run build` pasa sin errores.
2. Levantar dev y **ver el panel** (`/panel/calendario` y una tienda operativa `/panel/calendario-operativo`): marco tarjeta-en-tarjeta, sidebar con activo pastel, topbar limpio, calendario con cards pastel.
3. **Regresión pública:** abrir home `/`, `/promo/gracias` y `/tiendas` — deben verse **idénticos** a antes (confirma que el scope `.panel-ui` no filtró).
4. Responsive: panel en móvil (drawer) y desktop.
5. `prefers-reduced-motion` sigue respetado.
