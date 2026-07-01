# Diseño — Sidebar del panel + Calendario instruccional por tienda

**Fecha:** 2026-07-01
**Estado:** Aprobado (diseño) — pendiente plan de implementación

Dos cambios independientes en el panel interno (`/panel`), pedidos juntos:

1. **Navegación en sidebar izquierdo** — la nav horizontal superior pasa a un panel lateral izquierdo (drawer en móvil).
2. **Calendario instruccional por tienda** — los calendarios operativos de Fortuna/Florencia dejan de ser el manual rico y pasan a ser un calendario mensual de **instrucciones generales de acción** que la gente de tienda puede ejecutar por su cuenta.

Son separables; se documentan juntos porque se pidieron juntos.

---

## Contexto (estado actual)

- **Nav:** [`app/panel/(app)/PanelNav.tsx`](../../../app/panel/(app)/PanelNav.tsx) es un `<nav>` horizontal (`flex gap-1 overflow-x-auto`) con scroll lateral, renderizado dentro de [`app/panel/(app)/layout.tsx`](../../../app/panel/(app)/layout.tsx) debajo de una top bar (logo + sesión + salir) y del título del plan. La lógica de qué ítems ve cada rol (tienda/admin/superadmin, y tienda operativa vs Ciudad Quesada) vive en `PanelNav`.
- **Operativos por tienda:** [`content/calendarios-operativos/`](../../../content/calendarios-operativos/) — data estática por tienda (`fortuna.ts`, `florencia.ts`) tipada en `tipos.ts`, renderizada de solo lectura por [`components/panel/CalendarioOperativo.tsx`](../../../components/panel/CalendarioOperativo.tsx). Hoy es un manual rico: perfil de cliente, estructura diaria, 35 fichas de producto, 3 historias interactivas, foco semanal, temporadas, fechas especiales, checklist, "por qué funciona".
- La página [`app/panel/(app)/calendario-operativo/page.tsx`](../../../app/panel/(app)/calendario-operativo/page.tsx) enruta: superadmin ve un selector Fortuna/Florencia; usuario de tienda ve solo el suyo (slug desde el perfil, aislado); Ciudad Quesada redirige a `/panel/calendario` (fases).

## Objetivos

- Nav como sidebar izquierdo fijo en desktop; drawer con hamburguesa en móvil. Sin cambiar qué ve cada rol.
- Operativo por tienda = **solo** un calendario instruccional mensual, general, evergreen, compartido por las dos tiendas operativas.

## No-objetivos (fuera de alcance)

- No se toca el calendario de fases/descuentos de Ciudad Quesada (`meses/fases/dias/piezas` en Supabase).
- El instruccional NO se vuelve editable por CMS; es estático en código (lo mantiene dev).
- No se cambian permisos/roles ni el ruteo por rol.
- No se decide el contenido exacto a publicar — solo el encargo general.

---

## Parte 1 — Navegación en sidebar izquierdo

### Layout (shell de dos columnas)

`layout.tsx` pasa a:

```
┌──────────────────────────────────────────────┐
│ [☰] Logo          Sesión de … · Rol   [Salir] │  top bar (queda; ☰ solo en móvil)
├────────────┬─────────────────────────────────┤
│  SIDEBAR   │   título del plan + contenido    │
│ (vertical) │                                  │
└────────────┴─────────────────────────────────┘
```

- **Desktop (≥ `lg`):** sidebar fijo a la izquierda (~240px), ítems verticales con ícono + texto, activo resaltado con el mismo estilo navy actual. Sticky bajo la top bar, con scroll propio si el contenido crece. El área de contenido ocupa el resto del ancho.
- **Móvil (< `lg`):** sidebar oculto por defecto; un botón **hamburguesa** en la top bar abre un **drawer** deslizante desde la izquierda con overlay oscuro. Se cierra al: elegir una opción, tocar el overlay, o `Esc`.
- El **título del plan** ("American Outlet / Plan de contenido…") se mueve al tope del área de contenido (no dentro del sidebar), para no competir con la nav.

### `PanelNav`

- Se reescribe a render **vertical** (columna de ítems), conservando **intacta** la lógica de armado de `items` por rol/tienda (calendario vs calendario-operativo, Fases solo no-operativas, Entregas/Materiales, Calendarios tienda para superadmin, Promo/Planificación/Usuarios/Tiendas).
- Componente cliente con estado `open` para el drawer móvil. En desktop el estado se ignora (siempre visible vía CSS). El toggle (botón ☰) vive en la top bar del layout y controla el mismo estado — se resuelve con un pequeño contexto/estado compartido o moviendo el estado del drawer a un wrapper cliente que envuelva top bar + sidebar.
- Accesibilidad: el botón trae `aria-expanded`/`aria-controls`; el drawer es dismissible con `Esc`; foco manejado al abrir/cerrar; `aria-current="page"` en el activo (ya existe).

### Unidades

- `PanelShell` (nuevo, client): envuelve top bar + sidebar + maneja el estado del drawer y el overlay. Dependencias: recibe `rol`, `tiendaSlug`, datos de sesión (tienda, rolLabel) desde el layout server.
- `PanelNav` (reescrito): presenta los ítems en vertical; recibe `rol`, `tiendaSlug` y un handler de "cerrar" para el drawer.
- `layout.tsx` (server): resuelve sesión/perfil como hoy y pasa props a `PanelShell`.

---

## Parte 2 — Calendario instruccional por tienda

### Principio

La gente de tienda **no hace posts de feed** (eso lo hace otra persona). Sí hace **historias** y **acciones de distribución** con sus propias cuentas/WhatsApp. El calendario les da el **encargo general** por día — qué tipo de acción, en qué canal, sobre qué tema — sin dictar el contenido exacto.

### Modelo de datos (estático, compartido)

Nuevo archivo `content/calendarios-operativos/instruccional.ts` con una plantilla de **mes tipo (día 1 a 31) que se repite cada mes** (evergreen, no atada a un mes concreto). Tipos nuevos en `tipos.ts`:

```ts
export type TipoAccion = "historias" | "bnb" | "marketplace" | "grupos-locales";

export type AccionMeta = {
  tipo: TipoAccion;
  label: string;        // "Historias", "Grupos B&B / Airbnb", "Marketplace", "Grupos locales"
  icon: string;         // nombre de <Icon>
  color: string;        // acento para el chip/leyenda
  descripcion: string;  // qué implica esta acción para la tienda
};

export type DiaInstruccional = {
  dia: number;          // 1..31
  tipo: TipoAccion;
  meta?: string;        // ej. "3 historias"
  tema?: string;        // ej. "productos con +15 días", "descuentos vigentes"
  instruccion: string;  // general, NO contenido exacto
};

export type CalendarioInstruccional = {
  subtitulo: string;    // "Calendario de acciones — qué hacer cada día"
  intro: string;        // explica: historias + distribución, ellos ejecutan
  acciones: AccionMeta[];   // leyenda (los 4 tipos)
  dias: DiaInstruccional[]; // 31 entradas
  notas?: string[];         // reglas generales (ej. "nunca repetir el mismo producto 2 días")
};
```

### Los 4 tipos de acción (leyenda)

| tipo | label | qué hace la tienda |
|---|---|---|
| `historias` | Historias (IG/FB) | Subir X historias sobre un tema general (descuentos vigentes, inventario +15 días, línea blanca, muebles…) |
| `bnb` | Grupos B&B / Airbnb | Ofrecer productos en grupos de anfitriones/B&B de la zona (WhatsApp/Facebook) |
| `marketplace` | Facebook Marketplace | Subir productos al Marketplace de Facebook desde la cuenta de la tienda |
| `grupos-locales` | Grupos locales | Publicar en grupos de compra-venta / comunidad de la zona |

### Ritmo (ciclo de 7 días que se repite dentro del mes)

`dias[N].tipo` se deriva de la posición `((N-1) mod 7)`. El mes queda como ~4.4 repeticiones del ciclo. Ciclo aprobado:

| Pos | Tipo | Tema / meta |
|---|---|---|
| 1 | historias | Descuentos vigentes (arranque de semana) |
| 2 | historias | **Productos con +15 días** en tienda — 3 historias |
| 3 | marketplace | Subir productos al Marketplace |
| 4 | bnb | Grupos B&B / Airbnb |
| 5 | historias | Empujón de fin de semana — novedades / lo que llegó |
| 6 | grupos-locales | Grupos locales de compra-venta (+ recordar activación en tienda) |
| 7 | historias | Suave — recordatorio de ubicación y horario |

Historias es el pilar (4 de cada 7 días); las 3 acciones de distribución se intercalan. La data se escribe explícita (31 entradas), siguiendo este ciclo, para poder afinar días puntuales sin lógica.

### Presentación

Componente nuevo `components/panel/CalendarioInstruccional.tsx`; se retira `CalendarioOperativo.tsx`. Renderiza:

1. Encabezado: nombre de la tienda + subtítulo + intro corta.
2. **Leyenda** de los 4 tipos (chip color + ícono + descripción).
3. **Grilla del mes** reusando la estética de las cards del calendario: cada card muestra número de día, chip del tipo (color+ícono), meta ("3 historias") e instrucción corta. Solo lectura, legible de un vistazo.
4. Notas generales al pie.

### Página y ruteo

- Como el contenido es **compartido**, la página `calendario-operativo/page.tsx` se simplifica: **se elimina el selector Fortuna/Florencia** del superadmin (ambas muestran lo mismo). Superadmin y usuarios de tienda ven el mismo calendario instruccional; para usuarios de tienda el encabezado muestra el nombre de su tienda.
- Se conserva: el redirect de Ciudad Quesada a `/panel/calendario`, el aislamiento por perfil, y el ítem de nav.
- `getCalendarioOperativo(slug)` valida que el slug sea tienda operativa y devuelve `{ tiendaSlug, tiendaNombre, ...plantilla }` combinando el nombre de la tienda con la plantilla compartida. El nombre por slug vive en `index.ts` (un mapa `slug → nombre`).

### Qué se elimina

- Secciones ricas del manual y sus datos: perfil de cliente, 35 fichas, historias interactivas, foco semanal, temporadas, fechas especiales, checklist, "por qué funciona".
- Los archivos `fortuna.ts` y `florencia.ts` **se eliminan** (su data rica ya no se usa); el nombre de cada tienda pasa al mapa de `index.ts`. Los tipos viejos en `tipos.ts` que queden sin uso se eliminan.
- La plantilla `dias` cubre día 1..31 como "mes tipo" genérico (no atado a un mes real, sin días de semana); meses cortos simplemente no muestran los últimos días.

---

## Archivos afectados

**Parte 1 (sidebar):** `app/panel/(app)/layout.tsx`, `app/panel/(app)/PanelNav.tsx`, posible `PanelShell.tsx` nuevo.

**Parte 2 (instruccional):** `content/calendarios-operativos/tipos.ts` (tipos nuevos, limpieza de viejos), `instruccional.ts` (nuevo), `index.ts` (mapa slug→nombre + plantilla compartida), `fortuna.ts`/`florencia.ts` (**eliminados**), `components/panel/CalendarioInstruccional.tsx` (nuevo), `CalendarioOperativo.tsx` (**eliminado**), `app/panel/(app)/calendario-operativo/page.tsx` (simplificado, sin selector).

## Verificación

- `npx tsc --noEmit` y `npm run build` sin errores.
- Sidebar: desktop muestra sidebar fijo; móvil abre/cierra el drawer (hamburguesa, overlay, Esc, cerrar al navegar); el activo se resalta; cada rol ve los mismos ítems que hoy.
- Instruccional: `/panel/calendario-operativo` muestra la grilla mensual + leyenda para Fortuna, Florencia y superadmin; Ciudad Quesada sigue redirigiendo a fases; el aislamiento por perfil se mantiene.
