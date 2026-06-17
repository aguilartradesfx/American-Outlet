import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { stores } from "@/content/stores";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const staticPages = ["", "/tiendas", "/como-comprar", "/nosotros", "/contacto"];

  const rutas: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const tiendas: MetadataRoute.Sitemap = stores.map((s) => ({
    url: `${base}/tiendas/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...rutas, ...tiendas];
}
