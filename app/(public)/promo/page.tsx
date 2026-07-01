import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { getPromoActiva } from "@/lib/panel/promos";
import { CuponTicket } from "@/components/promo/CuponTicket";
import { PromoView } from "@/components/analytics/PromoView";
import { PromoForm } from "./PromoForm";

export const metadata: Metadata = {
  title: "Cupón 10% OFF en muebles",
  description:
    "Renová tu espacio: registrate gratis y llevate tu cupón de 10% OFF en muebles. Mostralo en cualquiera de nuestras tiendas de American Outlet.",
};

export const revalidate = 300;

const pasos = [
  { icon: "chat", t: "Dejá tus datos", d: "Nombre, correo y WhatsApp. Toma 10 segundos." },
  { icon: "tag", t: "Recibí tu cupón", d: "Al instante, con tu código único de 10% OFF en muebles." },
  { icon: "store", t: "Usalo en tienda", d: "Descargalo o tomale captura y mostralo en tu compra." },
];

export default async function PromoPage() {
  const promo = await getPromoActiva();
  const titulo = promo?.titulo || "Renová tu espacio";
  const subtitulo =
    promo?.subtitulo ||
    "Liquidación de muebles para tu casa o tu Airbnb. Registrate gratis y llevate tu cupón de 10% para usar en cualquiera de nuestras tiendas.";

  return (
    <>
      <PromoView promoNombre="promo_cupon" promoOrigen="banner-julio-2026" />
      {/* Hero con la misma imagen de la promo */}
      <section className="relative isolate flex min-h-[60vh] items-center overflow-hidden pt-28 pb-16 sm:min-h-[64vh] sm:pt-32">
        {promo?.imagen_url ? (
          <Image src={promo.imagen_url} alt={titulo} fill priority sizes="100vw" className="-z-10 object-cover object-center" />
        ) : (
          <div className="absolute inset-0 -z-10 bg-[var(--color-azul-900)]" />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[var(--color-azul-900)]/90 via-[var(--color-azul-900)]/55 to-transparent" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--color-azul-900)]/70 via-transparent to-[var(--color-azul-900)]/30" />

        <Container className="relative">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-rojo)]" />
              Promo del mes · Muebles y hogar
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl">
              {titulo}
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
              {subtitulo}
            </p>
          </div>
        </Container>
      </section>

      {/* Cómo funciona + ejemplo + formulario */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Izquierda: cómo funciona + ejemplo de cupón */}
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--color-tinta)] sm:text-3xl">
                Cómo funciona
              </h2>
              <ol className="mt-6 space-y-5">
                {pasos.map((p, i) => (
                  <li key={p.t} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-azul-900)] text-white">
                      <Icon name={p.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-tinta)]">
                        {i + 1}. {p.t}
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-[var(--color-tinta-suave)]">
                        {p.d}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="mb-3 mt-10 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-tinta-tenue)]">
                Así se ve tu cupón
              </p>
              <CuponTicket nombre="Tu Nombre" codigo="CASA-XXXX" ejemplo porcentaje={10} etiqueta="en muebles" />
            </div>

            {/* Derecha: formulario */}
            <div className="lg:sticky lg:top-28">
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--color-tinta)] sm:text-3xl">
                Obtené tu cupón
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-tinta-suave)]">
                Llená tus datos y te lo generamos al instante.
              </p>
              <div className="mt-5">
                <PromoForm />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
