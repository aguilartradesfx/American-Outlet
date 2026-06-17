/**
 * Helpers de datos estructurados (schema.org / JSON-LD).
 * Organization, Store/LocalBusiness y BreadcrumbList.
 */
import { site } from "@/content/site";
import type { Store } from "@/content/stores";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.nombre,
    url: site.url,
    slogan: site.tagline,
    description: site.descripcion,
    // ⚠️ Pendiente confirmar la sociedad legal que respalda la marca retail.
    foundingDate: "2009",
    areaServed: { "@type": "Country", name: "Costa Rica" },
    sameAs: [site.redes.instagram, site.redes.facebook, site.redes.tiktok],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.whatsapp.display,
      contactType: "customer service",
      areaServed: "CR",
      availableLanguage: ["Spanish"],
    },
  };
}

export function storeSchema(store: Store) {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: store.nombre,
    description: store.metaDescription,
    url: `${site.url}/tiendas/${store.slug}`,
    telephone: store.telefono,
    image: `${site.url}/og/tiendas-${store.slug}.png`,
    parentOrganization: { "@type": "Organization", name: site.nombre, url: site.url },
    address: {
      "@type": "PostalAddress",
      streetAddress: store.direccion,
      addressLocality: store.canton,
      addressRegion: store.provincia,
      addressCountry: "CR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: store.geo.lat,
      longitude: store.geo.lng,
    },
    openingHoursSpecification: store.openingHoursSpec.map((o) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: o.dias.map((d) => dayName(d)),
      opens: o.abre,
      closes: o.cierra,
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.url}`,
    })),
  };
}

function dayName(abbr: string) {
  const map: Record<string, string> = {
    Mo: "Monday",
    Tu: "Tuesday",
    We: "Wednesday",
    Th: "Thursday",
    Fr: "Friday",
    Sa: "Saturday",
    Su: "Sunday",
  };
  return map[abbr] ?? abbr;
}
