import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import type { Promo } from "@/lib/panel/promos";

/**
 * Sección "Promos y descuentos" — va justo antes de las tiendas físicas.
 * Muestra la promo activa del mes como banner. Si no hay promo, no renderiza.
 */
export function PromoSection({ promo }: { promo: Promo | null }) {
  if (!promo?.imagen_url) return null;

  const cta = promo.cta_texto?.trim();
  const href = promo.enlace || "/promo";
  const esExterno = /^https?:\/\//i.test(href);
  const alt = promo.titulo || "Promoción del mes — American Outlet";

  return (
    <section className="py-12 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Promos y descuentos"
          title="La promo del mes"
          intro="Aprovechá los descuentos vigentes en nuestras tiendas físicas. Cada mes renovamos las ofertas para que estrenes pagando menos."
          center
        />

        <Reveal>
          <div className="relative isolate mt-12 flex min-h-[22rem] items-center overflow-hidden rounded-[2rem] sm:min-h-[26rem]">
            <Image
              src={promo.imagen_url}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="-z-10 object-cover object-center"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[var(--color-azul-900)]/90 via-[var(--color-azul-900)]/55 to-transparent" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--color-azul-900)]/60 via-transparent to-transparent" />

            <div className="px-7 py-10 sm:px-12">
              <div className="max-w-lg">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-rojo)]" />
                  Promo del mes
                </span>

                <h3 className="mt-5 text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl">
                  {promo.titulo || "Promo del mes"}
                </h3>

                {promo.subtitulo && (
                  <p className="mt-4 max-w-md text-base leading-relaxed text-white/85">
                    {promo.subtitulo}
                  </p>
                )}

                {cta && (
                  <a
                    href={href}
                    target={esExterno ? "_blank" : undefined}
                    rel={esExterno ? "noopener noreferrer" : undefined}
                    className="group mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--color-rojo)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_34px_-12px_rgba(223,14,11,0.8)] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {cta}
                    <Icon name="arrow" className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-0.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
