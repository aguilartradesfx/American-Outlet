# Measurement Plan — American Outlet

Tracking de conversiones. Fuente de verdad de qué se mide, cuándo dispara y a dónde va.

## IDs del proyecto

| Pieza | ID |
|---|---|
| GTM Container | `GTM-TJM26DFH` |
| GA4 Measurement ID | `G-4FZQHDD51C` |
| Meta Pixel / Dataset (Adsmurai) | `2417980718683508` |

Stack: `dataLayer.push` → GTM → (GA4 Event tags) + (Adsmurai OneTag → Meta Browser Pixel + Server CAPI, dedupeado por `event_id`).

## Alcance V1

Sitio de **captación + WhatsApp** (no transaccional). El e-commerce (aostores.com) es independiente y **aún no está conectado** — los eventos de producto/carrito/checkout/compra se instrumentan en una fase posterior. Ver [Pendiente: e-commerce](#pendiente--e-commerce-fase-2).

## Eventos

| dataLayer `event` | Cuándo dispara | Dónde (código) | Parámetros | GA4 | Meta |
|---|---|---|---|---|---|
| `generate_lead` | Registro de lead **nuevo** en el form de promo (cupón). Solo si `yaRegistrado === false`. | [PromoForm.tsx](../app/(public)/promo/PromoForm.tsx) | `lead_type: "promo_cupon"`, `lead_origen: "banner-junio-2026"`, `customer_email`*, `customer_phone`*, `customer_name`* | ✅ `generate_lead` | ✅ `Lead` |
| `generate_lead` | Registro de lead **nuevo** en la ruleta del Día del Padre. Solo si `yaRegistrado === false`. | [RuletaLanding.tsx](../app/papa/RuletaLanding.tsx) | `lead_type: "ruleta_papa"`, `lead_origen: "ruleta-papa-ads"`, `customer_email`*, `customer_phone`*, `customer_name`* | ✅ `generate_lead` | ✅ `Lead` |
| `contact` | Clic en cualquier enlace a WhatsApp (Fab, Header, Footer, botones de página, tiendas). | Listener delegado [WhatsAppContactTracker.tsx](../components/analytics/WhatsAppContactTracker.tsx) (montado en [(public)/layout.tsx](../app/(public)/layout.tsx)) | `contact_method: "whatsapp"`, `contact_source` (pathname), `contact_label` (texto/aria del enlace) | ✅ `contact` | ✅ `Contact` |
| `contact` | Envío del form de contacto (abre WhatsApp con mensaje armado). | [ContactForm.tsx](../components/ContactForm.tsx) | `contact_method: "whatsapp"`, `contact_source: "/contacto"`, `contact_label: "form_contacto:<interés>"` | ✅ `contact` | ✅ `Contact` |

\* **Campos de advanced matching** (`customer_email`, `customer_phone`, `customer_name`): solo para que Adsmurai/Meta mejoren el Event Match Quality vía hash server-side. **NO se mapean al tag de GA4** (GA4 prohíbe PII). Quedan inertes hasta que se configure el advanced matching en el dashboard de Adsmurai (ver guía).

### Regla de prioridad de leads

`generate_lead` / `Lead` dispara **solo en registros nuevos** (`yaRegistrado === false`). Quien reenvía el form ya estando registrado **no** genera conversión — evita inflar Meta con duplicados. El backend ([registrarLeadCore](../lib/leads/registrar.ts)) devuelve `yaRegistrado` para distinguirlos.

## Mapeo a eventos estándar de Meta

| dataLayer event | Evento Meta (case-sensitive) | Valor de conversión | Prioridad |
|---|---|---|---|
| `generate_lead` | `Lead` | Sin valor monetario (lead de cupón) | Alta — optimizar campañas |
| `contact` | `Contact` | Sin valor monetario | Media — intención de venta vía WhatsApp |

Meta admite hasta 8 conversion events de prioridad. Acá usamos **2** (`Lead`, `Contact`) + el `PageView` base. Margen de sobra para sumar e-commerce en fase 2.

## Lo que NO se trackea (decidido)

- **Descarga del cupón** — quien llega al cupón ya convirtió como lead; la descarga no aporta señal.
- **Eventos de engagement** (scroll, clics genéricos) — GA4 ya los captura con Enhanced Measurement si se activa; no van a Meta.

## Pendiente — e-commerce (fase 2)

Cuando se conecte aostores.com, sumar (GA4 / Meta):
`view_item` / `ViewContent` · `add_to_cart` / `AddToCart` · `begin_checkout` / `InitiateCheckout` · `purchase` / `Purchase` (con `value` + `currency: "CRC"`).
