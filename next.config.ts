import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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
};

export default nextConfig;
