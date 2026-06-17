import { Container, SectionHeading } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { StoreCard } from "@/components/store/StoreCard";
import { stores } from "@/content/stores";

export function StoresPreview() {
  return (
    <section className="py-12 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Tiendas físicas"
          title="Visitanos en San Carlos"
          intro="Tres tiendas pensadas para tu zona. Llegá, escogé y llevate tu producto el mismo día — con la confianza de comprar en persona."
          center
        />

        <div className="mt-8 grid gap-5 sm:mt-12 md:grid-cols-3">
          {stores.map((store, i) => (
            <Reveal key={store.slug} delay={i * 110}>
              <StoreCard store={store} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
