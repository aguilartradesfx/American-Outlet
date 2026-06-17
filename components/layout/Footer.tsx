import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { site, waLink } from "@/content/site";
import { stores } from "@/content/stores";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-[var(--color-borde)] bg-white/50 backdrop-blur-sm">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-6 md:grid-cols-12 lg:px-8">
        <div className="md:col-span-4">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--color-tinta-suave)]">
            {site.tagline}. Saldos y liquidaciones americanas con respaldo local e
            inventario nuevo a diario.
          </p>
          <div className="mt-5 flex gap-2.5">
            {[
              { href: site.redes.instagram, label: "Instagram", d: "M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm4.8-2.9a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z" },
              { href: site.redes.facebook, label: "Facebook", d: "M13 21v-7h2.4l.5-3H13V9.2c0-.9.3-1.5 1.6-1.5H16V5.1A21 21 0 0 0 13.8 5C11.6 5 10 6.3 10 8.9V11H7.6v3H10v7Z" },
              { href: site.redes.tiktok, label: "TikTok", d: "M16 4c.3 1.9 1.4 3.3 3.2 3.6v2.5c-1.2 0-2.3-.3-3.2-.9V15a5 5 0 1 1-5-5c.2 0 .5 0 .7.05v2.6A2.4 2.4 0 1 0 13.5 15V4Z" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-xl glass text-[var(--color-tinta-suave)] transition-all duration-300 hover:-translate-y-0.5 hover:text-[var(--color-azul)]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d={s.d} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-sm font-semibold text-[var(--color-tinta)]">Navegación</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-[var(--color-tinta-suave)]">
            {[
              { href: "/tiendas", label: "Tiendas" },
              { href: "/como-comprar", label: "Cómo comprar" },
              { href: "/nosotros", label: "Nosotros" },
              { href: "/contacto", label: "Contacto" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-[var(--color-azul)]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-sm font-semibold text-[var(--color-tinta)]">Nuestras tiendas</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-[var(--color-tinta-suave)]">
            {stores.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/tiendas/${s.slug}`}
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--color-azul)]"
                >
                  <Icon name="pin" className="h-3.5 w-3.5 text-[var(--color-rojo)]" />
                  {s.zona.split(",")[0]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-sm font-semibold text-[var(--color-tinta)]">Contacto</h3>
          <ul className="mt-4 space-y-3 text-sm text-[var(--color-tinta-suave)]">
            <li>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-[#1fae54]"
              >
                <Icon name="whatsapp" className="h-4 w-4" />
                {site.whatsapp.display}
              </a>
            </li>
            <li className="inline-flex items-start gap-2">
              <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-azul)]" />
              <span>Oficinas: {site.cedi.direccion}</span>
            </li>
            <li>
              <a
                href={site.ecommerce.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-[var(--color-azul)] hover:underline"
              >
                Comprar en línea
                <Icon name="arrow" className="h-3.5 w-3.5" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--color-borde)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-[var(--color-tinta-tenue)] sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} American Outlet. Todos los derechos reservados.</p>
          <p>Hecho en Costa Rica 🇨🇷 · {site.anios} años de trayectoria</p>
        </div>
      </div>
    </footer>
  );
}
