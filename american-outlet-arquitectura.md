# American Outlet — Arquitectura y contexto del sitio

> Documento de contexto para Claude Code. Describe **qué** debe lograr el sitio y **por qué**, no el **cómo**. Las decisiones de implementación (estructura de carpetas, componentes, data fetching, librerías) las toma Claude Code.

---

## 1. Contexto del negocio

Operación: importan saldos y liquidaciones de grandes tiendas departamentales de EE.UU. (devoluciones, sobreinventario, cambios de temporada), pasan por su CEDI en Ciudad Quesada (Barrio Los Ángeles, San Carlos) y se distribuyen a las tiendas. Inventario nuevo se lista a diario. Más de 15 años en el mercado.

**Problema a resolver:** la presencia digital está fragmentada en varios dominios y plantillas genéricas (aostores.com, un legacy americanoutletcr.com muerto, subdominios de terceros). No existe un sitio de marca propio que consolide autoridad, capture SEO y dé respaldo a la marca. La marca tiene fuerza en redes (~200k seguidores) pero cero capital SEO consolidado.

---

## 2. Objetivo del sitio

Construir el **hub de marca canónico** de American Outlet que:

1. Consolide la identidad de marca en un solo dominio autoritativo.
2. Capture y posicione SEO por términos de marca + categoría + intención local ("outlet", "liquidaciones", "saldos americanos", nombres de tienda por zona).
3. Lleve tráfico calificado a (a) las tiendas físicas y (b) el e-commerce existente.
4. Capte leads del canal mayorista y los derive al brazo B2B.
5. Transmita los diferenciadores reales: tiendas físicas + garantía de ley + respaldo local + inventario nuevo a diario.

**Modelo elegido:** hub de marca que *puentea* al e-commerce (aostores.com) en lugar de duplicar un segundo carrito transaccional. (Si el cliente decide migrar el e-commerce a este dominio, la IA escala a transaccional — ver §9.)

---

## 3. Audiencias

- **Consumidor final** — busca ofertas, ubicaciones de tienda, horarios, garantía, cómo comprar online.
- **Revendedor / emprendedor (mayoreo)** — busca lotes, pallets, contenedores. Se le da una vía clara hacia el brazo B2B sin contaminar la experiencia B2C.
- **Buscador local** — gente buscando "outlet cerca de mí" o por nombre de cantón.

---

## 4. Diferenciadores a comunicar (posicionamiento)

La narrativa "somos liquidadores / directo de tiendas departamentales de EE.UU." la usa toda la categoría. El sitio debe apoyarse en lo que **solo American Outlet** puede sostener:

- Red de **tiendas físicas** propias (no solo despacho desde Miami).
- **Garantía conforme a la ley costarricense** — respaldo que el liquidador B2B puro no da.
- **Inventario nuevo a diario** y entrega/disponibilidad inmediata dentro del país.
- Trayectoria local (15+ años) y respaldo de marca reconocida.

---

## 5. Mapa del sitio (arquitectura de información)

- **Home** — propuesta de valor, diferenciadores, accesos a tiendas/ofertas/online.
- **Tiendas** — índice + **una página por ubicación** (clave para SEO local). Cada una con dirección, mapa, horario, teléfono/WhatsApp, fotos.
- **Categorías** — vitrina de líneas (tecnología, hogar, electrodomésticos, ropa, calzado, juguetes, bebé, herramientas, deporte…). No es catálogo transaccional: es descubrimiento que enlaza al e-commerce.
- **Ofertas / Novedades** — destaque de promos vigentes; alimentable sin tocar código.
- **Cómo comprar / Envíos** — proceso online, cobertura nacional, tiempos, logística.
- **Garantía** — política de respaldo (gancho diferenciador, no enterrarlo en legales).
- **Nosotros** — historia, modelo de importación, CEDI, trayectoria.
- **Mayoreo** — landing puente hacia el brazo B2B (Liquidation Warehouse) con formulario de calificación de lead.
- **Contacto** — canales, ubicación CEDI, formulario.
- **Blog / Guías** (opcional, fase 2) — contenido SEO de cola larga ("cómo comprar liquidaciones", guías por categoría).

---

## 6. Objetivo por página (qué debe lograr, no cómo se ve)

- **Home:** en 5 segundos comunicar qué es, por qué confiar (tiendas + garantía) y dar tres rutas: ver tiendas, ver ofertas, comprar online.
- **Tiendas (detalle):** que alguien encuentre la tienda más cercana y llegue / escriba. Optimizada para "[categoría/outlet] + [cantón]".
- **Categorías:** que el usuario entienda el surtido y haga clic hacia el e-commerce.
- **Mayoreo:** filtrar y capturar al revendedor serio, derivándolo al canal correcto.
- **Garantía / Cómo comprar:** eliminar fricción y objeciones de confianza típicas de comprar liquidaciones.

---

## 7. Requisitos SEO (no negociables)

- **Dominio canónico único.** Consolidar señales; plan de redirects 301 desde el legacy si aplica.
- **Páginas de tienda por ubicación** con contenido único (no plantilla duplicada) para SEO local; vincular a los perfiles de Google Business.
- **Datos estructurados (schema.org):** `Organization`, `LocalBusiness`/`Store` por sede, `BreadcrumbList`, y `Offer`/`Product` donde aplique.
- **Metadata real y única por página** (title + description escritos a mano). Evitar que texto legal o de plantilla se filtre como meta — fue el error del sitio actual.
- **Core Web Vitals** en verde: imágenes optimizadas/lazy, render eficiente.
- **Sitemap.xml + robots.txt** correctos.
- **Idioma:** ES-CR como principal. Dejar la arquitectura preparada para un EN opcional (hay público expat) sin forzarlo en V1.

---

## 8. Integraciones y datos

- **Catálogo/ofertas:** definir fuente — feed/sincronización con el e-commerce existente o un CMS ligero editable por el cliente para promos. No hardcodear ofertas.
- **Captación de leads (mayoreo y contacto):** conectar a la pila de automatización del cliente. *Nota de confidencialidad: la plataforma de CRM/automatización no se nombra públicamente en el sitio.*
- **Analítica:** GA4 + GTM con eventos de conversión definidos (clic a WhatsApp, envío de formulario mayoreo, clic a e-commerce, ver tienda).
- **WhatsApp:** canal de contacto primario; presente de forma persistente pero no intrusiva.

---

## 9. Restricciones técnicas y de marca

- **Stack objetivo:** Next.js 15 + Tailwind, deploy por GitHub → Vercel.
- **Sistema de diseño:** usar el **brand book existente de American Outlet** como fuente de verdad (tipografía Poppins y la identidad ya aprobada). No inventar paleta nueva.
- **Editabilidad:** ofertas, tiendas y promos deben poder actualizarse sin tocar código.
- **Escalabilidad a transaccional:** si en el futuro se decide migrar el e-commerce a este dominio, la IA de §5 (Categorías → Producto) debe poder evolucionar a carrito sin rehacer la estructura.

---

## 10. Lo que decide Claude Code

Estructura de carpetas y rutas, componentes y su composición, estrategia de data fetching/rendering (SSG/ISR/SSR por página), CMS o fuente de contenido, manejo de imágenes, y cualquier librería de apoyo. Este documento define el problema, las metas y las restricciones; la implementación es tuya.

---

## Decisión pendiente para el cliente

Confirmar la sociedad que factura/respalda la marca retail (para `Organization` schema, footer legal y datos de garantía), dado que en el grupo conviven al menos: la S.R.L. 3-102-930792 (aostores.com) y una "Ad Store Costa Rica S.A." en registros de importación.
