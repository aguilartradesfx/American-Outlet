import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { Store } from "@/content/stores";

export function StoreCard({ store }: { store: Store }) {
  return (
    <Link
      href={`/tiendas/${store.slug}`}
      className="group relative block h-full overflow-hidden rounded-3xl glass glass-hairline lift"
    >
      {/* Foto real de la fachada (Cloudinary, f_auto,q_auto) */}
      <div className="relative h-40 overflow-hidden">
        <Image
          src={store.imagen}
          alt={`Fachada de ${store.nombre}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute inset-0 flex items-end justify-between p-5">
          <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
            <Icon name="pin" className="h-3.5 w-3.5" />
            {store.canton}, {store.provincia}
          </div>
          <Icon
            name="store"
            className="h-10 w-10 text-white/90 drop-shadow transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
          {store.zona.split(",")[0]}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--color-tinta-suave)]">
          {store.intro}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {store.destacados.slice(0, 2).map((d) => (
            <span
              key={d}
              className="rounded-full bg-[var(--color-niebla-2)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-tinta-suave)]"
            >
              {d}
            </span>
          ))}
        </div>

        <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-azul)]">
          Ver tienda
          <Icon
            name="arrow"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}
