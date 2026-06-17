import type { CalendarioOperativo } from "./tipos";

/**
 * AMERICAN OUTLET FLORENCIA — Calendario Operativo de Contenido.
 * Transcrito del manual operativo (Bralto 2026). Solo lectura.
 */
export const florencia: CalendarioOperativo = {
  tiendaSlug: "florencia",
  tiendaNombre: "American Outlet Florencia",
  subtitulo: "Calendario Operativo de Contenido — Manual para Administrador",
  intro:
    "Este documento es su guía de trabajo diaria. Cada día tiene instrucción exacta para la persona de contenido. No se improvisa. Se ejecuta.",

  cliente: {
    titulo: "Quién es el cliente de Florencia",
    intro:
      "Florencia es una zona residencial y familiar. El cliente no es turista — es la vecina que quiere renovar el cuarto, el recién casado amueblando su primera casa, la mamá que busca un buen edredón sin pagar precio de tienda departamental. Compra planificado, valora las marcas, y desconfía del outlet hasta que lo educa. Su decisión de compra se activa viernes y sábado.",
    segmentos: [],
    mueve: "Hogar bonito, precio inteligente, marca confiable.",
    frena:
      "«¿Será dañado?» — esa objeción hay que romperla semana a semana.",
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
        que: "Video BTS · PDV · cliente · encuesta · reto · story telling",
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
        categoria: "Ropa de cama",
        porDia: 8,
        ejemplos:
          "Edredones · juegos de sábanas · almohadas · cobertores · protectores · mantas · fundas · cubre colchón",
      },
      {
        n: 2,
        categoria: "Mueblería interior",
        porDia: 7,
        ejemplos:
          "Sillas · sillones · mesas · racks · estanterías · muebles auxiliares · puffs · bancos",
      },
      {
        n: 3,
        categoria: "Ropa adulto",
        porDia: 6,
        ejemplos:
          "Camisas · pantalones · ropa deportiva · pijamas · ropa interior · abrigos · zapatos",
      },
      {
        n: 4,
        categoria: "Textiles y decoración",
        porDia: 5,
        ejemplos:
          "Cojines · cortinas · tapetes · manteles · caminos de mesa · adornos · cuadros",
      },
      {
        n: 5,
        categoria: "Artículos de cocina",
        porDia: 4,
        ejemplos:
          "Ollas · sartenes · sets de cubiertos · tablas · organizadores · recipientes · termos",
      },
      {
        n: 6,
        categoria: "Organización del hogar",
        porDia: 3,
        ejemplos:
          "Cajas organizadoras · cestos · perchas · organizadores de closet · porta objetos",
      },
      {
        n: 7,
        categoria: "Tecnología básica",
        porDia: 2,
        ejemplos:
          "Audífonos · cables · cargadores · parlantes pequeños · accesorios de celular",
      },
    ],
    plantillas: [
      {
        titulo: "Plantilla de texto para cada ficha",
        texto:
          "[NOMBRE DEL ARTÍCULO EN MAYÚSCULAS]\nLiquidación de marca · en perfecto estado\nPara [uso específico: tu cuarto / tu sala / tu cocina]\n📍 American Outlet Florencia · [dirección]\n⏰ [Horario]",
      },
    ],
    reglasFoto: [
      "Fondo limpio — sin cajas ni desorden detrás",
      "Luz natural si hay disponible",
      "Producto centrado, que se vea completo",
      "Ropa de cama: extendida o doblada mostrando el diseño",
      "Muebles: en su lugar con contexto limpio, persona sentada si es posible",
      "Ropa: colgada en percha o sobre superficie plana",
    ],
  },

  historias: {
    intro:
      "Estas tres historias son el alma de la cuenta. Son las que generan comentarios, shares, guardados y seguidores nuevos. No venden producto directamente — construyen confianza, entretenimiento y comunidad alrededor de la tienda.",
    items: [
      {
        numero: 1,
        titulo: "BTS (Detrás de cámara)",
        proposito:
          "La gente no confía en lo que no conoce. Cuando el cliente ve cómo llega la mercadería, cómo se acomoda, cómo es el equipo de trabajo por dentro — deja de ver la tienda como un lugar anónimo y empieza a verla como un lugar de personas reales. El BTS destruye la desconfianza del outlet mejor que cualquier post de producto. También humaniza la marca, genera cercanía con la comunidad de Florencia y le da al seguidor una razón para volver a ver las historias todos los días porque siente que está «adentro».",
        formatos: [
          {
            letra: "A",
            titulo: "Descarga de mercadería",
            descripcion:
              "Grabar la llegada o el acomodo de producto nuevo. Cámara en mano, sin edición forzada. Mostrar cajas, el proceso de organizar, los productos que van saliendo. Texto sobre video: «Llegó mercadería nueva — lo que entrá hoy, se puede ver mañana.» Duración: 15–30 segundos.",
          },
          {
            letra: "B",
            titulo: "El antes y después del estante",
            descripcion:
              "Grabar el estante desordenado → proceso de acomodo → estante listo y organizado. Texto sobre video: «Así dejamos la tienda lista para vos.» Duración: 20–30 segundos, puede ser timelapse.",
          },
          {
            letra: "C",
            titulo: "Unboxing de producto",
            descripcion:
              "Grabar la apertura de una caja de producto nuevo. Mostrar qué hay adentro con emoción genuina. Texto sobre video: «Mirá lo que entró hoy.» Duración: 15–25 segundos.",
          },
          {
            letra: "D",
            titulo: "La tienda antes de abrir",
            descripcion:
              "Grabar los últimos minutos antes de abrir. El equipo acomodando, la tienda lista. Texto sobre video: «Así se ve Florencia antes de las 8am.» Duración: 15 segundos.",
          },
        ],
        instruccion:
          "Una vez al día grabás algo de lo que pasa en la tienda que el cliente normalmente no ve. No tiene que ser perfecto. Tiene que ser real. Cámara en mano, sin trípode, sin script. Si llegó mercadería, lo grabás. Si estás acomodando, lo grabás. Si hay algo gracioso que pasó, lo grabás.",
      },
      {
        numero: 2,
        titulo: "PDV (Punto de venta en acción)",
        proposito:
          "El cliente de Florencia compra planificado, pero también compra por impulso cuando ve algo que le llama la atención. Esta historia lo trae virtualmente a la tienda antes de que llegue físicamente. Cuando el encargado o los compañeros hablan a cámara — con humor, con naturalidad, sin guión forzado — la cuenta deja de ser un catálogo y se convierte en una experiencia. Además, el contenido gracioso o espontáneo del equipo es el que más se comparte en zonas locales como Florencia, donde la comunidad es pequeña y todo se corre la voz.",
        formatos: [
          {
            letra: "A",
            titulo: "El encargado recomienda",
            descripcion:
              "15–20 segundos. El encargado o una persona del equipo frente a un producto, hablando directo a cámara: «Este edredón llegó esta semana y ya van tres personas que lo preguntan. Te cuento por qué...» No tiene que ser perfecto. Entre más natural, mejor.",
          },
          {
            letra: "B",
            titulo: "«¿Sabías que...?» — dato de producto",
            descripcion:
              "15 segundos. Encargado o compañero frente a producto, dice un dato que sorprenda: «¿Sabías que este juego de sábanas es de [marca]? Lo encontrás aquí porque la marca liquidó su stock — el producto está nuevo.»",
          },
          {
            letra: "C",
            titulo: "El reto del producto",
            descripcion:
              "Formato gracioso. Alguien del equipo trata de doblar un edredón, o armar un mueble, o hacer algo con el producto que resulta cómico o sorprendente. Texto sobre video: «Intentamos doblar esto en 30 segundos...» Este tipo de video genera comentarios y respuestas — es el que más alcance orgánico tiene.",
          },
          {
            letra: "D",
            titulo: "«Lo más raro que llegó esta semana»",
            descripcion:
              "El encargado muestra el producto más inesperado o llamativo que entró esa semana, con reacción genuina. «Esto llegó y no lo esperábamos — pero se va a ir rápido.»",
          },
          {
            letra: "E",
            titulo: "Mini-tour del día",
            descripcion:
              "20–30 segundos recorriendo la tienda mostrando lo más destacado del día. «Hoy en tienda: esto, esto y esto. Todo disponible.» Sin guión, cámara en mano, espontáneo.",
          },
        ],
        instruccion:
          "Una vez al día alguien del equipo graba algo frente a cámara. Puede ser una recomendación, un chiste, una reacción, un mini-tour. No tiene que ensayarse. De hecho, entre más espontáneo y gracioso mejor. El objetivo es que la gente de Florencia reconozca a las personas de la tienda y les tenga confianza.",
      },
      {
        numero: 3,
        titulo: "Cliente / Encuesta / Storytelling",
        proposito:
          "Esta es la historia que convierte seguidores en comunidad. Cuando un cliente aparece contento con su compra, le dice a todos sus conocidos «mirá, yo compré ahí». Cuando hay una encuesta, el algoritmo la impulsa porque genera respuestas. Cuando hay una historia con contexto — «¿por qué los precios son así de bajos?» — el cliente entiende el modelo y deja de dudar. En una zona como Florencia, donde la recomendación de boca en boca es el canal más fuerte, tener al cliente en el contenido es lo más valioso que puede hacer la tienda.",
        formatos: [
          {
            letra: "A",
            titulo: "Video de cliente satisfecho",
            descripcion:
              "Pedirle al cliente que acaba de comprar que grabe 10–15 segundos mostrando su producto o diciendo qué compró. No tiene que ser una reseña formal. Puede ser solo: «Mirá lo que me llevé hoy de American Outlet Florencia.» La tienda lo comparte con permiso del cliente. Texto sobre video: «Otro cliente que se fue contento 🙌»",
          },
          {
            letra: "B",
            titulo: "Encuesta de producto",
            descripcion:
              "Una pregunta simple sobre producto o preferencia: «¿Cuál preferís para tu cuarto?» → Opción A: foto de edredón azul / Opción B: foto de edredón gris. «¿Sillón o silla para tu sala?» → Con foto de cada uno disponible en tienda. Esto genera interacción, y los resultados se pueden usar para decidir qué publicar más.",
          },
          {
            letra: "C",
            titulo: "Encuesta educativa",
            descripcion:
              "Pregunta que rompe el mito del outlet: «¿Creés que outlet significa producto con defecto?» 👆 Sí, siempre lo pensé / 👇 No, sé que es liquidación de marca. Después del voto, mostrar la respuesta correcta con la explicación.",
          },
          {
            letra: "D",
            titulo: "Storytelling: ¿de dónde viene este producto?",
            descripcion:
              "Historia en 3 slides explicando el modelo outlet. Slide 1: «¿Por qué los precios son así de bajos en American Outlet?» Slide 2: «Las marcas grandes producen más de lo que venden en sus tiendas principales. Ese exceso se llama liquidación de stock.» Slide 3: «Nosotros compramos ese stock. El producto está nuevo, en perfecto estado. La diferencia es el precio. Eso es un outlet.»",
          },
          {
            letra: "E",
            titulo: "Repost de cliente",
            descripcion:
              "Si un cliente etiqueta la tienda en una historia o post, repostearlo con un mensaje de agradecimiento. «Gracias [nombre] por la confianza 🙌 — American Outlet Florencia.»",
          },
        ],
        instruccion:
          "Una vez al día publicás una historia que involucre al cliente o genere interacción. Si hubo un cliente que compró algo bonito, le pedís permiso y grabás. Si no hay cliente disponible, usás una encuesta de producto o una historia educativa. El objetivo es que la gente sienta que esta cuenta es de Florencia, para Florencia.",
      },
    ],
  },

  checklist: [
    "¿Ya le dije a la persona de contenido cuáles son los 35 productos del día?",
    "¿Los productos están organizados por categoría?",
    "¿Ya acordamos cuál es el BTS del día?",
    "¿Ya acordamos cuál es el PDV del día?",
    "¿Hay algún cliente disponible para grabar hoy, o usamos encuesta?",
    "¿Hay algún producto nuevo que entró esta semana que destacar?",
    "¿Hay alguna fecha especial esta semana que cambiar el foco?",
  ],

  focoSemanal: [
    {
      dia: "Lunes",
      focoFichas: "Ropa de cama + mueblería (foco apertura de semana)",
      bts: "Llegada o acomodo de mercadería nueva",
      pdv: "Mini-tour de lo más destacado de la semana",
      cliente: "Encuesta: preferencia de producto",
    },
    {
      dia: "Martes",
      focoFichas: "Textiles + decoración + organización",
      bts: "Antes/después de un estante",
      pdv: "Encargado recomienda producto",
      cliente: "Historia educativa: outlet no es dañado",
    },
    {
      dia: "Miércoles",
      focoFichas: "Ropa adulto + tecnología",
      bts: "Unboxing de producto nuevo",
      pdv: "Reto del producto (gracioso)",
      cliente: "Video de cliente satisfecho",
    },
    {
      dia: "Jueves",
      focoFichas: "Artículos de cocina + mueblería",
      bts: "La tienda antes de abrir",
      pdv: "«Lo más raro que llegó esta semana»",
      cliente: "Encuesta educativa",
    },
    {
      dia: "Viernes",
      focoFichas: "Ropa de cama (foco fin de semana) + mueblería",
      bts: "BTS preparación del fin de semana",
      pdv: "Encargado recomienda el producto del finde",
      cliente: "Repost de cliente o storytelling",
    },
    {
      dia: "Sábado",
      focoFichas: "Todos los productos con más urgencia",
      bts: "Tienda en movimiento (gente comprando, si hay permiso)",
      pdv: "Mini-tour especial de sábado",
      cliente: "Video de cliente del día",
    },
    {
      dia: "Domingo",
      focoFichas: "Los que queden disponibles",
      bts: "BTS cierre de semana",
      pdv: "Dato gracioso o inesperado del equipo",
      cliente: "Encuesta de la semana próxima",
    },
  ],

  temporadas: [
    {
      temporada: "Enero",
      meses: "Enero",
      foco: "Foco en renovación de hogar · «propósito de año nuevo: renovar tu cuarto»",
    },
    {
      temporada: "Marzo–abril (Semana Santa)",
      meses: "Mar · Abr",
      foco: "Cuarto de huéspedes · «preparate para las visitas»",
    },
    {
      temporada: "Junio–agosto (frío)",
      meses: "Jun · Jul · Ago",
      foco: "Edredones y cobertores protagonistas · temporada más fuerte del año para ropa de cama",
    },
    {
      temporada: "Noviembre–diciembre",
      meses: "Nov · Dic",
      foco: "Decoración navideña · edredones · liquidación de fin de año · regalo de hogar",
    },
  ],

  fechasEspeciales: [
    {
      fecha: "Enero",
      cambio:
        "Foco en renovación de hogar · «propósito de año nuevo: renovar tu cuarto»",
    },
    {
      fecha: "Marzo–abril (Semana Santa)",
      cambio: "Cuarto de huéspedes · «preparate para las visitas»",
    },
    {
      fecha: "Junio–agosto (frío)",
      cambio:
        "Edredones y cobertores protagonistas · temporada más fuerte del año para ropa de cama",
    },
    {
      fecha: "Día del Padre (21 jun)",
      cambio: "Silla / sillón / artículo de hogar como regalo para papá",
    },
    {
      fecha: "Día de la Madre (15 ago)",
      cambio: "Ropa de cama y textiles como regalo",
    },
    {
      fecha: "Noviembre–diciembre",
      cambio:
        "Decoración navideña · edredones · liquidación de fin de año · regalo de hogar",
    },
  ],

  porQueFunciona: [
    "Las 35 fichas de producto diarias crean presencia constante. El cliente ve la tienda en sus stories todos los días — no tiene que recordar ir, porque la tienda ya está en su cabeza. Cuando tiene la necesidad, ya sabe a dónde ir.",
    "Las 3 historias interactivas hacen algo que las fichas de producto no pueden hacer solas: construyen confianza. En Florencia, donde la comunidad es pequeña y la recomendación personal es el motor de compra más fuerte, ver al equipo real, ver a clientes reales y entender el modelo del outlet es lo que convierte a un seguidor en comprador, y a un comprador en alguien que recomienda.",
    "La combinación de ambos bloques crea una cuenta que vende todos los días y que la gente quiere seguir porque le da contenido que le sirve, le divierte y le genera confianza. No es un catálogo de productos. Es la tienda de su comunidad.",
  ],
};
