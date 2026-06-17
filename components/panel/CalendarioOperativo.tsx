/**
 * Render de un calendario operativo de tienda (manual de contenido). Solo lectura.
 * Server component: no requiere JS de cliente. Usa <details> nativo para colapsar
 * los bloques de formatos sin hidratación.
 */
import { Icon } from "@/components/ui/Icon";
import type { CalendarioOperativo } from "@/content/calendarios-operativos/tipos";

function Seccion({
  icon,
  titulo,
  children,
}: {
  icon: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-azul-900)] text-white">
          <Icon name={icon} className="h-[18px] w-[18px]" />
        </span>
        <h2 className="text-lg font-semibold tracking-[-0.01em] text-[var(--color-tinta)] sm:text-xl">
          {titulo}
        </h2>
      </div>
      {children}
    </section>
  );
}

export function CalendarioOperativo({ data }: { data: CalendarioOperativo }) {
  return (
    <div className="space-y-10">
      {/* Cabecera */}
      <div className="card-3d p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-azul)]">
          Calendario operativo
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-tinta)] sm:text-3xl">
          {data.tiendaNombre}
        </h1>
        <p className="mt-1 text-sm text-[var(--color-tinta-suave)]">
          {data.subtitulo}
        </p>
        <p className="mt-4 border-l-2 border-[var(--color-azul)] pl-4 text-sm italic text-[var(--color-tinta-suave)]">
          {data.intro}
        </p>
      </div>

      {/* Cliente */}
      <Seccion icon="chat" titulo={data.cliente.titulo}>
        <p className="text-sm leading-relaxed text-[var(--color-tinta-suave)]">
          {data.cliente.intro}
        </p>
        {data.cliente.segmentos.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {data.cliente.segmentos.map((s) => (
              <div key={s.titulo} className="surface lift-3d p-4">
                <p className="text-sm font-semibold text-[var(--color-tinta)]">
                  {s.titulo}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-tinta-suave)]">
                  {s.descripcion}
                </p>
              </div>
            ))}
          </div>
        )}
        {data.cliente.enComun && (
          <p className="text-sm leading-relaxed text-[var(--color-tinta-suave)]">
            {data.cliente.enComun}
          </p>
        )}
        {(data.cliente.mueve || data.cliente.frena) && (
          <div className="grid gap-3 sm:grid-cols-2">
            {data.cliente.mueve && (
              <div className="surface p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                  Lo que lo mueve
                </p>
                <p className="mt-1 text-sm text-[var(--color-tinta-suave)]">
                  {data.cliente.mueve}
                </p>
              </div>
            )}
            {data.cliente.frena && (
              <div className="surface p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-rojo)]">
                  Lo que lo frena
                </p>
                <p className="mt-1 text-sm text-[var(--color-tinta-suave)]">
                  {data.cliente.frena}
                </p>
              </div>
            )}
          </div>
        )}
      </Seccion>

      {/* Estructura diaria */}
      <Seccion icon="layers" titulo="Estructura diaria fija">
        <p className="text-sm text-[var(--color-tinta-suave)]">
          Cada día tiene{" "}
          <strong className="font-semibold text-[var(--color-tinta)]">
            {data.estructuraDiaria.totalPiezas} piezas de contenido
          </strong>
          .
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {data.estructuraDiaria.bloques.map((b) => (
            <div key={b.bloque} className="surface lift-3d flex items-center gap-4 p-4">
              <span className="text-3xl font-semibold tracking-tight text-[var(--color-azul)]">
                {b.cantidad}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--color-tinta)]">
                  {b.bloque}
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-tinta-suave)]">
                  {b.que}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Seccion>

      {/* Fichas */}
      <Seccion icon="image" titulo="Las 35 fichas de producto diarias">
        <p className="text-sm leading-relaxed text-[var(--color-tinta-suave)]">
          {data.fichas.queEs}
        </p>
        <div className="surface border-l-2 border-[var(--color-azul)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-tinta-tenue)]">
            Instrucción fija al encargado
          </p>
          <p className="mt-1 text-sm italic leading-relaxed text-[var(--color-tinta-suave)]">
            “{data.fichas.instruccion}”
          </p>
        </div>

        {/* Distribución por categoría */}
        <div className="card-3d overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-borde)] text-[11px] uppercase tracking-[0.1em] text-[var(--color-tinta-tenue)]">
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Categoría</th>
                <th className="px-4 py-3 text-center font-semibold">Por día</th>
                <th className="px-4 py-3 font-semibold">Ejemplos</th>
              </tr>
            </thead>
            <tbody>
              {data.fichas.categorias.map((c) => (
                <tr
                  key={c.n}
                  className="border-b border-[var(--color-borde)]/60 last:border-0"
                >
                  <td className="px-4 py-3 text-[var(--color-tinta-tenue)]">{c.n}</td>
                  <td className="px-4 py-3 font-medium text-[var(--color-tinta)]">
                    {c.categoria}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex min-w-[1.75rem] justify-center rounded-full bg-[var(--color-azul-900)] px-2 py-0.5 text-xs font-semibold text-white">
                      {c.porDia}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-tinta-suave)]">
                    {c.ejemplos}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Plantillas de texto */}
        <div className="grid gap-3 sm:grid-cols-2">
          {data.fichas.plantillas.map((p) => (
            <div key={p.titulo} className="surface p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-tinta-tenue)]">
                {p.titulo}
              </p>
              <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-[var(--color-tinta-suave)]">
                {p.texto}
              </pre>
            </div>
          ))}
        </div>

        {/* Reglas de fotografía */}
        <div className="surface p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-tinta-tenue)]">
            Reglas de fotografía
          </p>
          <ul className="mt-2 space-y-1.5">
            {data.fichas.reglasFoto.map((r, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-[var(--color-tinta-suave)]"
              >
                <Icon
                  name="check"
                  className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-azul)]"
                />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </Seccion>

      {/* Historias interactivas */}
      <Seccion icon="film" titulo="Las 3 historias interactivas diarias">
        <p className="text-sm leading-relaxed text-[var(--color-tinta-suave)]">
          {data.historias.intro}
        </p>
        <div className="space-y-4">
          {data.historias.items.map((h) => (
            <article key={h.numero} className="card-3d p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-borde)] text-sm font-semibold text-[var(--color-azul)]">
                  {h.numero}
                </span>
                <h3 className="text-base font-semibold text-[var(--color-tinta)]">
                  {h.titulo}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-tinta-suave)]">
                {h.proposito}
              </p>

              <details className="group mt-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-[1rem] border border-[var(--color-borde)] bg-white/50 px-4 py-2.5 text-sm font-medium text-[var(--color-tinta-suave)] transition hover:bg-white">
                  <span>Formatos disponibles ({h.formatos.length})</span>
                  <Icon
                    name="arrow"
                    className="h-4 w-4 rotate-90 transition-transform group-open:-rotate-90"
                  />
                </summary>
                <div className="mt-3 space-y-2.5">
                  {h.formatos.map((f) => (
                    <div key={f.letra} className="surface p-4">
                      <p className="text-sm font-semibold text-[var(--color-tinta)]">
                        <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-azul-900)] text-[11px] font-semibold text-white">
                          {f.letra}
                        </span>
                        {f.titulo}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-tinta-suave)]">
                        {f.descripcion}
                      </p>
                    </div>
                  ))}
                </div>
              </details>

              <div className="mt-4 border-l-2 border-[var(--color-azul)] pl-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-tinta-tenue)]">
                  Instrucción al encargado
                </p>
                <p className="mt-1 text-sm italic leading-relaxed text-[var(--color-tinta-suave)]">
                  “{h.instruccion}”
                </p>
              </div>
            </article>
          ))}
        </div>
      </Seccion>

      {/* Foco semanal */}
      <Seccion icon="calendar" titulo="Calendario semanal — foco por día">
        <div className="card-3d overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-borde)] text-[11px] uppercase tracking-[0.1em] text-[var(--color-tinta-tenue)]">
                <th className="px-4 py-3 font-semibold">Día</th>
                <th className="px-4 py-3 font-semibold">Foco de las 35 fichas</th>
                <th className="px-4 py-3 font-semibold">Historia 1 · BTS</th>
                <th className="px-4 py-3 font-semibold">Historia 2 · PDV</th>
                <th className="px-4 py-3 font-semibold">Historia 3 · Cliente</th>
              </tr>
            </thead>
            <tbody>
              {data.focoSemanal.map((d) => (
                <tr
                  key={d.dia}
                  className="border-b border-[var(--color-borde)]/60 align-top last:border-0"
                >
                  <td className="px-4 py-3 font-semibold text-[var(--color-tinta)]">
                    {d.dia}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-tinta-suave)]">
                    {d.focoFichas}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-tinta-suave)]">{d.bts}</td>
                  <td className="px-4 py-3 text-[var(--color-tinta-suave)]">{d.pdv}</td>
                  <td className="px-4 py-3 text-[var(--color-tinta-suave)]">
                    {d.cliente}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Seccion>

      {/* Temporadas + fechas especiales */}
      <Seccion icon="chart" titulo="Estrategia por temporada">
        <div className="grid gap-3 sm:grid-cols-3">
          {data.temporadas.map((t) => (
            <div key={t.temporada} className="surface lift-3d p-4">
              <p className="text-sm font-semibold text-[var(--color-tinta)]">
                {t.temporada}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-tinta-tenue)]">
                {t.meses}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-tinta-suave)]">
                {t.foco}
              </p>
            </div>
          ))}
        </div>
        <div className="card-3d divide-y divide-[var(--color-borde)]/60">
          {data.fechasEspeciales.map((f) => (
            <div key={f.fecha} className="flex flex-col gap-1 p-4 sm:flex-row sm:gap-4">
              <p className="shrink-0 text-sm font-semibold text-[var(--color-tinta)] sm:w-48">
                {f.fecha}
              </p>
              <p className="text-sm text-[var(--color-tinta-suave)]">{f.cambio}</p>
            </div>
          ))}
        </div>
      </Seccion>

      {/* Checklist */}
      <Seccion icon="check-circle" titulo="Resumen del día — checklist del administrador">
        <p className="text-sm text-[var(--color-tinta-suave)]">
          Antes de las 9am cada día, el administrador confirma:
        </p>
        <ul className="card-3d divide-y divide-[var(--color-borde)]/60">
          {data.checklist.map((c, i) => (
            <li key={i} className="flex items-start gap-3 p-4">
              <span
                className="mt-0.5 h-4 w-4 shrink-0 rounded-[0.3rem] border border-[var(--color-borde)]"
                aria-hidden="true"
              />
              <span className="text-sm text-[var(--color-tinta-suave)]">{c}</span>
            </li>
          ))}
        </ul>
      </Seccion>

      {/* Por qué funciona */}
      <Seccion icon="sparkle" titulo="Por qué funciona este sistema">
        <div className="space-y-3">
          {data.porQueFunciona.map((p, i) => (
            <p
              key={i}
              className="text-sm leading-relaxed text-[var(--color-tinta-suave)]"
            >
              {p}
            </p>
          ))}
        </div>
      </Seccion>
    </div>
  );
}
