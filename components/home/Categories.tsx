import { Container, SectionHeading } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { categories } from "@/content/categories";
import { site, waLink } from "@/content/site";

export function Categories() {
  return (
    <section className="py-12 sm:py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Categorías"
            title="Todo lo que buscás, a precio de outlet"
            intro="Desde tecnología hasta juguetes. Escribinos por WhatsApp para consultar disponibilidad y precios del día."
          />
          <Button href={waLink("¡Hola! Quiero saber qué tienen disponible hoy. 🛍️")} variant="outline" icon="whatsapp" external className="shrink-0">
            Consultar disponibilidad
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <Reveal key={cat.slug} delay={(i % 4) * 70}>
              <div className="group relative h-full overflow-hidden rounded-3xl glass glass-hairline p-6 lift">
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-[var(--color-azul)]/10 to-[var(--color-rojo)]/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-niebla-2)] text-[var(--color-azul)] transition-all duration-500 group-hover:bg-[var(--color-azul-900)] group-hover:text-white">
                  <Icon name={cat.icono} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-base font-semibold tracking-[-0.01em] text-[var(--color-tinta)]">
                  {cat.nombre}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-tinta-tenue)]">
                  {cat.descripcion}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-[var(--color-tinta-tenue)]">
          ¿Buscás comprar 100% en línea?{" "}
          <a
            href={site.ecommerce.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--color-azul)] hover:underline"
          >
            Visitá nuestra tienda en línea
          </a>{" "}
          <span className="text-[var(--color-tinta-tenue)]">(surtido independiente).</span>
        </p>
      </Container>
    </section>
  );
}
