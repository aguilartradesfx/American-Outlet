/**
 * Tiendas físicas — fuente de verdad para el índice y las páginas de detalle.
 * Direcciones, teléfonos, WhatsApp, mapas e imágenes son datos REALES.
 * ⚠️  Pendiente de confirmar: horarios y coordenadas geo (siguen siendo de ejemplo).
 */

export type Store = {
  slug: string;
  nombre: string;
  canton: string;
  provincia: string;
  zona: string;
  /** Title/description únicos para SEO local */
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** Foto de la fachada (Cloudinary, con f_auto,q_auto) */
  imagen: string;
  direccion: string;
  /** Para LocalBusiness schema */
  geo: { lat: number; lng: number };
  telefono: string;
  whatsapp: string; // formato wa.me
  horario: { dias: string; horas: string }[];
  /** Resumen para schema openingHours, ej "Mo-Sa 09:00-19:00" */
  openingHoursSpec: { dias: string[]; abre: string; cierra: string }[];
  destacados: string[];
  comoLlegar: string;
  mapsUrl: string;
};

export const stores: Store[] = [
  {
    slug: "ciudad-quesada",
    nombre: "American Outlet Ciudad Quesada",
    canton: "San Carlos",
    provincia: "Alajuela",
    zona: "Centro de Ciudad Quesada",
    metaTitle: "Tienda American Outlet en Ciudad Quesada, San Carlos",
    metaDescription:
      "Outlet de saldos y liquidaciones americanas en el centro de Ciudad Quesada. Tecnología, hogar, ropa y más, con inventario nuevo a diario.",
    intro:
      "Nuestra tienda insignia, frente al Pali de Ciudad Quesada. Aquí encontrás el surtido más amplio y las novedades primero.",
    imagen:
      "https://res.cloudinary.com/dm4vljcnv/image/upload/f_auto,q_auto/american-outlet/home/hero-background.jpg",
    direccion: "Frente a Pali, Ciudad Quesada, San Carlos, Alajuela",
    geo: { lat: 10.3266, lng: -84.4271 },
    telefono: "+506 8736-1400",
    whatsapp: "50687361400",
    horario: [
      { dias: "Lunes a Sábado", horas: "9:00 a. m. – 7:00 p. m." },
      { dias: "Domingo", horas: "10:00 a. m. – 4:00 p. m." },
    ],
    openingHoursSpec: [
      { dias: ["Mo", "Tu", "We", "Th", "Fr", "Sa"], abre: "09:00", cierra: "19:00" },
      { dias: ["Su"], abre: "10:00", cierra: "16:00" },
    ],
    destacados: ["Tienda insignia", "El surtido más amplio", "Novedades primero"],
    comoLlegar:
      "Justo frente al Pali de Ciudad Quesada, en plena zona comercial y de fácil acceso.",
    mapsUrl: "https://share.google/HCmQPAt6k5Ahp6V29",
  },
  {
    slug: "florencia",
    nombre: "American Outlet Florencia",
    canton: "San Carlos",
    provincia: "Alajuela",
    zona: "Florencia, sobre la ruta principal",
    metaTitle: "Tienda American Outlet en Florencia, San Carlos",
    metaDescription:
      "Outlet americano en Florencia de San Carlos: electrodomésticos, hogar, calzado y tecnología a precio de liquidación, con respaldo local.",
    intro:
      "Contiguo al Pali de Florencia, pensada para quien viene de paso o de las comunidades vecinas. Ideal para electrodomésticos y artículos de hogar grandes con disponibilidad inmediata.",
    imagen:
      "https://res.cloudinary.com/dm4vljcnv/image/upload/f_auto,q_auto/american-outlet/tiendas/florencia.jpg",
    direccion: "Contiguo a Pali, Florencia, San Carlos, Alajuela",
    geo: { lat: 10.3597, lng: -84.4836 },
    telefono: "+506 8748-2594",
    whatsapp: "50687482594",
    horario: [
      { dias: "Lunes a Sábado", horas: "9:00 a. m. – 6:30 p. m." },
      { dias: "Domingo", horas: "Cerrado" },
    ],
    openingHoursSpec: [
      { dias: ["Mo", "Tu", "We", "Th", "Fr", "Sa"], abre: "09:00", cierra: "18:30" },
    ],
    destacados: ["Fácil acceso en carro", "Fuerte en electrodomésticos", "Parqueo amplio"],
    comoLlegar:
      "Contiguo al Pali de Florencia, sobre la vía principal y a pocos minutos del centro de Ciudad Quesada.",
    mapsUrl: "https://share.google/xlrjfnslvXXRSEVTO",
  },
  {
    slug: "fortuna",
    nombre: "American Outlet La Fortuna",
    canton: "San Carlos",
    provincia: "Alajuela",
    zona: "La Fortuna, zona turística del Arenal",
    metaTitle: "Tienda American Outlet en La Fortuna de San Carlos",
    metaDescription:
      "Outlet americano en La Fortuna, cerca del Arenal: ropa, calzado, tecnología y artículos para el hogar a precios de liquidación, con atención cercana.",
    intro:
      "En el corazón de La Fortuna, frente al BAC y cerca de la zona turística del Arenal. Pensada tanto para la comunidad local como para quienes visitan la zona y buscan buenos precios en marcas reconocidas.",
    imagen:
      "https://res.cloudinary.com/dm4vljcnv/image/upload/f_auto,q_auto/american-outlet/tiendas/fortuna.jpg",
    direccion: "Frente al BAC, La Fortuna, San Carlos, Alajuela",
    geo: { lat: 10.4707, lng: -84.6443 },
    telefono: "+506 6057-9717",
    whatsapp: "50660579717",
    horario: [
      { dias: "Lunes a Domingo", horas: "9:00 a. m. – 7:00 p. m." },
    ],
    openingHoursSpec: [
      { dias: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"], abre: "09:00", cierra: "19:00" },
    ],
    destacados: ["Abierto todos los días", "Zona turística del Arenal", "Marcas reconocidas"],
    comoLlegar:
      "Frente al BAC de La Fortuna, sobre una calle de fácil acceso peatonal y vehicular.",
    mapsUrl: "https://share.google/s7bFplGWIga9a0mMy",
  },
];

export function getStore(slug: string) {
  return stores.find((s) => s.slug === slug);
}
