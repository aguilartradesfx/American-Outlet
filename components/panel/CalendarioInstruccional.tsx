import { Icon } from "@/components/ui/Icon";
import type { CalendarioInstruccional as Data } from "@/content/calendarios-operativos/tipos";

// Deriva un fondo pastel del color de la acción (sin tocar los datos).
const pastelBg = (color: string) => `color-mix(in srgb, ${color} 14%, #fff)`;
const pastelBorde = (color: string) => `color-mix(in srgb, ${color} 26%, #fff)`;

export function CalendarioInstruccional({ data }: { data: Data }) {
  const metaPorTipo = new Map(data.acciones.map((a) => [a.tipo, a]));

  return (
    <div className="space-y-7">
      {/* Encabezado */}
      <div className="card-3d p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-tinta-tenue)]">
          {data.tiendaNombre}
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
          {data.subtitulo}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-tinta-suave)]">
          {data.intro}
        </p>
      </div>

      {/* Leyenda de acciones */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {data.acciones.map((a) => (
          <div key={a.tipo} className="surface lift-3d flex items-start gap-3 p-4">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: pastelBg(a.color), color: a.color }}
            >
              <Icon name={a.icon} className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--color-tinta)]">{a.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-tinta-suave)]">
                {a.descripcion}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Grilla del mes tipo */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.dias.map((d) => {
          const a = metaPorTipo.get(d.tipo);
          const color = a?.color ?? "#004a70";
          return (
            <div key={d.dia} className="surface lift-3d flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-tinta-tenue)]">
                  Día {d.dia}
                </span>
                <span
                  className="tag-pastel"
                  style={{
                    backgroundColor: pastelBg(color),
                    color,
                    borderColor: pastelBorde(color),
                  }}
                >
                  <Icon name={a?.icon ?? "sparkle"} className="h-3.5 w-3.5" />
                  {a?.label ?? d.tipo}
                </span>
              </div>
              {(d.tema || d.meta) && (
                <p className="text-sm font-semibold text-[var(--color-tinta)]">
                  {d.tema}
                  {d.tema && d.meta ? " · " : ""}
                  {d.meta}
                </p>
              )}
              <p className="text-sm leading-relaxed text-[var(--color-tinta-suave)]">
                {d.instruccion}
              </p>
            </div>
          );
        })}
      </div>

      {/* Reglas generales */}
      {data.notas.length > 0 && (
        <div className="card-3d p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-tinta-tenue)]">
            Reglas generales
          </p>
          <ul className="mt-3 space-y-2">
            {data.notas.map((n, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm leading-relaxed text-[var(--color-tinta-suave)]"
              >
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-azul)]" />
                {n}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
