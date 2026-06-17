# Proyecto A — Asignación de piezas + candado de completado

Fecha: 2026-06-15
Estado: Aprobado (diseño), pendiente de implementación

## Objetivo

Que el dueño de la tienda sepa, *antes* de que alguien lo marque, a quién le toca
cada trabajo del calendario de contenido, y que el "completado" solo pueda
deshacerlo quien lo marcó (o el superadmin).

Reparto de trabajo del equipo:
- **Josué** — contenido estático/batch (`post`, `flyer`, `carrusel`). Visita la tienda ~1 vez/semana (producción en lote).
- **Mauro** — contenido dinámico/del momento (`historia`, `reel`, `live`, `cinema`). Visita ~3 veces/semana.

## Decisiones tomadas

1. Josué y Mauro ya son usuarios reales del panel (tabla `perfiles`).
2. Asignación automática por tipo, con override manual del superadmin.
3. Candado de completado: solo quien lo marcó puede deshacerlo, **excepto** el superadmin (override).
4. Solo el superadmin asigna/reasigna.
5. La fuente de verdad de "quién es la persona de estáticos / dinámicos" vive en `perfiles` (campo `responsabilidad`), editable desde la pantalla de usuarios — no hardcodeado en código.

## Modelo de datos

### Tabla `piezas` — columnas nuevas (aditivas)
- `asignado_a_id` (uuid, FK → `perfiles.id`, nullable)
- `asignado_a_nombre` (text, nullable) — copia desnormalizada para mostrar sin join, igual que `completado_por_nombre`.

### Tabla `perfiles` — columna nueva
- `responsabilidad` (text, nullable) — valores: `estaticos` | `dinamicos` | null.

### Regla de auto-asignación por tipo

| Grupo | Tipos | `responsabilidad` | Persona |
|---|---|---|---|
| Estáticos / batch | `post`, `flyer`, `carrusel` | `estaticos` | Josué |
| Dinámicos / del momento | `historia`, `reel`, `live`, `cinema` | `dinamicos` | Mauro |
| Administrativos | `activacion`, `mantenimiento` | — | sin asignar |

## Componentes / cambios

### Parte 1 · Migración
- SQL: agregar `asignado_a_id`, `asignado_a_nombre` a `piezas`; agregar `responsabilidad` a `perfiles`.
- Actualizar `lib/supabase/database.types.ts`.

### Parte 2 · Auto-asignación + backfill
- En `guardarPieza` (`app/panel/(app)/planificacion/actions.ts`): al crear/guardar una pieza sin asignado, resolver el grupo por `tipo`, buscar en `perfiles` el usuario con la `responsabilidad` correspondiente, y rellenar `asignado_a_id` + `asignado_a_nombre`. Si ya viene asignado explícito, respetarlo (override).
- Backfill único (script/SQL) para las piezas de junio ya existentes: asignar por tipo con la misma regla.

### Parte 3 · Reasignar (solo superadmin)
- En `components/panel/PiezasEditor.tsx` (ya restringido a superadmin): dropdown "Asignado a" con la lista de usuarios asignables.
- Server action nuevo `asignarPieza(piezaId, userId)` en `planificacion/actions.ts`, con guard de superadmin.

### Parte 4 · Visibilidad (todos los roles)
- En `components/panel/PiezaCard.tsx`: badge "👤 [nombre]" con el asignado, visible para todos.
- Propagar `asignadoAId` / `asignadoANombre` en `lib/panel/vista.ts` (PiezaVista) y queries de `lib/panel/datos.ts`.

### Parte 5 · Candado de completado
- En `marcarPiezaCompletada` (`planificacion/actions.ts`): al desmarcar (`completar = false`), validar `userId === completado_por_id` **o** `rol === 'superadmin'`. Si no, devolver `{ ok: false, error: 'Solo quien lo marcó puede deshacerlo.' }`.
- En `components/panel/CompletarPieza.tsx`: deshabilitar el botón de deshacer cuando el usuario actual no es quien lo marcó ni es superadmin; mostrar "Marcado por [nombre]".

## Fuera de alcance (YAGNI)

- Vista de "carga por persona" / resumen semanal de visitas. Se puede agregar después si hace falta.
- Notificaciones automáticas de asignación.
- Historial de reasignaciones (auditoría fina).
