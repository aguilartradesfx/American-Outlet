import type { CalendarioOperativo } from "./tipos";

/**
 * AMERICAN OUTLET LA FORTUNA — Calendario Operativo de Contenido.
 * Transcrito del manual operativo (Bralto 2026). Solo lectura.
 */
export const fortuna: CalendarioOperativo = {
  tiendaSlug: "fortuna",
  tiendaNombre: "American Outlet La Fortuna",
  subtitulo: "Calendario Operativo de Contenido — Manual para Administrador",
  intro:
    "Este documento es su guía de trabajo diaria. Cada día tiene instrucción exacta para la persona de contenido. No se improvisa. Se ejecuta.",

  cliente: {
    titulo: "Quién es el cliente de La Fortuna",
    intro:
      "La Fortuna tiene dos clientes distintos y ambos son igual de importantes.",
    segmentos: [
      {
        titulo: "Cliente A — Dueño de Airbnb o propiedad turística",
        descripcion:
          "Opera una cabaña, villa o Airbnb en la zona del Arenal, lago Arenal, Chachagua o El Castillo. Necesita equipar su propiedad completa — desde la refrigeradora hasta los kayaks para sus huéspedes. Compra en volumen, vuelve con frecuencia cuando renueva, y valora encontrar todo en un solo lugar sin tener que ir hasta San José. La temporada baja (mayo–noviembre) es su momento de inversión — cuando no hay huéspedes, renueva.",
      },
      {
        titulo: "Cliente B — Residente local activo",
        descripcion:
          "Familia de La Fortuna o alrededores con vida activa al aire libre. Compra línea blanca para su casa, muebles para su patio, o equipo para el lago y los ríos. Conoce la zona, valora lo práctico, y compra cuando hay oportunidad real.",
      },
    ],
    enComun:
      "Lo que ambos tienen en común: buscan marcas reconocidas a precio justo, y el outlet les da exactamente eso cuando entienden el modelo.",
  },

  estructuraDiaria: {
    totalPiezas: 38,
    bloques: [
      {
        bloque: "Fichas de producto",
        cantidad: 35,
        que: "Una historia por producto, organizada por categoría",
      },
      {
        bloque: "Historias interactivas",
        cantidad: 3,
        que: "Video BTS · PDV · cliente · encuesta · storytelling turístico",
      },
    ],
  },

  fichas: {
    queEs:
      "Una historia de Instagram (1080×1920px) con foto real del producto disponible en tienda ese día. Incluye nombre del artículo, categoría, mensaje de outlet y CTA. La persona de contenido toma la foto, aplica la plantilla de marca y publica.",
    instruccion:
      "Cada día tomás foto a 35 productos distintos disponibles en tienda. Uno por historia. Los organizás por las categorías de abajo. Si un producto se vendió, lo reemplazás por otro de la misma categoría. Nunca repetir el mismo artículo dos días seguidos si hay stock nuevo.",
    categorias: [
      {
        n: 1,
        categoria: "Línea blanca grande",
        porDia: 6,
        ejemplos:
          "Refrigeradoras · lavadoras · secadoras · aires acondicionados · freezers",
      },
      {
        n: 2,
        categoria: "Línea blanca pequeña",
        porDia: 6,
        ejemplos:
          "Cafeteras · freidoras · microondas · licuadoras · tostadoras · extractores · arroceras · sandwicheras",
      },
      {
        n: 3,
        categoria: "Mueblería exterior",
        porDia: 6,
        ejemplos:
          "Sets de jardín · sillas de patio · mesas de exterior · sombrillas · hamacas · bancas de jardín",
      },
      {
        n: 4,
        categoria: "Mueblería interior",
        porDia: 5,
        ejemplos: "Sillas · sillones · mesas · racks · puffs · muebles auxiliares",
      },
      {
        n: 5,
        categoria: "Deportes acuáticos y outdoor",
        porDia: 5,
        ejemplos:
          "Kayaks · chalecos salvavidas · snorkel · tablas · artículos de playa · camping · sillas de playa",
      },
      {
        n: 6,
        categoria: "Tecnología y electrodomésticos",
        porDia: 4,
        ejemplos:
          "Televisores · ventiladores · audífonos · parlantes · cámaras de acción · accesorios",
      },
      {
        n: 7,
        categoria: "Artículos de cocina y hogar",
        porDia: 3,
        ejemplos:
          "Ollas · sartenes · utensilios · sets de vajilla · organización de cocina",
      },
    ],
    plantillas: [
      {
        titulo: "Plantilla de texto — versión Airbnb",
        texto:
          "[NOMBRE DEL ARTÍCULO EN MAYÚSCULAS]\nLiquidación de marca · en perfecto estado\nIdeal para tu cabaña, Airbnb o casa\n📍 American Outlet La Fortuna · [dirección]\n⏰ [Horario]",
      },
      {
        titulo: "Plantilla de texto — versión cliente local",
        texto:
          "[NOMBRE DEL ARTÍCULO EN MAYÚSCULAS]\nLiquidación de marca · precio de outlet\nPara tu hogar o tu propiedad\n📍 American Outlet La Fortuna · [dirección]\n⏰ [Horario]",
      },
    ],
    reglasFoto: [
      "Refrigeradoras y lavadoras: frente limpio, sin stickers de precio, puertas cerradas",
      "Línea blanca pequeña: sobre superficie limpia que simule contexto de cocina",
      "Muebles de exterior: si el tiempo lo permite, sacarlos afuera y fotografiar con vegetación o contexto del Arenal de fondo — es el diferenciador visual más poderoso de esta tienda",
      "Kayaks y equipo acuático: fotografiar afuera si es posible, que se vea el contexto natural",
      "Tecnología: sobre superficie limpia, bien iluminada",
    ],
  },

  historias: {
    intro:
      "Estas tres historias son el motor de comunidad de la cuenta. No venden producto directamente — construyen la confianza, el entretenimiento y la conexión con los dos tipos de cliente de La Fortuna. Son las que generan comentarios, shares y seguidores nuevos.",
    items: [
      {
        numero: 1,
        titulo: "BTS (Detrás de cámara)",
        proposito:
          "La Fortuna es una zona turística donde la gente valora la autenticidad sobre todo. Un dueño de Airbnb que ve cómo funciona el outlet por dentro — cómo llega el stock, cómo se organiza, qué tipo de productos entran — deja de ver la tienda como un lugar desconocido y empieza a verla como un proveedor de confianza. Para el cliente local, el BTS genera identificación con el equipo y con la tienda. Además, en una zona con alto tráfico de turistas en redes sociales, el contenido visual auténtico con contexto del Arenal tiene un alcance orgánico altísimo. El BTS es la historia que más comparten porque la gente siente que está descubriendo algo.",
        formatos: [
          {
            letra: "A",
            titulo: "Descarga de mercadería nueva",
            descripcion:
              "Grabar la llegada de producto. Cajas entrando, refrigeradoras bajando, kayaks llegando. Cámara en mano, sin edición. Que se vea el movimiento real de la tienda. Texto sobre video: «Llegó mercadería nueva — esto va a volar esta semana.» Duración: 15–30 segundos.",
          },
          {
            letra: "B",
            titulo: "Unboxing de producto inesperado",
            descripcion:
              "Abrir una caja nueva frente a cámara y mostrar con genuina emoción o sorpresa lo que hay adentro. «Mirá lo que acaba de llegar para los que tienen Airbnb en la zona...» Este formato funciona especialmente bien para kayaks, equipo acuático o electrodomésticos de marca reconocida.",
          },
          {
            letra: "C",
            titulo: "El kayak afuera",
            descripcion:
              "Sacar un kayak u otro artículo de exterior al frente de la tienda y grabarlo con el contexto visual de La Fortuna — vegetación, Arenal de fondo si es posible. Sin texto vendedor. Solo el producto en su ambiente. Texto: «¿Para cuándo uno de estos en tu hospedaje?» Este video tiene potencial alto de alcance orgánico porque es visualmente impactante para turistas y dueños de Airbnb que lo ven desde fuera de la zona.",
          },
          {
            letra: "D",
            titulo: "Acomodo de tienda en timelapse",
            descripcion:
              "Grabar en timelapse cómo se organiza una sección de la tienda — el área de exterior, los electrodomésticos, los kayaks. Texto: «Así dejamos lista la tienda para vos cada mañana.»",
          },
          {
            letra: "E",
            titulo: "El antes/después del estante",
            descripcion:
              "Estante desordenado → se acomoda → queda perfecto. Cámara fija o en mano. Texto: «De esto a esto en 20 minutos.»",
          },
        ],
        instruccion:
          "Una vez al día grabás algo que el cliente normalmente no ve. No tiene que ser perfecto — tiene que ser real. Si llegó mercadería, lo grabás. Si sacaron los kayaks, lo grabás. Si hay algo que sorprende de lo que entró, lo grabás. Si podés salir afuera con el producto y meter el Arenal o la vegetación de fondo, mejor todavía.",
      },
      {
        numero: 2,
        titulo: "PDV (Punto de venta en acción)",
        proposito:
          "El dueño de Airbnb no siempre sabe que American Outlet La Fortuna tiene todo lo que necesita. Necesita que alguien se lo muestre, se lo explique y le dé confianza. Cuando el encargado o el equipo habla a cámara — con naturalidad, con humor, con conocimiento del producto — la cuenta deja de ser un catálogo y se convierte en una asesoría. Para el cliente local, el equipo hablando con humor o haciendo cosas inesperadas genera identificación y entretenimiento. En una comunidad como La Fortuna, donde todo el mundo se conoce, reconocer a las personas de la tienda en el contenido es exactamente lo que hace que alguien etiquete a un amigo o comparta una historia.",
        formatos: [
          {
            letra: "A",
            titulo: "El encargado asesora al dueño de Airbnb",
            descripcion:
              "20 segundos. Encargado frente a un producto o caminando por la tienda, hablando directo a cámara: «Si tenés un Airbnb en la zona y andás buscando una refri confiable, aquí tenemos [producto]. Es de marca, está en perfecto estado, y al precio de un outlet. Pasá a verla.» Directo, sin script forzado, sin pose.",
          },
          {
            letra: "B",
            titulo: "«Todo lo que necesita tu Airbnb» — mini-recorrido",
            descripcion:
              "25–30 segundos recorriendo la tienda mostrando categorías: primero línea blanca, luego exterior, luego acuático. «Para el que tiene una cabaña en la zona: esto, esto y esto. Todo en un solo lugar.» Es el formato de mayor alcance entre el segmento Airbnb porque les resuelve mentalmente el problema de ir a buscar producto en varios lados.",
          },
          {
            letra: "C",
            titulo: "Reto o momento gracioso del equipo",
            descripcion:
              "Alguien del equipo intenta algo con el producto — armar una silla de jardín en tiempo récord, entrar en un kayak adentro de la tienda, doblar un artículo de exterior. Que sea espontáneo y gracioso. Texto: «No intenten esto en casa...» o «Así probamos los productos antes de venderlos...» Este tipo de video genera comentarios y se comparte — es el de mayor alcance orgánico de la semana cuando funciona.",
          },
          {
            letra: "D",
            titulo: "«¿Sabías que...?» — dato de producto",
            descripcion:
              "Encargado frente a un producto, dice algo que el cliente no espera: «¿Sabías que esta lavadora es de [marca]? Llegó por liquidación de stock — el producto está nuevo, con garantía incluida. Eso es lo que encontrás aquí.»",
          },
          {
            letra: "E",
            titulo: "Comparativa honesta",
            descripcion:
              "Encargado muestra el mismo tipo de producto en outlet vs. lo que costaría en una tienda normal. Sin decir precios exactos — solo la diferencia de concepto. «En una tienda normal, una refri de esta marca te sale [rango general]. Aquí es liquidación. La diferencia se la quedás vos.»",
          },
        ],
        instruccion:
          "Una vez al día alguien del equipo graba algo frente a cámara. Puede ser una recomendación para dueños de Airbnb, un chiste, un recorrido de tienda o un dato de producto. No se ensaya — se graba, se revisa una vez y se publica. El objetivo es que los dueños de cabinas y los locales de La Fortuna reconozcan a las personas de la tienda y les tengan confianza.",
      },
      {
        numero: 3,
        titulo: "Cliente / Encuesta / Storytelling turístico",
        proposito:
          "Esta es la historia que convierte seguidores en comunidad y comunidad en ventas. En La Fortuna, el dueño de Airbnb que aparece mostrando lo que compró para su propiedad le está vendiendo a todos sus colegas dueños de hospedaje de la zona. Un cliente contento en video es la publicidad más efectiva posible porque es real, es local y es específica para el mercado. Las encuestas generan interacción que el algoritmo impulsa — cada respuesta lleva la historia a más gente. El storytelling turístico conecta el producto con el contexto único de La Fortuna: el lago, el Arenal, las actividades, los Airbnb — ese contexto no lo tiene ninguna otra tienda del país y hay que usarlo.",
        formatos: [
          {
            letra: "A",
            titulo: "Video de cliente Airbnb comprando o mostrando su compra",
            descripcion:
              "Pedirle al dueño de Airbnb o cabaña que acaba de comprar que grabe 15–20 segundos mostrando su producto o contando qué compró. «Me llevé la lavadora y el set de jardín para mi cabaña en [zona]. Todo de marca, precio de outlet.» La tienda lo comparte con permiso. Este formato es el de mayor conversión entre el segmento Airbnb.",
          },
          {
            letra: "B",
            titulo: "Encuesta de equipamiento",
            descripcion:
              "Pregunta orientada al dueño de propiedad turística: «Si tenés un Airbnb en La Fortuna, ¿qué es lo que más te cuesta conseguir?» 👆 Línea blanca confiable / 👇 Muebles de exterior que aguanten. O: «¿Ofrecés kayaks o actividades acuáticas en tu hospedaje?» 👆 Sí, es parte del paquete / 👇 No, pero me gustaría. Estas respuestas le dicen al administrador exactamente qué producto destacar más.",
          },
          {
            letra: "C",
            titulo: "Storytelling: «Por qué los dueños de Airbnb compran aquí»",
            descripcion:
              "Historia en 3–4 slides contando el modelo outlet aplicado al dueño de propiedad turística. Slide 1: «¿Por qué cada vez más Airbnbs de La Fortuna se equipa en American Outlet?» Slide 2: «Porque pueden encontrar refrigeradora, lavadora, muebles de exterior y kayaks en un solo lugar — sin ir a San José.» Slide 3: «Todo es liquidación de stock de marca. El producto está en perfecto estado. El precio es de outlet.» Slide 4: «American Outlet La Fortuna · [dirección] · [horario]»",
          },
          {
            letra: "D",
            titulo: "Storytelling: «El Arenal desde tu hospedaje»",
            descripcion:
              "Historia aspiracional que conecta el producto con la experiencia turística de la zona. Slide 1: foto del Arenal o del lago → «Tus huéspedes vienen por esto.» Slide 2: foto de set de muebles de exterior en tienda → «Se quedan por esto.» Slide 3: foto de kayak → «Y vuelven por esto.» Slide 4: «Equipá tu hospedaje en American Outlet La Fortuna.» Este formato tiene potencial de alcance fuera de la zona — turistas que lo ven y lo comparten.",
          },
          {
            letra: "E",
            titulo: "Encuesta educativa outlet",
            descripcion:
              "«¿Creés que en un outlet el producto puede tener defectos?» 👆 Sí, siempre lo pensé / 👇 No, sé que es liquidación de marca. Después del voto: reveal educativo explicando el modelo con una historia de texto simple.",
          },
          {
            letra: "F",
            titulo: "Repost de cliente o dueño de Airbnb",
            descripcion:
              "Si alguien etiqueta la tienda mostrando cómo quedó su propiedad con productos de American Outlet — repostearlo con mensaje de agradecimiento y contexto: «Mirá cómo quedó la cabaña de [nombre] con lo que encontraron aquí 🙌»",
          },
        ],
        instruccion:
          "Una vez al día publicás una historia que involucre al cliente, genere interacción o cuente algo sobre por qué tiene sentido comprar aquí. Si hubo un dueño de Airbnb que compró algo grande, le pedís permiso y grabás. Si no hay cliente disponible, usás una encuesta de equipamiento o el storytelling del Arenal. El objetivo es que esta cuenta sea reconocida en toda la zona turística como el lugar donde los hospedajes se equipa.",
      },
    ],
  },

  checklist: [
    "¿Ya le dije a la persona de contenido cuáles son los 35 productos del día?",
    "¿Los productos están organizados por categoría?",
    "¿Cuál es el BTS del día? ¿Hay algo que llegó o se puede grabar?",
    "¿Cuál es el video de PDV del día? ¿Quién del equipo lo graba?",
    "¿Hay algún dueño de Airbnb o cliente grande disponible para grabar hoy?",
    "¿Estamos en temporada alta, media o baja? ¿Cambia el foco?",
    "¿Hay alguna fecha o evento turístico esta semana que aprovechar?",
  ],

  focoSemanal: [
    {
      dia: "Lunes",
      focoFichas: "Línea blanca grande + pequeña (foco Airbnb apertura de semana)",
      bts: "Descarga o acomodo de mercadería",
      pdv: "Encargado asesora al dueño de Airbnb",
      cliente: "Storytelling: «Por qué los Airbnbs compran aquí»",
    },
    {
      dia: "Martes",
      focoFichas: "Mueblería exterior + interior",
      bts: "Antes/después de estante de exterior",
      pdv: "Mini-recorrido «todo para tu cabaña»",
      cliente: "Encuesta de equipamiento",
    },
    {
      dia: "Miércoles",
      focoFichas: "Deportes acuáticos + exterior",
      bts: "El kayak afuera con contexto Arenal",
      pdv: "Reto gracioso con producto acuático",
      cliente: "Video de cliente Airbnb o local",
    },
    {
      dia: "Jueves",
      focoFichas: "Tecnología + cocina + hogar",
      bts: "Unboxing de producto inesperado",
      pdv: "«¿Sabías que...?» dato de producto",
      cliente: "Encuesta educativa outlet",
    },
    {
      dia: "Viernes",
      focoFichas: "Línea blanca grande + acuático (foco fin de semana)",
      bts: "BTS preparación fin de semana",
      pdv: "Comparativa honesta outlet vs. tienda normal",
      cliente: "Storytelling del Arenal aspiracional",
    },
    {
      dia: "Sábado",
      focoFichas: "Todos con más urgencia · exterior y acuático primero",
      bts: "Tienda en movimiento · producto afuera",
      pdv: "Mini-tour especial de sábado",
      cliente: "Video de cliente del día",
    },
    {
      dia: "Domingo",
      focoFichas: "Lo disponible · línea blanca + acuático",
      bts: "BTS cierre de semana",
      pdv: "Algo gracioso o inesperado del equipo",
      cliente: "Repost de cliente o encuesta próxima semana",
    },
  ],

  temporadas: [
    {
      temporada: "Temporada alta",
      meses: "Dic · Ene · Feb · Mar · Sem Santa",
      foco: "Urgencia de stock · «equipá antes de que lleguen los huéspedes» · Línea blanca y exterior protagonistas",
    },
    {
      temporada: "Temporada media",
      meses: "Jul · Ago",
      foco: "Deportes acuáticos · lifestyle activo · turismo nacional · kayaks y exterior",
    },
    {
      temporada: "Temporada baja",
      meses: "May · Jun · Sep · Oct · Nov",
      foco: "Renovación de propiedad · «momento de invertir mientras no hay temporada» · Línea blanca grande como inversión",
    },
  ],

  fechasEspeciales: [
    {
      fecha: "Enero",
      cambio:
        "«Equipá tu propiedad antes de que arranque el año lleno» — urgencia Airbnb",
    },
    {
      fecha: "Semana Santa",
      cambio: "«¿Tu Airbnb está listo para Semana Santa?» — máxima urgencia",
    },
    {
      fecha: "Mayo–junio",
      cambio:
        "«Temporada baja = el mejor momento para renovar tu hospedaje»",
    },
    {
      fecha: "Día del Padre (21 jun)",
      cambio: "Artículo exterior o acuático como regalo para papá activo",
    },
    {
      fecha: "Julio",
      cambio: "Kayaks y exterior protagonistas — turismo nacional en movimiento",
    },
    {
      fecha: "Noviembre",
      cambio:
        "«Quedan semanas para temporada alta — ¿tu hospedaje está listo?»",
    },
    {
      fecha: "Diciembre",
      cambio: "«Temporada alta ya llegó — lo que quede se mueve rápido»",
    },
  ],

  porQueFunciona: [
    "Las 35 fichas de producto diarias mantienen a American Outlet La Fortuna presente en las stories de todos los que siguen la cuenta, todos los días. Para el dueño de Airbnb que está pensando en renovar su propiedad, ver refris, lavadoras, sets de jardín y kayaks todos los días en su teléfono hace que cuando tome la decisión de comprar, la primera tienda que recuerde sea esta.",
    "Las 3 historias interactivas construyen algo que las fichas de producto no pueden hacer solas: posicionan la tienda como el proveedor natural de la zona turística. El BTS con contexto del Arenal genera alcance orgánico más allá de los seguidores actuales — turistas y propietarios de otras zonas lo ven y lo comparten. El PDV con el equipo hablando directamente a los dueños de Airbnb hace una venta consultiva sin tener que pagar publicidad. El storytelling turístico conecta los productos con la identidad única de La Fortuna — esa conexión no la puede hacer ninguna otra tienda fuera de la zona.",
    "La combinación de volumen de producto más contenido auténtico y turístico crea una cuenta que trabaja las 24 horas — mientras los huéspedes llegan al Arenal y sus anfitriones están buscando dónde equipar, American Outlet La Fortuna ya está en su teléfono.",
  ],
};
