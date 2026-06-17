/**
 * Líneas de producto (descubrimiento, no catálogo transaccional).
 * Cada categoría enlaza al e-commerce o invita a escribir por WhatsApp.
 * ⚠️  MOCK: ajustar líneas y descripciones al surtido real.
 */

export type Category = {
  slug: string;
  nombre: string;
  descripcion: string;
  /** nombre del ícono en components/ui/Icon.tsx */
  icono: string;
};

export const categories: Category[] = [
  {
    slug: "tecnologia",
    nombre: "Tecnología",
    descripcion: "Celulares, audio, accesorios y gadgets de marcas reconocidas.",
    icono: "tech",
  },
  {
    slug: "electrodomesticos",
    nombre: "Electrodomésticos",
    descripcion: "Cocina, línea blanca y pequeños electrodomésticos para el hogar.",
    icono: "appliance",
  },
  {
    slug: "hogar",
    nombre: "Hogar",
    descripcion: "Decoración, organización, textiles y todo para tu espacio.",
    icono: "home",
  },
  {
    slug: "ropa",
    nombre: "Ropa",
    descripcion: "Moda para toda la familia, de temporada y marcas americanas.",
    icono: "shirt",
  },
  {
    slug: "calzado",
    nombre: "Calzado",
    descripcion: "Tenis, casual y deportivo para grandes y chicos.",
    icono: "shoe",
  },
  {
    slug: "juguetes",
    nombre: "Juguetes",
    descripcion: "Juguetería de marca, didácticos y novedades para los peques.",
    icono: "toy",
  },
  {
    slug: "bebe",
    nombre: "Bebé",
    descripcion: "Artículos, cuidado y accesorios para los más pequeños.",
    icono: "baby",
  },
  {
    slug: "deporte",
    nombre: "Deporte",
    descripcion: "Equipo, ropa deportiva y artículos para vida activa.",
    icono: "sport",
  },
];
