import { Container, SectionHeading } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

const steps = [
  {
    icon: "chat",
    title: "Escribinos",
    text: "Contanos qué buscás por WhatsApp. Te mostramos lo disponible hoy con fotos y precios reales.",
  },
  {
    icon: "tag",
    title: "Apartá tu producto",
    text: "Confirmás el artículo y coordinamos el pago. Sin filas ni complicaciones.",
  },
  {
    icon: "truck",
    title: "Retirá o recibí",
    text: "Pasá por la tienda más cercana o coordinamos el envío a cualquier parte del país.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-12 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Cómo comprar"
          title="Comprar es tan fácil como mandar un mensaje"
          intro="Nuestro canal principal es WhatsApp: atención cercana, real y al momento."
          center
        />

        <div className="relative mt-9 grid gap-5 sm:mt-14 md:grid-cols-3">
          {/* línea conectora */}
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-[var(--color-borde)] to-transparent md:block" />
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 120}>
              <div className="relative h-full rounded-3xl glass glass-hairline p-7 text-center">
                <div className="relative mx-auto flex h-14 w-14 items-center justify-center">
                  <span className="absolute inset-0 rounded-2xl bg-[var(--color-azul-900)]" />
                  <Icon name={step.icon} className="relative h-7 w-7 text-white" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-rojo)] text-[11px] font-bold text-white shadow-md">
                    {i + 1}
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

        <div className="mt-10 flex justify-center">
          <Button href="/como-comprar" variant="outline" icon="arrow" iconRight>
            Ver el proceso completo
          </Button>
        </div>
      </Container>
    </section>
  );
}
