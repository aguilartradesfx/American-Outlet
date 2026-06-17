import { v2 as cloudinary } from "cloudinary";

// Configuración server-side de Cloudinary.
// Lee de CLOUDINARY_URL si está presente; si no, de las variables sueltas.
// NUNCA importar este módulo desde un Client Component (expone el api_secret).
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/** Cloud name público para construir URLs en el cliente / next-cloudinary. */
export const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
