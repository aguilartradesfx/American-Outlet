import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // El Estudio IA compone el logo oficial (public/brand/) sobre la imagen con
  // fs en runtime; hay que incluirlo en el bundle de la función.
  outputFileTracingIncludes: {
    "/panel/estudio": ["./public/brand/logo-poster.svg"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Banner de promo mensual (Supabase Storage, bucket público "promos").
      { protocol: "https", hostname: "jwdqifswocuaudqtlbyu.supabase.co" },
    ],
  },
  experimental: {
    // Server actions que reciben imágenes: el banner de promo y, sobre todo, el
    // Estudio IA, que manda la foto de referencia en base64 (~1.34× el archivo).
    // Con tope de subida de 10 MB el payload llega a ~13.5 MB, así que dejamos
    // holgura. Si esto se queda corto, el action se rechaza y la UI lo muestra.
    serverActions: { bodySizeLimit: "16mb" },
  },
  async rewrites() {
    return [
      // Brand book de Bralto: HTML autocontenido servido desde public/.
      // Ruta limpia /brand-book -> el archivo estático, sin exponer el .html.
      { source: "/brand-book", destination: "/brand-book.html" },
    ];
  },
};

export default nextConfig;
