import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container, JsonLd } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { stores, getStore } from "@/content/stores";
import { storeSchema, breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return stores.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = getStore(slug);
  if (!store) return {};
  return {
    title: store.metaTitle,
    description: store.metaDescription,
    alternates: { canonical: `/tiendas/${store.slug}` },
    openGraph: {
      title: store.metaTitle,
      description: store.metaDescription,
      type: "website",
    },
  };
}

export default async function StoreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = getStore(slug);
  if (!store) notFound();

  const waStore = `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
    `¡Hola! Quiero información sobre la tienda de ${store.zona.split(",")[0]}. 🛍️`
  )}`;

  return (
    <>
      <JsonLd data={storeSchema(store)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: "/" },
          { name: "Tiendas", url: "/tiendas" },
          { name: store.zona.split(",")[0], url: `/tiendas/${store.slug}` },
        ])}
      />

      <PageHero
        eyebrow={`${store.canton}, ${store.provincia}`}
        title={store.nombre}
        intro={store.intro}
        crumbs={[
          { name: "Inicio", href: "/" },
          { name: "Tiendas", href: "/tiendas" },
          { name: store.zona.split(",")[0] },
        ]}
      />

      <Container>
        {/* Destacados */}
        <div className="flex flex-wrap gap-2">
          {store.destacados.map((d) => (
            <span
              key={d}
              className="inline-flex items-center gap-1.5 rounded-full glass px-3.5 py-1.5 text-xs font-medium text-[var(--color-tinta-suave)]"
            >
              <Icon name="check" className="h-3.5 w-3.5 text-[var(--color-rojo)]" />
              {d}
            </span>
          ))}
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-12">
          {/* Información */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="rounded-3xl glass glass-hairline p-7">
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
                  Información de la tienda
                </h2>

                <dl className="mt-6 space-y-5">
                  <InfoRow icon="pin" label="Dirección">
                    {store.direccion}
                  </InfoRow>
                  <InfoRow icon="clock" label="Horario">
                    <ul className="space-y-1">
                      {store.horario.map((h) => (
                        <li key={h.dias} className="flex justify-between gap-4">
                          <span>{h.dias}</span>
                          <span className="font-medium text-[var(--color-tinta)]">{h.horas}</span>
                        </li>
                      ))}
                    </ul>
                  </InfoRow>
                  <InfoRow icon="chat" label="Teléfono / WhatsApp">
                    <a href={waStore} target="_blank" rel="noopener noreferrer" className="hover:text-[#1fae54]">
                      {store.telefono}
                    </a>
                  </InfoRow>
                  <InfoRow icon="store" label="Cómo llegar">
                    {store.comoLlegar}
                  </InfoRow>
                </dl>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Button href={waStore} variant="whatsapp" icon="whatsapp" external>
                    Escribir a esta tienda
                  </Button>
                  <Button href={store.mapsUrl} variant="outline" icon="pin" external>
                    Ver en el mapa
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Foto de la tienda — abre la ubicación en Google Maps */}
          <div className="lg:col-span-5">
            <Reveal delay={120}>
              <a
                href={store.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block h-full min-h-[18rem] overflow-hidden rounded-3xl glass-hairline"
                aria-label="Abrir ubicación en Google Maps"
              >
                <Image
                  src={store.imagen}
                  alt={`Fachada de ${store.nombre}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center">
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-rojo)] text-white shadow-[0_12px_30px_-8px_rgba(223,14,11,0.7)] transition-transform duration-500 group-hover:-translate-y-1">
                    <Icon name="pin" className="h-7 w-7" />
                  </span>
                  <span className="mt-4 rounded-full glass px-4 py-1.5 text-xs font-medium text-white">
                    Abrir en Google Maps
                  </span>
                </div>
              </a>
            </Reveal>
          </div>
        </div>

        {/* Otras tiendas */}
        <div className="mt-16">
          <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
            Otras tiendas
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {stores
              .filter((s) => s.slug !== store.slug)
              .map((s) => (
                <a
                  key={s.slug}
                  href={`/tiendas/${s.slug}`}
                  className="group flex items-center justify-between rounded-2xl glass glass-hairline p-5 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-niebla-2)] text-[var(--color-azul)]">
                      <Icon name="pin" className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-medium text-[var(--color-tinta)]">
                        {s.zona.split(",")[0]}
                      </div>
                      <div className="text-xs text-[var(--color-tinta-tenue)]">
                        {s.canton}, {s.provincia}
                      </div>
                    </div>
                  </div>
                  <Icon
                    name="arrow"
                    className="h-5 w-5 text-[var(--color-azul)] transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>
              ))}
          </div>
        </div>
      </Container>
    </>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-niebla-2)] text-[var(--color-azul)]">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
          {label}
        </dt>
        <dd className="mt-1 text-sm leading-relaxed text-[var(--color-tinta-suave)]">{children}</dd>
      </div>
    </div>
  );
}
