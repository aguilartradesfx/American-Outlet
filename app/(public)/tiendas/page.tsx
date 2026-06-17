import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/Container";
import { StoreCard } from "@/components/store/StoreCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { stores } from "@/content/stores";
import { breadcrumbSchema } from "@/lib/schema";
import { waLink } from "@/content/site";

export const metadata: Metadata = {
  title: "Tiendas en San Carlos — Ciudad Quesada, Florencia y La Fortuna",
  description:
    "Visitá American Outlet en San Carlos: tiendas físicas en Ciudad Quesada, Florencia y La Fortuna. Saldos y liquidaciones americanas con inventario nuevo a diario.",
  alternates: { canonical: "/tiendas" },
};

export default function TiendasPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: "/" },
          { name: "Tiendas", url: "/tiendas" },
        ])}
      />
      <PageHero
        eyebrow="Tiendas físicas"
        title={<>Nuestras tiendas en San&nbsp;Carlos</>}
        intro="Tres ubicaciones para que siempre tengás un American Outlet cerca. Llegá, escogé y llevate tu producto el mismo día, con la confianza de comprar en persona."
        crumbs={[{ name: "Inicio", href: "/" }, { name: "Tiendas" }]}
      />

      <section className="pb-10">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {stores.map((store, i) => (
              <Reveal key={store.slug} delay={i * 110}>
                <StoreCard store={store} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl glass glass-hairline p-8 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-azul-900)] text-white">
                <Icon name="whatsapp" className="h-7 w-7" />
              </span>
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
                  ¿No podés pasar a la tienda?
                </h2>
                <p className="mt-1 text-sm text-[var(--color-tinta-suave)]">
                  Escribinos por WhatsApp y coordinamos tu compra con envío a todo el país.
                </p>
              </div>
            </div>
            <Button href={waLink()} variant="whatsapp" icon="whatsapp" external className="shrink-0">
              Escríbenos
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
