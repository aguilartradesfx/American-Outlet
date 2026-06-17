# Proyecto B1 — Calendarios operativos por tienda

Fecha: 2026-06-15
Estado: Aprobado (diseño), en implementación

## Objetivo

Montar en el panel los **manuales operativos de contenido** de las tiendas
**La Fortuna** y **Florencia**, como calendarios independientes y de solo lectura,
con **aislamiento por tienda**.

## Reglas duras (del cliente)

1. Hay 3 tiendas: `ciudad-quesada`, `fortuna`, `florencia`.
2. El calendario **actual** (meses/días/piezas + fases/descuentos) **ES el de Ciudad Quesada**.
   Se deja **intacto**: no se toca, no se combina ni se relaciona con los nuevos.
3. Fortuna y Florencia son calendarios **independientes** y **nuevos** (manuales operativos).
4. **Aislamiento:** un usuario de Fortuna ve solo Fortuna; uno de Florencia solo Florencia;
   uno de Ciudad Quesada solo el de Ciudad Quesada. **Solo el superadmin ve los tres.**
5. V1 es **solo lectura** (manual de consulta, sin marcado).
6. Ciudad Quesada **no** lleva manual operativo nuevo.

## Naturaleza del contenido

Los manuales operativos son distintos al calendario de fases/descuentos. Cada uno tiene:
- Quién es el cliente (segmentos / qué lo mueve / qué lo frena).
- Estructura diaria fija (38 piezas = 35 fichas + 3 historias).
- 35 fichas por categoría (tabla, varía por tienda) + plantillas de texto + reglas de foto.
- 3 historias interactivas (BTS / PDV / Cliente) con propósito, formatos A–F e instrucción.
- Checklist del día.
- Foco semanal (Lun–Dom).
- Estrategia por temporada + fechas especiales.
- Por qué funciona.

## Enfoque (sin base de datos)

Contenido como **TypeScript tipado** en `content/calendarios-operativos/`, siguiendo el
patrón existente (`content/plan-junio-2026.ts`, `content/stores.ts`). No requiere migración.

- `content/calendarios-operativos/tipos.ts` — tipo `CalendarioOperativo`.
- `content/calendarios-operativos/fortuna.ts`, `florencia.ts` — datos (transcritos de los .md).
- `content/calendarios-operativos/index.ts` — registro `slug → CalendarioOperativo` (solo fortuna, florencia) + getter.

## Acceso y rutas

- Helper `getTiendaActual()` (en `lib/panel/datos.ts`): resuelve `{ tiendaId, slug, nombre }`
  del usuario actual vía `perfiles.tienda_id → tiendas`.
- Nueva ruta `app/panel/(app)/calendario-operativo/page.tsx`:
  - Store user `fortuna`/`florencia` → renderiza el suyo (forzado por su slug; ignora params).
  - Store user `ciudad-quesada` → `redirect('/panel/calendario')`.
  - Superadmin → selector de tienda (`?tienda=fortuna|florencia`), default Fortuna.
- Aislamiento del calendario de Ciudad Quesada: guard aditivo al **inicio** de
  `calendario/page.tsx` y `fases/page.tsx` (sin tocar su render): si el usuario es store user
  y su slug ≠ `ciudad-quesada`, `redirect('/panel/calendario-operativo')`.

## UI

- `components/panel/CalendarioOperativo.tsx` (+ sub-secciones) que renderiza las secciones con
  el design system del panel (`card-3d`, `surface`, `lift-3d`, `<Icon>`). Solo lectura.
- Nav (`PanelNav`) **consciente de tienda**: recibe el slug. Para store users de fortuna/florencia,
  "Calendario" apunta a `/panel/calendario-operativo` y se ocultan `/panel/calendario` y `/panel/fases`.
  Ciudad Quesada y superadmin mantienen los enlaces actuales (superadmin además ve el operativo).

## Fuera de alcance (V1)

- Marcado/checklist interactivo (posible V2, reusaría completado+candado de Proyecto A).
- Manual operativo de Ciudad Quesada (se deja su calendario actual tal cual).
- Edición desde UI (el contenido se entrega como .md y se transcribe a `content/`).

## Diferido (automático, al final)

- Pulir el **mobile** del calendario de Ciudad Quesada + info de descuentos (otra sesión está
  trabajando mobile en paralelo; se hace al final para evitar conflictos).
