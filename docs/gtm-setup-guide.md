# GTM Setup Guide — American Outlet

Paso a paso para dejar el tracking funcionando en GA4 + Meta (CAPI vía Adsmurai).

| Pieza | ID |
|---|---|
| GTM Container | `GTM-TJM26DFH` |
| GA4 Measurement ID | `G-4FZQHDD51C` (ya hardcodeado en el JSON) |
| Meta Pixel / Dataset | `2417980718683508` |

> El container GTM ya está instalado en el sitio ([app/layout.tsx](../app/layout.tsx)) y el código ya empuja los eventos `generate_lead` y `contact` al `dataLayer`. Solo falta la config dentro de GTM.

---

## 1. Importar el container

1. GTM → **Administrador** → **Importar contenedor**.
2. Seleccioná `docs/gtm-container.json`.
3. Espacio de trabajo: **Existente** (tu workspace actual).
4. Tipo de importación: **Combinar** (Merge) → **Cambiar nombre de conflictos** (Rename conflicting).
5. Confirmá. Te crea: 1 Google Tag base, 2 tags GA4 (`generate_lead`, `contact`), 2 triggers (`CE — …`), 1 constante con el Measurement ID y 5 variables DLV.

> El Measurement ID `G-4FZQHDD51C` ya viene en la constante. No hay que tocarlo.

---

## 2. Duplicar el OneTag de Adsmurai (manual)

El JSON **no** trae los tags de Adsmurai (dependen del template instalado en tu container). Se duplican a mano del **PageView** que ya tenés funcionando. Por cada fila:

> Clic en ⋮ del tag PageView de Adsmurai → **Duplicar** → renombrar → cambiar **Event name** → cambiar **Activador** → guardar. **No tocar el PageView original.** Mantené el resto de la config igual (Pixel ID `2417980718683508`, modo *Both pixel & Conversions API*).

| Nombre del nuevo tag | Event name (en el tag) | Activador |
|---|---|---|
| `Adsmurai \| Lead` | `Lead` | `CE — generate_lead` |
| `Adsmurai \| Contact` | `Contact` | `CE — contact` |

### (Opcional pero recomendado) Advanced matching → mejor EMQ

El código ya empuja `customer_email`, `customer_phone` y `customer_name` en el evento `generate_lead`. Para que Meta los use y suba el Event Match Quality, configurá el advanced matching en el **dashboard de Adsmurai** (o en los campos de user data del OneTag) apuntando a esas keys del dataLayer. Adsmurai los hashea server-side. Si no lo configurás, quedan inertes (no rompen nada).

> ⚠️ Estos campos **no** se mandan a GA4 (PII prohibida). Solo el tag de Adsmurai/Meta los usa.

---

## 3. Validar en Vista Previa

1. GTM → **Vista previa** → ingresá la URL del sitio (producción, con el código ya deployado — ver nota abajo).
2. En Tag Assistant, reproducí cada flujo:

| Flujo a reproducir | Evento dataLayer esperado | Tags que deben dispararse |
|---|---|---|
| Registrarte **por primera vez** en `/promo` | `generate_lead` | `GA4 — generate_lead` + `Adsmurai \| Lead` |
| Girar y registrarte **por primera vez** en `/papa` | `generate_lead` | `GA4 — generate_lead` + `Adsmurai \| Lead` |
| Clic en cualquier botón/Fab de WhatsApp | `contact` | `GA4 — contact` + `Adsmurai \| Contact` |
| Enviar el form de `/contacto` | `contact` | `GA4 — contact` + `Adsmurai \| Contact` |

3. **Verificá que NO dispare** `generate_lead` al reenviar el form con un correo **ya registrado** (debe quedar mudo — es la regla de "solo leads nuevos").

### Validar GA4 (DebugView)
- GA4 → **Administrar** → **DebugView** (se activa solo con la Vista Previa de GTM).
- Confirmá que `generate_lead` y `contact` aparecen con sus parámetros (`lead_type`, `lead_origen`, `contact_method`, etc.).

### Validar Meta (Test Events)
- Events Manager → tu dataset `2417980718683508` → **Probar eventos**.
- Copiá el `test_event_code` y pegalo **temporalmente** en cada tag Adsmurai duplicado.
- Reproducí los flujos. Cada evento debe aparecer con badge **Navegador** + **Servidor** + **Deduplicado** (mismo `event_id`).

---

## 4. Publicar

1. **Borrá el `test_event_code`** de TODOS los tags Adsmurai (`Lead` y `Contact`). ⚠️ Si queda, todas las conversiones reales se van a Test Events y no a las campañas.
2. GTM → **Enviar** → nombrá la versión (ej. "Conversiones: Lead + Contact") → **Publicar**.

---

## 5. Configurar conversiones en cada plataforma

- **GA4**: Administrar → **Eventos clave** → marcá `generate_lead` y `contact` como clave (para verlos como conversión).
- **Meta**: Events Manager → **Configuración de eventos agregados (AEM)** → asegurate de que `Lead` y `Contact` estén entre los 8 eventos priorizados del dominio. Para campañas, optimizá por `Lead` (intención fuerte) y usá `Contact` como secundario.

---

## Checklist de deploy

- [ ] Código deployado en producción (los `dataLayer.push` solo existen tras el deploy — testear en prod, no en local).
- [ ] Container importado (Merge).
- [ ] 2 tags Adsmurai duplicados (`Lead`, `Contact`) con el activador correcto.
- [ ] Vista Previa OK (4 flujos + verificación de "no dispara en repetido").
- [ ] GA4 DebugView OK.
- [ ] Meta Test Events OK (Navegador + Servidor + Deduplicado).
- [ ] `test_event_code` borrado de los tags Adsmurai.
- [ ] Versión GTM publicada.
- [ ] Eventos marcados como clave en GA4 y priorizados en Meta AEM.

---

## Pitfalls

1. **`test_event_code` queda en producción** → todas las conversiones van a Test Events. Catastrófico. Borralo antes de publicar.
2. **Testear en local** → el código nuevo solo existe tras el deploy. Commit + push + deploy primero.
3. **Olvidar publicar GTM** → Vista Previa funciona pero producción no.
4. **CAPI no conectado en Adsmurai** → llegan eventos de Navegador pero no de Servidor. Revisá el access token de Meta en el dashboard de Adsmurai.
5. **Typo en nombres de variable** → el tag manda `undefined`. Las keys del dataLayer deben matchear EXACTO (`lead_type`, `contact_source`, etc.).
