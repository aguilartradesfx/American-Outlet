import type { Metadata } from "next";
import { Container, JsonLd } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { breadcrumbSchema } from "@/lib/schema";
import { site, waLink } from "@/content/site";

export const metadata: Metadata = {
  title: "Cómo comprar — Pedidos por WhatsApp y envíos a todo el país",
  description:
    "Comprar en American Outlet es fácil: escribinos por WhatsApp, apartá tu producto y retiralo en tienda o recibilo con envío a todo Costa Rica.",
  alternates: { canonical: "/como-comprar" },
};

const steps = [
  {
    icon: "chat",
    title: "Escribinos por WhatsApp",
    text: "Contanos qué estás buscando. Te enviamos fotos reales, precios y disponibilidad del día. Sin compromiso.",
  },
  {
    icon: "tag",
    title: "Elegí y apartá",
    text: "Confirmás el producto y lo apartamos a tu nombre. Te explicamos las opciones de pago disponibles.",
  },
  {
    icon: "shield",
    title: "Pagá con confianza",
    text: "Coordinamos el pago de forma segura, sin sorpresas ni costos ocultos.",
  },
  {
    icon: "truck",
    title: "Retirá o recibí",
    text: "Pasá por la tienda más cercana o coordinamos el envío a cualquier parte de Costa Rica.",
  },
];

const faqs = [
  {
    q: "¿Realmente venden por WhatsApp?",
    a: "Sí. WhatsApp es nuestro canal principal de atención y ventas. Así te damos un trato cercano, te mostramos el producto real y resolvemos tus dudas al instante.",
  },
  {
    q: "¿Hacen envíos a todo el país?",
    a: "Sí, coordinamos envíos a todo Costa Rica. Los tiempos y el costo dependen de tu ubicación; te lo confirmamos al momento de tu pedido.",
  },
  {
    q: "¿Puedo ver los productos antes de comprar?",
    a: "Claro. Podés visitar cualquiera de nuestras tiendas físicas en San Carlos (Ciudad Quesada, Florencia y La Fortuna) y escoger en persona.",
  },
  {
    q: "¿La tienda en línea tiene los mismos productos?",
    a: `Nuestra tienda en línea (${site.ecommerce.url.replace("https://www.", "")}) maneja un surtido independiente al de las tiendas físicas. Para lo que ves en tienda, lo mejor es escribirnos por WhatsApp.`,
  },
];

export default function ComoComprarPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: "/" },
          { name: "Cómo comprar", url: "/como-comprar" },
        ])}
      />

      <PageHero
        eyebrow="Cómo comprar"
        title={<>Comprar es tan fácil como mandar un mensaje</>}
        intro="Te acompañamos en cada paso. Nuestro canal principal es WhatsApp: atención real, cercana y al momento, con envíos a todo el país."
        crumbs={[{ name: "Inicio", href: "/" }, { name: "Cómo comprar" }]}
      />

      <Container>
        {/* Pasos */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 90}>
              <div className="relative h-full rounded-3xl glass glass-hairline p-7">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-azul-900)] text-white">
                    <Icon name={step.icon} className="h-6 w-6" />
                  </span>
                  <span className="text-4xl font-semibold tracking-tighter text-[var(--color-niebla-2)]">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-tinta-suave)]">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Banda de envío / cobertura */}
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {[
            { icon: "truck", title: "Cobertura nacional", text: "Enviamos a todo Costa Rica coordinando por WhatsApp." },
            { icon: "tag", title: "Precios de outlet", text: "Hasta -70% frente al precio de tienda en marcas de EE.UU." },
            { icon: "refresh", title: "Novedades a diario", text: "Inventario nuevo todos los días directo de EE.UU." },
          ].map((b, i) => (
            <Reveal key={b.title} delay={i * 90}>
              <div className="flex h-full items-start gap-4 rounded-3xl glass-tinted p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/70 text-[var(--color-azul)]">
                  <Icon name={b.icon} className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-semibold text-[var(--color-tinta)]">{b.title}</h3>
                  <p className="mt-1 text-sm text-[var(--color-tinta-suave)]">{b.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--color-tinta)] sm:text-3xl">
            Preguntas frecuentes
          </h2>
          <div className="mt-8 space-y-3">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <details className="group rounded-2xl glass glass-hairline p-5 [&_summary]:cursor-pointer">
                  <summary className="flex items-center justify-between gap-4 text-base font-medium text-[var(--color-tinta)] marker:content-['']">
                    {f.q}
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-niebla-2)] text-[var(--color-azul)] transition-transform duration-300 group-open:rotate-45">
                      <span className="text-lg leading-none">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-tinta-suave)]">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-center gap-5 rounded-3xl bg-[var(--color-azul-900)] p-10 text-center">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl">
            ¿Listo para tu próxima compra?
          </h2>
          <p className="max-w-md text-sm text-white/70">
            Escribinos ahora y te mostramos lo que tenemos disponible hoy.
          </p>
          <Button href={waLink()} variant="whatsapp" icon="whatsapp" external>
            Comprar por WhatsApp
          </Button>
        </div>
      </Container>
    </>
  );
}
