import Image from "next/image";

/** Fondo del hero (subido a Cloudinary, entregado con f_auto,q_auto). */
export const HERO_BG =
  "https://res.cloudinary.com/dm4vljcnv/image/upload/f_auto,q_auto/american-outlet/home/hero-background.jpg";

/**
 * Capa de fondo compartida por ambas variantes del hero:
 * imagen a sangre + overlay oscuro para asegurar contraste del texto blanco.
 */
export function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <Image
        src={HERO_BG}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Overlay oscuro: degradado diagonal + base para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-azul-900)]/85 via-[var(--color-azul-900)]/65 to-black/75" />
      <div className="absolute inset-0 bg-[var(--color-azul-900)]/35" />
      {/* Tinte de marca sutil en las esquinas */}
      <div className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-[var(--color-azul)]/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-[var(--color-rojo)]/25 blur-[120px]" />
    </div>
  );
}
