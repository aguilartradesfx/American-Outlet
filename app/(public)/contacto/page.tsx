import type { Metadata } from "next";
import { Container, JsonLd } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { breadcrumbSchema } from "@/lib/schema";
import { site, waLink } from "@/content/site";
import { stores } from "@/content/stores";

export const metadata: Metadata = {
  title: "Contacto — Escribinos por WhatsApp",
  description:
    "Contactá a American Outlet por WhatsApp, redes o visitá nuestras tiendas en San Carlos. Atención cercana, real y al momento. Centro de distribución en Ciudad Quesada.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: "/" },
          { name: "Contacto", url: "/contacto" },
        ])}
      />

      <PageHero
        eyebrow="Contacto"
        title={<>Hablemos. Estamos para ayudarte</>}
        intro="Nuestro canal principal es WhatsApp, pero también podés encontrarnos en redes o visitarnos en cualquiera de nuestras tiendas en San Carlos."
        crumbs={[{ name: "Inicio", href: "/" }, { name: "Contacto" }]}
      />

      <Container>
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Formulario */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="rounded-3xl glass-strong glass-hairline p-7 sm:p-9">
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
                  Escribinos
                </h2>
                <p className="mt-1.5 text-sm text-[var(--color-tinta-suave)]">
                  Completá tus datos y te respondemos al instante por WhatsApp.
                </p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Canales */}
          <div className="space-y-5 lg:col-span-5">
            <Reveal delay={100}>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-3xl bg-[#1fae54] p-6 text-white transition-all duration-300 hover:-translate-y-0.5"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                  <Icon name="whatsapp" className="h-6 w-6" />
                </span>
                <div>
                  <div className="text-sm text-white/80">WhatsApp (canal principal)</div>
                  <div className="text-lg font-semibold">{site.whatsapp.display}</div>
                </div>
                <Icon name="arrow" className="ml-auto h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Reveal>

            <Reveal delay={160}>
              <div className="rounded-3xl glass glass-hairline p-6">
                <h3 className="text-sm font-semibold text-[var(--color-tinta)]">Otros canales</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <a href={site.redes.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[var(--color-tinta-suave)] transition-colors hover:text-[var(--color-azul)]">
                      <Icon name="sparkle" className="h-5 w-5 text-[var(--color-rojo)]" />
                      @americanoutletcr
                    </a>
                  </li>
                  <li>
                    <a href={site.ecommerce.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[var(--color-tinta-suave)] transition-colors hover:text-[var(--color-azul)]">
                      <Icon name="tag" className="h-5 w-5 text-[var(--color-azul)]" />
                      Tienda en línea
                    </a>
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <div className="rounded-3xl glass glass-hairline p-6">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-tinta)]">
                  <Icon name="pin" className="h-4 w-4 text-[var(--color-azul)]" />
                  Oficinas
                </h3>
                <p className="mt-2 text-sm text-[var(--color-tinta-suave)]">{site.cedi.direccion}</p>
                <div className="mt-4 border-t border-[var(--color-borde)] pt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-tinta-tenue)]">
                    Tiendas
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {stores.map((s) => (
                      <li key={s.slug}>
                        <a href={`/tiendas/${s.slug}`} className="text-[var(--color-tinta-suave)] transition-colors hover:text-[var(--color-azul)]">
                          {s.zona.split(",")[0]} — {s.canton}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </>
  );
}
