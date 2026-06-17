import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { site, waLink } from "@/content/site";

export function CtaBand() {
  return (
    <section className="py-12 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-[var(--color-azul-900)] px-6 py-10 sm:rounded-[2.5rem] sm:px-14 sm:py-20">
          {/* acentos de marca */}
          <div className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-[var(--color-azul)]/40 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-[var(--color-rojo)]/30 blur-3xl" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
              <Icon name="sparkle" className="h-4 w-4 text-[var(--color-rojo)]" />
              {site.seguidores} ya nos siguen
            </span>
            <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-5xl">
              Encontrá tu próxima oferta hoy
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/70">
              Escribinos por WhatsApp y te mostramos lo que acaba de llegar. Atención cercana, precios
              reales y la confianza de comprar con una marca reconocida.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button href={waLink()} variant="whatsapp" icon="whatsapp" external>
                Escribir por WhatsApp
              </Button>
              <Button
                href={site.ecommerce.url}
                variant="ghost"
                icon="arrow"
                iconRight
                external
                className="bg-white/10 text-white hover:bg-white/20"
              >
                Comprar en línea
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
