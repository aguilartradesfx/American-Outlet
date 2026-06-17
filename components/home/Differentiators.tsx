import { Container, SectionHeading } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";

const features = [
  { icon: "store", title: "Tiendas físicas", text: "Vení, tocá y llevá hoy" },
  { icon: "tag", title: "Precios de outlet", text: "Hasta -70% vs. precio de tienda" },
  { icon: "refresh", title: "Nuevo cada día", text: "Novedades de EE.UU. a diario" },
];

export function Differentiators() {
  return (
    <section className="py-12 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Por qué American Outlet"
          title={<>No somos un liquidador más.</>}
        />

        <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[210px]">
          {/* Tile destacado — años de respaldo (stat grande, gradiente de marca) */}
          <Reveal className="sm:col-span-2 lg:col-span-1 lg:row-span-2">
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-azul)] to-[var(--color-azul-900)] p-7 text-white lift">
              <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-[var(--color-rojo)]/30 blur-3xl transition-transform duration-700 group-hover:scale-125" />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <Icon name="pin" className="h-6 w-6" />
              </span>
              <div className="relative">
                <div className="text-5xl font-semibold leading-none tracking-[-0.04em] sm:text-6xl">
                  {site.anios}
                </div>
                <div className="mt-2 text-lg font-medium">años de respaldo local</div>
                <p className="mt-2 max-w-xs text-sm text-white/65">
                  Marca reconocida en Costa Rica, con centro de distribución propio.
                </p>
              </div>
            </div>
          </Reveal>

          {/* 3 tiles de valor — ícono grande, texto mínimo */}
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i + 1) * 90}>
              <div className="group flex h-full flex-col justify-between rounded-3xl glass glass-hairline p-6 lift">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-azul-900)] text-white transition-all duration-500 group-hover:scale-110 group-hover:bg-[var(--color-rojo)]">
                  <Icon name={f.icon} className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-tinta-suave)]">{f.text}</p>
                </div>
              </div>
            </Reveal>
          ))}

          {/* Tile stat — comunidad (acento rojo de marca) */}
          <Reveal delay={360}>
            <div className="group flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-[var(--color-rojo)] p-6 text-white lift">
              <Icon name="sparkle" className="h-6 w-6 transition-transform duration-500 group-hover:scale-110" />
              <div>
                <div className="text-4xl font-semibold tracking-[-0.03em]">
                  {site.seguidores}
                </div>
                <div className="mt-1 text-sm text-white/85">nos siguen en redes</div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
