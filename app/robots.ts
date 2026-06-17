import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Área interna autenticada — fuera del índice y de los crawlers.
      disallow: "/panel",
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
