import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPromoActiva } from "@/lib/panel/promos";
import { CuponTicket } from "@/components/promo/CuponTicket";
import { CopyButton } from "@/components/panel/CopyButton";
import { Icon } from "@/components/ui/Icon";
import { ISOTIPO_VIEWBOX, isotipoPaths } from "@/components/ui/isotipoPaths";

export const metadata: Metadata = {
  title: "¡Tu cupón está listo! · Día del Padre",
  robots: { index: false, follow: false },
};

export const revalidate = 300;

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; nombre?: string; desc?: string }>;
}) {
  const [sp, promo] = await Promise.all([searchParams, getPromoActiva()]);
  const cupon = (sp.code || "PAPA-XXXX").toUpperCase().slice(0, 16);
  const nombre = (sp.nombre || "Cliente").slice(0, 40);
  const fondo = promo?.imagen_url ?? null;
  const descargaUrl = `/cupon?code=${encodeURIComponent(cupon)}&nombre=${encodeURIComponent(nombre)}`;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-12 text-[var(--color-tinta)]">
      {/* Fondo: banner del mes difuminado + degradado de marca */}
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        {fondo ? (
          <Image src={fondo} alt="" fill priority sizes="100vw" className="scale-110 object-cover object-center blur-2xl" />
        ) : (
          <div className="absolute inset-0 bg-[var(--color-azul-900)]" />
        )}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(45rem 45rem at 50% -10%, rgba(0,74,112,0.35), transparent 60%), radial-gradient(45rem 45rem at 100% 110%, rgba(223,14,11,0.28), transparent 55%), linear-gradient(180deg, rgba(16,29,39,0.62), rgba(16,29,39,0.78))",
        }}
      />

      <div className="glass-strong glass-hairline w-full max-w-md rounded-[2rem] px-6 py-10 text-center sm:px-9">
        <div className="flex items-center justify-center gap-2">
          <svg width="15" height="19" viewBox={ISOTIPO_VIEWBOX} aria-hidden="true">
            {isotipoPaths.map((d, i) => (
              <path key={i} fill="var(--color-azul)" d={d} />
            ))}
          </svg>
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-tinta-suave)]">
            American Outlet
          </span>
        </div>

        <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-rojo)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-rojo-700)]">
          🎉 ¡Felicidades, {nombre.split(" ")[0]}!
        </span>

        <h1 className="mt-4 text-2xl font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--color-tinta)] sm:text-3xl">
          Ganaste tu cupón del Día del Padre
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-tinta-suave)]">
          Descargalo o tomale una captura y mostralo en cualquiera de nuestras
          tiendas para aplicar tu descuento.
        </p>

        <div className="mt-7">
          <CuponTicket nombre={nombre} codigo={cupon} />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <a
            href={descargaUrl}
            download="cupon-american-outlet.png"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-azul-900)] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            <Icon name="arrow" className="h-4 w-4 rotate-90" />
            Descargar cupón
          </a>
          <CopyButton text={cupon} label="Copiar código" />
        </div>

        <p className="mt-5 text-xs text-[var(--color-tinta-tenue)]">
          En tienda verificamos tu registro por tu nombre. ¡Te esperamos!
        </p>

        <Link
          href="/tiendas"
          className="mt-6 inline-block text-sm font-medium text-[var(--color-azul)] underline-offset-4 transition hover:underline"
        >
          Ver nuestras tiendas →
        </Link>
      </div>
    </main>
  );
}
