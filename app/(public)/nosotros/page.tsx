import type { Metadata } from "next";
import { Container, JsonLd } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { breadcrumbSchema } from "@/lib/schema";
import { site, waLink } from "@/content/site";

export const metadata: Metadata = {
  title: "Nosotros — 15+ años trayendo lo mejor de EE.UU. a Costa Rica",
  description:
    "Conocé American Outlet: más de 15 años importando saldos y liquidaciones de las grandes tiendas departamentales de EE.UU., con centro de distribución propio en San Carlos y respaldo local.",
  alternates: { canonical: "/nosotros" },
};

const proceso = [
  {
    icon: "store",
    title: "Origen en EE.UU.",
    text: "Compramos saldos, devoluciones, sobreinventario y cambios de temporada directo de las grandes tiendas departamentales de Estados Unidos.",
  },
  {
    icon: "truck",
    title: "Nuestro CEDI",
    text: "Todo pasa por nuestro centro de distribución en Ciudad Quesada, donde clasificamos y preparamos la mercadería con estándares de calidad.",
  },
  {
    icon: "refresh",
    title: "A tienda, a diario",
    text: "Distribuimos a nuestras tiendas físicas y listamos inventario nuevo todos los días, para que siempre encuentres algo distinto.",
  },
];

const valores = [
  { icon: "shield", title: "Confianza", text: "Transparencia y respaldo local en cada compra." },
  { icon: "pin", title: "Cercanía", text: "Atención humana y local, no un call center lejano." },
  { icon: "tag", title: "Precio justo", text: "Acceso real a marcas americanas a precio de outlet." },
  { icon: "sparkle", title: "Novedad", text: "Inventario fresco y dinámico, semana a semana." },
];

export default function NosotrosPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: "/" },
          { name: "Nosotros", url: "/nosotros" },
        ])}
      />

      <PageHero
        eyebrow="Nuestra historia"
        title={<>Más de {site.anios} años acercando lo mejor de EE.UU. a tu zona</>}
        intro="American Outlet nació para que los costarricenses tengan acceso real a productos de las grandes tiendas departamentales de Estados Unidos, sin pagar de más y con el respaldo de una marca local."
        crumbs={[{ name: "Inicio", href: "/" }, { name: "Nosotros" }]}
      />

      <Container>
        {/* Métricas */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { n: site.anios, l: "años de trayectoria" },
            { n: site.seguidores, l: "seguidores en redes" },
            { n: "3", l: "tiendas físicas en San Carlos" },
          ].map((m, i) => (
            <Reveal key={m.l} delay={i * 90}>
              <div className="rounded-3xl glass glass-hairline p-7 text-center">
                <div className="text-4xl font-semibold tracking-[-0.03em] text-gradient-brand">
                  {m.n}
                </div>
                <div className="mt-2 text-sm text-[var(--color-tinta-suave)]">{m.l}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Proceso de importación */}
        <div className="mt-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="divider-brand" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-azul)]">
                Modelo de importación
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--color-tinta)]">
              De las tiendas de EE.UU. a tus manos
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {proceso.map((p, i) => (
              <Reveal key={p.title} delay={i * 110}>
                <div className="relative h-full rounded-3xl glass glass-hairline p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-azul-900)] text-white">
                    <Icon name={p.icon} className="h-6 w-6" />
                  </span>
                  <span className="absolute right-6 top-6 text-xs font-semibold text-[var(--color-tinta-tenue)]">
                    Paso {i + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-tinta-suave)]">
                    {p.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* CEDI destacado */}
        <Reveal>
          <div className="mt-12 overflow-hidden rounded-3xl glass-tinted p-8 sm:p-10">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-[var(--color-azul)]">
                  <Icon name="pin" className="h-4 w-4" />
                  San Carlos, Alajuela
                </span>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
                  Nuestro centro de distribución
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-tinta-suave)]">
                  Desde {site.cedi.direccion}, abastecemos a todas nuestras tiendas. Tener el CEDI
                  propio nos permite controlar la calidad, mover inventario rápido y ofrecer
                  disponibilidad inmediata dentro del país.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {valores.map((v) => (
                  <div key={v.title} className="rounded-2xl bg-white/60 p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-azul-900)] text-white">
                      <Icon name={v.icon} className="h-5 w-5" />
                    </span>
                    <h4 className="mt-3 text-sm font-semibold text-[var(--color-tinta)]">
                      {v.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--color-tinta-tenue)]">
                      {v.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-center gap-5 text-center">
          <h2 className="max-w-xl text-2xl font-semibold tracking-[-0.02em] text-[var(--color-tinta)] sm:text-3xl">
            Una marca de confianza, hecha en Costa Rica
          </h2>
          <p className="max-w-md text-sm text-[var(--color-tinta-suave)]">
            Visitanos en cualquiera de nuestras tiendas o escribinos por WhatsApp. Con gusto te
            atendemos.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/tiendas" variant="primary" icon="store">
              Ver nuestras tiendas
            </Button>
            <Button href={waLink()} variant="whatsapp" icon="whatsapp" external>
              Escríbenos
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
