import { Icon } from "@/components/ui/Icon";

export type Historial = {
  mesActual: string;
  gastoMes: number;
  totalGeneraciones: number;
  countMes: number;
  porUsuario: { nombre: string; total: number; count: number }[];
  meses: { mes: string; total: number; count: number }[];
  items: {
    id: string;
    nombre: string | null;
    formato: string | null;
    proveedor: string | null;
    calidad: string | null;
    costo: number;
    url: string | null;
    titular: string | null;
    fecha: string;
  }[];
};

const MESES_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function mesLabel(ym: string) {
  const [a, m] = ym.split("-");
  const i = Number(m) - 1;
  return `${MESES_ES[i] ?? m} ${a}`;
}

const usd = (n: number) => `$${n.toFixed(2)}`;
const usd3 = (n: number) => `$${n.toFixed(3)}`;

function fecha(iso: string) {
  return new Date(iso).toLocaleString("es-CR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EstudioHistorial({ historial }: { historial: Historial }) {
  const h = historial;

  return (
    <div className="space-y-5">
      {/* Gasto del mes */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-3d p-5 sm:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-tinta-tenue)]">
            Gasto de {mesLabel(h.mesActual)}
          </p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-[var(--color-tinta)]">
            {usd(h.gastoMes)}
          </p>
          <p className="mt-0.5 text-sm text-[var(--color-tinta-suave)]">
            {h.countMes} {h.countMes === 1 ? "imagen" : "imágenes"} este mes
          </p>
        </div>

        {/* Por usuario (mes) */}
        <div className="card-3d p-5 sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-tinta-tenue)]">
            Por persona (este mes)
          </p>
          {h.porUsuario.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--color-tinta-tenue)]">
              Todavía no hay generaciones este mes.
            </p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {h.porUsuario.map((u) => (
                <li key={u.nombre} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-medium text-[var(--color-tinta)]">{u.nombre}</span>
                  <span className="shrink-0 text-[var(--color-tinta-suave)]">
                    {u.count} · <span className="font-semibold text-[var(--color-tinta)]">{usd(u.total)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Gasto por mes */}
      {h.meses.length > 1 && (
        <div className="card-3d p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-tinta-tenue)]">
            Gasto por mes
          </p>
          <ul className="mt-2 divide-y divide-[var(--color-borde)]">
            {h.meses.map((m) => (
              <li key={m.mes} className="flex items-center justify-between gap-3 py-1.5 text-sm">
                <span className="text-[var(--color-tinta)]">{mesLabel(m.mes)}</span>
                <span className="text-[var(--color-tinta-suave)]">
                  {m.count} · <span className="font-semibold text-[var(--color-tinta)]">{usd(m.total)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Historial de imágenes */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-tinta-tenue)]">
          Historial · {h.totalGeneraciones} generaciones
        </p>
        {h.items.length === 0 ? (
          <div className="card-3d p-8 text-center">
            <p className="text-sm text-[var(--color-tinta-suave)]">
              Todavía no se ha generado ninguna imagen.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {h.items.map((it) => (
              <li key={it.id} className="surface overflow-hidden">
                {it.url ? (
                  <a href={it.url} target="_blank" rel="noopener noreferrer" className="block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={it.url}
                      alt={it.titular ?? "Generación"}
                      className="aspect-square w-full object-cover"
                    />
                  </a>
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-[var(--p-bg)]">
                    <Icon name="image" className="h-6 w-6 text-[var(--color-tinta-tenue)]" />
                  </div>
                )}
                <div className="space-y-1 p-2.5">
                  <p className="truncate text-[11px] font-semibold text-[var(--color-tinta)]">
                    {it.titular || "—"}
                  </p>
                  <div className="flex items-center justify-between gap-1 text-[10px] text-[var(--color-tinta-tenue)]">
                    <span className="truncate">{it.nombre ?? "—"}</span>
                    <span className="shrink-0 font-semibold text-[var(--color-tinta-suave)]">
                      {usd3(it.costo)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-1 text-[10px] text-[var(--color-tinta-tenue)]">
                    <span>{it.formato ?? ""} · {it.calidad ?? ""}</span>
                    <span>{fecha(it.fecha)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
