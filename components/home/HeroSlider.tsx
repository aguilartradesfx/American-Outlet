"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Container";
import { site, waLink } from "@/content/site";
import { HeroBackground } from "./heroShared";
import type { Promo } from "@/lib/panel/promos";

const AUTOPLAY_MS = 6500;

/**
 * Hero en formato slider: cruza entre la imagen original del hero y la imagen
 * de la promo del mes. Si no hay promo activa, se comporta como un hero simple
 * (sin controles ni autoplay). El padding superior libera el header fijo.
 */
export function HeroSlider({ promo }: { promo: Promo | null }) {
  const hasPromo = Boolean(promo?.imagen_url);
  const total = hasPromo ? 2 : 1;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (i: number) => setIndex(((i % total) + total) % total),
    [total],
  );

  useEffect(() => {
    if (total < 2 || paused) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % total),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(id);
  }, [total, paused]);

  return (
    <section
      className="relative isolate min-h-[92vh] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide 1 — Hero original */}
      <Slide active={index === 0}>
        <HeroSlide />
      </Slide>

      {/* Slide 2 — Promo del mes */}
      {hasPromo && promo && (
        <Slide active={index === 1}>
          <PromoSlide promo={promo} />
        </Slide>
      )}

      {/* Controles */}
      {total > 1 && (
        <>
          <SliderArrow dir="prev" onClick={() => go(index - 1)} />
          <SliderArrow dir="next" onClick={() => go(index + 1)} />

          <div className="absolute inset-x-0 bottom-7 z-30 flex justify-center gap-2.5">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir al slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-7 bg-white"
                    : "w-2 bg-white/45 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

/** Capa con crossfade. Solo la activa recibe interacción. */
function Slide({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      aria-hidden={!active}
      className={`absolute inset-0 transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        active ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

function SliderArrow({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  const isPrev = dir === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Slide anterior" : "Slide siguiente"}
      className={`absolute top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 md:flex ${
        isPrev ? "left-5" : "right-5"
      }`}
    >
      <Icon name="arrow" className={`h-5 w-5 ${isPrev ? "rotate-180" : ""}`} />
    </button>
  );
}

/* ── Slide: Hero original ─────────────────────────────────────────────── */
function HeroSlide() {
  return (
    <div className="relative flex h-full w-full items-center pt-28 pb-16 sm:pt-36 sm:pb-24">
      <HeroBackground />

      <Container className="relative z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-rojo)] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-rojo)]" />
            </span>
            Inventario nuevo cada día · {site.seguidores} en redes
          </div>

          <h1 className="mt-5 text-[2.05rem] font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:mt-6 sm:text-6xl sm:leading-[1.02] lg:text-[4.3rem]">
            Lo mejor de Estados Unidos,{" "}
            <span className="bg-gradient-to-r from-white via-[#ffd9d8] to-[var(--color-rojo)] bg-clip-text text-transparent">
              te queda cerca.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:mt-6 sm:text-lg">
            Saldos de las grandes tiendas departamentales de EE.UU., con tiendas
            físicas e inventario nuevo cada día — aquí en Costa Rica.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href={waLink()} variant="whatsapp" icon="whatsapp" external>
              Comprar por WhatsApp
            </Button>
            <a
              href="/tiendas"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
            >
              Ver tiendas físicas
              <Icon
                name="arrow"
                className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {[
              { icon: "tag", n: "Hasta -70%", l: "vs. precio de tienda" },
              { icon: "store", n: "3 tiendas", l: "físicas en San Carlos" },
              { icon: "sparkle", n: `${site.anios} años`, l: "de trayectoria en CR" },
            ].map((s) => (
              <div
                key={s.l}
                className="group flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white">
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">{s.n}</div>
                  <div className="text-[11px] text-white/60">{s.l}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

/* ── Slide: Promo del mes ─────────────────────────────────────────────── */
function PromoSlide({ promo }: { promo: Promo }) {
  const alt = promo.titulo || "Promoción del mes — American Outlet";
  const cta = promo.cta_texto?.trim();
  const href = promo.enlace || "/promo";
  const esExterno = /^https?:\/\//i.test(href);

  return (
    <div className="relative flex h-full w-full items-center pt-32 pb-24 sm:pt-36">
      <Image
        src={promo.imagen_url!}
        alt={alt}
        fill
        sizes="100vw"
        className="-z-10 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[var(--color-azul-900)]/90 via-[var(--color-azul-900)]/55 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--color-azul-900)]/70 via-transparent to-[var(--color-azul-900)]/30" />

      <Container className="relative z-10">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-rojo)]" />
            Promo del mes · Muebles y hogar
          </span>

          <h2 className="mt-5 text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl sm:leading-[1.02]">
            {promo.titulo || "Promo del mes"}
          </h2>

          {promo.subtitulo && (
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
              {promo.subtitulo}
            </p>
          )}

          {cta && (
            <a
              href={href}
              target={esExterno ? "_blank" : undefined}
              rel={esExterno ? "noopener noreferrer" : undefined}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-rojo)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_34px_-12px_rgba(223,14,11,0.8)] transition-all duration-300 hover:-translate-y-0.5"
            >
              {cta}
              <Icon name="arrow" className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          )}
        </div>
      </Container>
    </div>
  );
}
