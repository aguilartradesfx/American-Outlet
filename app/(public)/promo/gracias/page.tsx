import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { CuponTicket } from "@/components/promo/CuponTicket";
import { CopyButton } from "@/components/panel/CopyButton";

export const metadata: Metadata = {
  title: "¡Tu cupón está listo!",
  robots: { index: false, follow: false },
};

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; nombre?: string; nuevo?: string }>;
}) {
  const sp = await searchParams;
  const cupon = (sp.code || "CASA-XXXX").toUpperCase().slice(0, 16);
  const nombre = (sp.nombre || "Cliente").slice(0, 40);
  const yaRegistrado = sp.nuevo === "0";
  const descargaUrl = `/cupon?code=${encodeURIComponent(cupon)}&nombre=${encodeURIComponent(nombre)}&pct=10&tag=${encodeURIComponent("en muebles")}`;

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center px-5 pt-28 pb-16">
      <Container>
        <div className="card-3d mx-auto max-w-md p-7 text-center sm:p-9">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Icon name="check" className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
            {yaRegistrado ? `¡Ya estabas registrado, ${nombre}!` : `¡Listo, ${nombre}!`}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-tinta-suave)]">
            Este es tu cupón. Descargalo o tomale una captura y mostralo en cualquiera de nuestras tiendas.
          </p>

          <div className="mt-6">
            <CuponTicket nombre={nombre} codigo={cupon} porcentaje={10} etiqueta="en muebles" />
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
          <p className="mt-5 text-xs leading-relaxed text-[var(--color-tinta-tenue)]">
            En tienda verificamos tu registro por tu nombre. ¡Te esperamos!
          </p>

          <Link
            href="/tiendas"
            className="mt-6 inline-block text-sm font-medium text-[var(--color-azul)] underline-offset-4 transition hover:underline"
          >
            Ver nuestras tiendas →
          </Link>
        </div>
      </Container>
    </section>
  );
}
