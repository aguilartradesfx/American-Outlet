import type { Metadata } from "next";
import {
  getMesActivo,
  getFasesDeMes,
  getDiasDeMes,
  getTiendaActual,
  getTiendas,
  type Fase,
} from "@/lib/panel/datos";
import { tipoPiezaMeta, ordenTipos, type TipoPieza } from "@/lib/panel/piezas";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Fases" };

export default async function FasesPage() {
  // Las fases son del calendario de la tienda del usuario (admin → Ciudad Quesada).
  const tiendaActual = await getTiendaActual();
  let tiendaId = tiendaActual?.tiendaId ?? null;
  if (!tiendaId) {
    const tiendas = await getTiendas();
    tiendaId =
      tiendas.find((t) => t.slug === "ciudad-quesada")?.id ?? tiendas[0]?.id ?? null;
  }
  const mes = tiendaId ? await getMesActivo(tiendaId) : null;
  if (!mes) {
    return (
      <div className="card-3d p-8 text-center">
        <p className="text-sm text-[var(--color-tinta-suave)]">
          Todavía no hay ningún mes de contenido publicado.
        </p>
      </div>
    );
  }

  const [fases, dias] = await Promise.all([
    getFasesDeMes(mes.id),
    getDiasDeMes(mes.id),
  ]);

  // Conteo real de piezas por tipo dentro del rango de cada fase.
  function piezasDeFase(f: Fase): Array<{ tipo: TipoPieza; n: number }> {
    const cuenta = new Map<TipoPieza, number>();
    for (const d of dias) {
      if (d.fecha < f.dia_desde || d.fecha > f.dia_hasta) continue;
      for (const p of d.piezas) cuenta.set(p.tipo, (cuenta.get(p.tipo) ?? 0) + 1);
    }
    return ordenTipos
      .filter((t) => cuenta.has(t))
      .map((t) => ({ tipo: t, n: cuenta.get(t)! }));
  }

  return (
    <div className="space-y-7">
      {/* Regla de oro */}
      {(mes.regla_oro_frase || mes.regla_oro_contexto) && (
        <div className="relative overflow-hidden rounded-[var(--radius-glass)] bg-[var(--color-azul-900)] p-7 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_30px_60px_-40px_rgba(16,29,39,0.9)] sm:p-9">
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(38rem 38rem at 112% -20%, rgba(223,14,11,0.32), transparent 60%)",
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              La regla de oro
            </p>
            {mes.regla_oro_frase && (
              <p className="mt-3 max-w-2xl text-2xl font-semibold leading-snug tracking-[-0.02em] sm:text-3xl">
                “{mes.regla_oro_frase}”
              </p>
            )}
            {mes.regla_oro_contexto && (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65">
                {mes.regla_oro_contexto}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Progresión del descuento */}
      <div className="flex items-stretch gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:pb-0">
        {fases.map((f, i) => (
          <div key={f.id} className="flex flex-1 items-center gap-2 sm:gap-3">
            <div className="surface lift-3d min-w-[5rem] flex-1 px-3 py-4 text-center">
              <p className="flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-tinta-tenue)]">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: f.color_acento ?? "#004a70" }}
                  aria-hidden="true"
                />
                Fase {f.numero}
              </p>
              <p
                className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl"
                style={{ color: f.color_texto ?? "#004a70" }}
              >
                {f.descuento}%
              </p>
            </div>
            {i < fases.length - 1 && (
              <Icon
                name="arrow"
                className="h-4 w-4 shrink-0 text-[var(--color-tinta-tenue)]"
              />
            )}
          </div>
        ))}
      </div>

      {/* Detalle por fase */}
      <div className="space-y-5">
        {fases.map((f) => {
          const piezas = piezasDeFase(f);
          return (
            <article key={f.id} className="card-3d overflow-hidden">
              <div
                className="h-1"
                style={{ backgroundColor: f.color_acento ?? "#004a70" }}
                aria-hidden="true"
              />
              <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="inline-flex h-7 items-center gap-1.5 rounded-full border bg-white/50 px-3 text-xs font-bold uppercase tracking-wide"
                      style={{ borderColor: f.color_acento ?? "#004a70", color: f.color_texto ?? "#004a70" }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: f.color_acento ?? "#004a70" }}
                        aria-hidden="true"
                      />
                      Fase {f.numero}
                    </span>
                    <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
                      {f.nombre}
                    </h2>
                    <span className="text-sm text-[var(--color-tinta-tenue)]">
                      Jun {f.dia_desde}–{f.dia_hasta}
                    </span>
                  </div>

                  {f.cita && (
                    <p
                      className="mt-4 border-l-2 pl-4 text-lg font-medium italic leading-snug"
                      style={{ borderColor: f.color_acento ?? "#004a70", color: f.color_texto ?? "#004a70" }}
                    >
                      “{f.cita}”
                    </p>
                  )}

                  <dl className="mt-5 space-y-3 text-sm">
                    {f.objetivo && (
                      <div>
                        <dt className="font-semibold text-[var(--color-tinta)]">
                          Tono / objetivo
                        </dt>
                        <dd className="mt-0.5 leading-relaxed text-[var(--color-tinta-suave)]">
                          {f.objetivo}
                        </dd>
                      </div>
                    )}
                    {f.logica && (
                      <div>
                        <dt className="font-semibold text-[var(--color-tinta)]">
                          Lógica
                        </dt>
                        <dd className="mt-0.5 leading-relaxed text-[var(--color-tinta-suave)]">
                          {f.logica}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div className="surface p-5">
                  <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-tinta-tenue)]">
                      Descuento de fase
                    </p>
                    <p
                      className="mt-1 text-5xl font-bold tracking-tight"
                      style={{ color: f.color_texto ?? "#004a70" }}
                    >
                      {f.descuento}%
                    </p>
                  </div>

                  <div className="mt-5 border-t border-[var(--color-borde)] pt-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-tinta-tenue)]">
                      Piezas de la fase
                    </p>
                    {piezas.length === 0 ? (
                      <p className="text-sm text-[var(--color-tinta-tenue)]">
                        Sin piezas asignadas todavía.
                      </p>
                    ) : (
                      <ul className="space-y-1.5">
                        {piezas.map(({ tipo, n }) => (
                          <li
                            key={tipo}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="flex items-center gap-2 text-[var(--color-tinta-suave)]">
                              <Icon
                                name={tipoPiezaMeta[tipo].icon}
                                className="h-4 w-4 text-[var(--color-tinta-tenue)]"
                              />
                              {tipoPiezaMeta[tipo].label}
                            </span>
                            <span className="font-semibold text-[var(--color-tinta)]">
                              ×{n}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
