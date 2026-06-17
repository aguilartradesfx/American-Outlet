/**
 * Configuración global del sitio — editable sin tocar componentes.
 * ⚠️  MOCK: reemplazar teléfonos, redes y dominio con datos reales antes de producción.
 */

export const site = {
  nombre: "American Outlet",
  tagline: "El Outlet #1 de Costa Rica",
  descripcion:
    "Saldos y liquidaciones directos de las grandes tiendas departamentales de EE.UU., con tiendas físicas en San Carlos e inventario nuevo a diario.",
  // Dominio canónico (ajustar al definitivo)
  url: "https://www.americanoutlet.cr",
  // Canal de venta principal
  whatsapp: {
    // Formato internacional sin signos para el enlace wa.me
    // Mismo número que la tienda de Ciudad Quesada.
    numero: "50687361400",
    display: "+506 8736-1400",
    saludo:
      "¡Hola American Outlet! Vengo del sitio web y quiero más información sobre sus productos. 🛍️",
  },
  // Sin correo público por ahora (el buzón aún no existe).
  // E-commerce existente (mercadería distinta a la de tiendas físicas)
  ecommerce: {
    url: "https://www.aostores.com",
    nota: "Catálogo en línea independiente — la mercadería puede variar respecto a las tiendas físicas.",
  },
  redes: {
    instagram: "https://instagram.com/americanoutletcr", // MOCK
    facebook: "https://facebook.com/americanoutletcr", // MOCK
    tiktok: "https://tiktok.com/@americanoutletcr", // MOCK
  },
  // Oficinas administrativas (la dirección que mostramos en contacto/footer).
  cedi: {
    nombre: "Oficinas",
    direccion: "Barrio Los Ángeles, Ciudad Quesada, San Carlos, Alajuela",
    pais: "Costa Rica",
  },
  anios: "15+",
  seguidores: "200K+",
} as const;

export function waLink(mensaje?: string) {
  const texto = encodeURIComponent(mensaje ?? site.whatsapp.saludo);
  return `https://wa.me/${site.whatsapp.numero}?text=${texto}`;
}
