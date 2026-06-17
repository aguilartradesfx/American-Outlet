# American Outlet — Área interna: Plan de contenido Junio 2026

> Documento de **contenido y alcance**, no de diseño. Claude Code decide la estructura, el layout, el estilo y la implementación técnica. Acá va toda la información que debe quedar representada.
>
> **Qué se construye:** un **área interna protegida con login** dentro del sitio de American Outlet. Detrás del login vive el plan de contenido de junio 2026 (todo lo de §2 en adelante). El público general no ve esto; solo las tiendas con cuenta.
>
> **Origen del contenido:** plan creado por un colaborador, desplegado como referencia visual. Este MD extrae la información para reimplementarla con criterio propio de layout.
>
> ⚠️ **Bloque pendiente:** el detalle día-por-día de la cuadrícula del calendario (qué pieza cae cada fecha del 1 al 30) **no está incluido todavía** — ver §6. Todo lo demás está completo.

---

## 0. Autenticación y acceso (área interna)

El calendario y toda la guía viven **detrás de un login**. No es contenido público.

**Tiendas con acceso (3 cuentas):**
- American Outlet Ciudad Quesada
- American Outlet Fortuna
- American Outlet Florencia

**Comportamiento del contenido:** las 3 tiendas ven **el mismo calendario de junio** (contenido idéntico). El login solo controla **quién entra**, no personaliza el calendario por tienda. No hay que separar data por tienda en esta versión.

**Autenticación:** Supabase Auth. Rutas internas protegidas (no accesibles sin sesión); redirección a login si no hay sesión válida; logout disponible.

**⚠️ Sobre las credenciales:** Claude Code monta el **mecanismo** de auth (integración con Supabase Auth, protección de rutas, manejo de sesión, y el esquema de usuarios/tiendas si hace falta una tabla de perfiles). Las **3 cuentas reales y sus contraseñas las crea el dueño** directamente en el dashboard de Supabase o con un script de seed que se corre localmente — NO se hardcodean credenciales ni contraseñas en el código ni en este documento. Dejar documentado en el README qué cuentas hay que crear y con qué rol.

**Modelo de roles (mínimo):** una sola clase de usuario ("tienda") con acceso de solo lectura al calendario. Si se quiere distinguir un rol admin (Bralto/dueño) que edite el contenido, queda a criterio de Claude Code proponerlo, pero no es requisito de esta versión.

---

## 1. Encabezado / identidad del plan

- **Marca:** American Outlet
- **Bajada:** Plan de contenido · Junio 2026 · 3 fases · Bralto
- **Marco temporal:** 3 fases · 30 días

## 2. Totales de producción del mes

| Tipo de pieza | Cantidad |
|---|---|
| Reels | 3 |
| Flyers | 8 |
| Carruseles | 3 |
| Lives | 7 |
| Cinema | 2 |
| Activaciones | 4 |
| Historias | 150 |

## 3. Vistas / secciones del panel interno

Una vez dentro (post-login), el panel organiza la información en tres vistas. Claude Code puede mantenerlas, fusionarlas o reorganizarlas:

1. **📅 Calendario** — la cuadrícula mensual (LUN–DOM) con la pieza de cada día. (Datos pendientes, §6.)
2. **📊 Las 3 Fases** — la lógica del mes y el desglose por fase.
3. **📱 Guía Historias** — los playbooks de historias por tipo de día.

Encabezados de la cuadrícula semanal: LUN · MAR · MIÉ · JUE · VIE · SÁB · DOM.

---

## 4. Las 3 Fases

**La lógica del mes:** el descuento sube y el inventario baja en paralelo. Esa tensión es la mecánica de todo junio.

**Regla de oro:** *Entre más esperás, más barato. Pero también menos queda.*

### Fase 1 — Apertura
- **Fechas:** Jun 1 → Jun 10
- **Descuento:** 15%
- **Tono / objetivo:** Stock alto. Urgencia baja. Pedagogía alta. *"Empezamos. Esto es lo que hay. Así funciona."*
- **Lógica:** Más opciones, menor descuento. El cliente que entra primero tiene donde elegir.
- **Piezas:** 1 Reel · 2 Flyers · 1 Carrusel · 2 Lives · 1 Cinema · 1 Activación

### Fase 2 — Mitad de mes
- **Fechas:** Jun 11 → Jun 20
- **Descuento:** 20%
- **Tono / objetivo:** Evidencia visual de movimiento. Tarimas con menos producto. *"Subió. Y ya hay huecos en piso."*
- **Lógica:** El descuento subió pero ya hay huecos. La evidencia visual hace el trabajo.
- **Piezas:** 1 Reel · 3 Flyers · 1 Carrusel · 3 Lives · 1 Cinema · 1 Activación

### Fase 3 — Gran cierre
- **Fechas:** Jun 21 → Jun 30
- **Descuento:** 25%
- **Tono / objetivo:** Tono directo. Urgencia real. El inventario hace el trabajo. *"Lo que ves es lo que queda."*
- **Lógica:** El mejor precio, pero lo que ves en piso es lo que queda. FOMO máximo.
- **Piezas:** 1 Reel · 3 Flyers · 1 Carrusel · 2 Lives · 2 Activaciones

---

## 5. Guía de Historias — playbooks por tipo de día

Cada día principal arrastra una secuencia de 5 historias (H1–H5). Hay 6 plantillas según el tipo de contenido principal del día.

### 🎬 Día con Reel (apertura de fase)
1. **H1:** Repost del Reel con sticker "NUEVO" encima. Texto: "Míralo completo." Sin más copy, que el sticker haga el trabajo.
2. **H2:** Foto del PDV abierto ese mismo día. Texto grande: ACÁ ESTAMOS. / Texto pequeño: "hoy arranca el mes." Sin filtros, real.
3. **H3:** Gráfico simple de las 3 fases: 15%→20%→25%. Texto superpuesto: GUARDÁ ESTO. Sticker de guardar habilitado.
4. **H4:** Sticker de ubicación (mapa IG) con la dirección del PDV. Debajo: horario del día en texto blanco. Simple.
5. **H5:** Poll sticker. Pregunta: "¿QUÉ BUSCÁS ESTE MES?" Opción A: Línea blanca. Opción B: Muebles. Opción C: Electros.

### 🖼️ Día con Flyer / Post estático
1. **H1:** Repost del flyer con flecha apuntando hacia abajo. Texto: "↓ MIRÁ ESTO" o simplemente repostear sin texto extra.
2. **H2:** Foto del producto del flyer en el piso del PDV. Nombre del producto en texto grande. Sub: "todavía en piso."
3. **H3:** Foto de detalle: zoom al sello de garantía, a la etiqueta, o al empaque. Un dato útil encima: capacidad, voltaje, dimensiones.
4. **H4:** Poll sencillo relacionado al producto. Ejemplo: "¿Ya la tenés en casa?" — Sí / No, la necesito.
5. **H5:** Sticker de ubicación + horario del día. Fondo: foto del PDV.

### 📖 Día con Carrusel
1. **H1:** Repost del slide 1 del carrusel. Texto superpuesto: "GUARDÁ ESTO" con sticker de guardar. Contexto: "manual del mes."
2. **H2:** Repost del slide 2. Texto: "LAS 3 FASES" / subtexto: "cómo funciona junio."
3. **H3:** Frase ancla sola, fondo negro, tipografía limpia: "ENTRE MÁS ESPERÁS / MÁS BARATO." Sub: "pero también menos queda."
4. **H4:** Sticker de compartir habilitado. Texto: "MANDÁSELO A QUIEN ESTÁ BUSCANDO."
5. **H5:** Ubicación + horario. Pie: "el carrusel queda fijado en el perfil."

### 🔴 Día con Live
1. **H1 (mañana):** Texto grande: HOY EN VIVO. Subtexto: tema del live. Sticker countdown configurado hasta la hora exacta.
2. **H2 (1h antes):** Texto: EN UNA HORA. Sub: descripción corta. Sticker de recordatorio activable (para que la gente lo guarde).
3. **H3 (justo antes):** Texto: ESTAMOS LISTOS. Sub: "entrá al perfil y dale al live." Sin stickers extra — limpiar para la acción.
4. **H4 (durante):** Clip corto de 5–10 seg del live ya corriendo. Texto: "EN VIVO AHORA." Enlace al live si IG lo permite.
5. **H5 (post-live):** Clip del mejor momento (15 seg). Texto: "si te lo perdiste, pasá al PDV mañana."

### 🎥 Día con Cinema
1. **H1:** Repost del cinema. Sin texto superpuesto. Sin stickers. Que respire. La estética es el mensaje.
2. **H2:** Fotograma fijo del cinema (un cuadro que funcione solo como foto). Sin texto. Solo imagen.
3. **H3:** Fondo negro puro. Tipografía blanca: "ESTO ES AMERICAN OUTLET." Sin logo. Sin nada más.
4. **H4:** Sticker de ubicación + horario. Fondo oscuro.
5. **H5:** Sticker de pregunta abierta. Pregunta: "¿qué te llevarías hoy?" Guardar las respuestas para usarlas después.

### 📆 Día sin contenido principal (mantenimiento)
1. **H1:** Texto sobre fondo de color de fase: "SEGUIMOS AL [%]". Sin más. Que sea limpio.
2. **H2:** Producto del día: foto + nombre en texto + un dato (capacidad, uso, precio). Rotar lo que no ha salido en posts.
3. **H3:** Screenshot anonimizado de DM o reseña de cliente. Texto: "esto nos llegó esta semana." No publicar si no está anonimizado.
4. **H4:** Poll liviano: "¿qué te falta en la casa?" Opciones: refri · lavadora · TV · muebles.
5. **H5:** Ubicación + horario. Siempre. Es lo más visto de las historias.

---

## 6. ⚠️ PENDIENTE — Calendario día por día

Esta es la única parte que falta. El sitio original muestra una cuadrícula mensual (LUN–DOM) donde **cada uno de los 30 días tiene asignada una pieza concreta** (qué Reel/Flyer/Carrusel/Live/Cinema/Activación cae ese día, o si es día de mantenimiento). Esa asignación no se pudo extraer del despliegue.

**Cómo debe quedar la estructura de cada día (cuando se tengan los datos):**
- Fecha (1–30 de junio) y día de la semana.
- Fase a la que pertenece (1, 2 o 3) → hereda % de descuento y color de fase.
- Pieza principal del día (Reel / Flyer / Carrusel / Live / Cinema / Activación / Mantenimiento).
- Título o tema de esa pieza (si aplica).
- La secuencia de historias H1–H5 se deriva automáticamente del tipo de día (ver §5).

**Validación de cuadre (los totales deben dar):** a lo largo de los 30 días, las piezas asignadas deben sumar exactamente: 3 Reels, 8 Flyers, 3 Carruseles, 7 Lives, 2 Cinema, 4 Activaciones. Las historias suman 150 (≈5 por día × 30).

> Acción: pegar acá la asignación diaria (la tengo que recuperar del navegador o del archivo fuente del colaborador). Hasta entonces, Claude Code puede dejar la estructura de la cuadrícula lista y parametrizada por datos, con las celdas alimentándose de un arreglo de 30 objetos día.

---

## 7. Notas de tono y de implementación

- **Voz:** español de Costa Rica, voseo, tono directo y seco. El inventario es el protagonista narrativo.
- **Naturaleza del entregable:** **área interna autenticada** dentro del sitio de American Outlet — una herramienta de planificación/visualización de contenido para uso de las tiendas, no contenido público. Datos sobre diseño.
- **Stack:** Supabase para auth (y para perfiles/tiendas si se necesita una tabla). El resto del stack y framework, a criterio de Claude Code (alineado al stack habitual: Next.js + Supabase, deploy GitHub → Vercel).
- **Modelo de datos sugerido:** separar la data (fases, piezas, días, playbooks) de la presentación, para que el calendario sea editable sin tocar layout. Como las 3 tiendas comparten el mismo calendario, la data del plan es única y global, no por tienda.
- **Seguridad:** rutas del panel protegidas; sin sesión válida → redirección a login. Nunca exponer el contenido interno a usuarios no autenticados ni a crawlers (noindex en el área interna).
- Lo no especificado (layout, navegación entre las 3 vistas, responsive, UI del login) queda a criterio de Claude Code.
