"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { site, waLink } from "@/content/site";

const nav = [
  { href: "/tiendas", label: "Tiendas" },
  { href: "/como-comprar", label: "Cómo comprar" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Sobre un hero oscuro (home y /promo) y antes de hacer scroll: versión clara.
  const overHero = (pathname === "/" || pathname === "/promo") && !scrolled && !open;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-5 ${
          scrolled ? "glass-strong glass-hairline mx-3 sm:mx-auto" : "bg-transparent"
        }`}
        style={{ marginLeft: scrolled ? undefined : "auto", marginRight: scrolled ? undefined : "auto" }}
      >
        <Link href="/" aria-label="American Outlet — inicio">
          <Logo light={overHero} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  overHero
                    ? active
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                    : active
                      ? "text-[var(--color-tinta)]"
                      : "text-[var(--color-tinta-suave)] hover:text-[var(--color-tinta)]"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-[var(--color-rojo)] to-[var(--color-azul)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Button href={waLink()} variant="whatsapp" icon="whatsapp" external>
            Escríbenos
          </Button>
        </div>

        <button
          type="button"
          className={`flex h-10 w-10 items-center justify-center rounded-xl md:hidden ${
            overHero ? "bg-white/10 backdrop-blur" : "glass"
          }`}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`h-0.5 w-5 rounded-full transition-all duration-300 ${
                overHero ? "bg-white" : "bg-[var(--color-tinta)]"
              } ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-5 rounded-full transition-all duration-300 ${
                overHero ? "bg-white" : "bg-[var(--color-tinta)]"
              } ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-5 rounded-full transition-all duration-300 ${
                overHero ? "bg-white" : "bg-[var(--color-tinta)]"
              } ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Panel móvil */}
      <div
        className={`fixed inset-0 top-0 z-40 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-[var(--color-azul-900)]/30 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute inset-x-3 top-[4.5rem] rounded-3xl glass-strong glass-hairline p-4 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <nav className="flex flex-col">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium transition-colors ${
                    active
                      ? "bg-white/70 text-[var(--color-tinta)]"
                      : "text-[var(--color-tinta-suave)] hover:bg-white/50"
                  }`}
                >
                  {item.label}
                  <Icon name="arrow" className="h-4 w-4 opacity-40" />
                </Link>
              );
            })}
          </nav>
          <div className="mt-3 border-t border-[var(--color-borde)] pt-3">
            <Button href={waLink()} variant="whatsapp" icon="whatsapp" external className="w-full">
              Escríbenos por WhatsApp
            </Button>
            <a
              href={site.ecommerce.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-medium text-[var(--color-azul)]"
            >
              Comprar en línea
              <Icon name="arrow" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
