import { ISOTIPO_VIEWBOX, isotipoPaths } from "@/components/ui/isotipoPaths";

/** Anchos de barra deterministas a partir del código → "código de barras". */
function barras(codigo: string): number[] {
  const out: number[] = [];
  for (let i = 0; i < 38; i++) {
    const c = codigo.charCodeAt(i % codigo.length) + i * 7;
    out.push((c % 3) + 1);
  }
  return out;
}

/** Folio numérico estable derivado del código. */
export function folioDe(codigo: string): string {
  let n = 0;
  for (const ch of codigo) n = (n * 31 + ch.charCodeAt(0)) % 1000000;
  return String(n).padStart(6, "0");
}

/** Cupón visual reutilizable (ejemplo en /promo y resultado tras registrarse). */
export function CuponTicket({
  nombre,
  codigo,
  ejemplo = false,
}: {
  nombre: string;
  codigo: string;
  ejemplo?: boolean;
}) {
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-[var(--color-azul-900)] to-[#1b2c39] text-white shadow-[0_30px_60px_-24px_rgba(16,29,39,0.55)]">
      {ejemplo && (
        <span className="absolute right-4 top-4 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/70">
          Ejemplo
        </span>
      )}

      <div className="flex items-center gap-2 px-7 pt-7">
        <svg width="15" height="19" viewBox={ISOTIPO_VIEWBOX} aria-hidden="true">
          {isotipoPaths.map((d, i) => (
            <path key={i} fill="#fff" d={d} />
          ))}
        </svg>
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
          American Outlet
        </span>
      </div>

      <div className="px-7 pt-4">
        <p className="flex items-start text-[64px] font-bold leading-none tracking-tight">
          15%
          <span className="ml-1.5 mt-1 text-2xl font-semibold text-[var(--color-rojo)]">OFF</span>
        </p>
        <p className="mt-1 text-lg font-medium text-white/85">para papá</p>
      </div>

      {/* Perforación tipo ticket */}
      <div className="relative my-6">
        <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[var(--color-niebla)]" />
        <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[var(--color-niebla)]" />
        <div className="border-t border-dashed border-white/25" />
      </div>

      <div className="px-7 pb-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
          Tu código
        </p>
        <p className="mt-1 font-mono text-3xl font-bold tracking-[0.16em]">{codigo}</p>
        <p className="mt-2 text-sm text-white/70">
          A nombre de <span className="font-medium text-white">{nombre}</span>
        </p>

        <div className="mt-4 flex items-end gap-3">
          <div className="flex h-9 flex-1 items-end gap-[2px] overflow-hidden">
            {barras(codigo).map((w, i) => (
              <span key={i} style={{ width: `${w}px` }} className="h-full shrink-0 bg-white/80" />
            ))}
          </div>
          <span className="shrink-0 font-mono text-[10px] tracking-wider text-white/50">
            N.º {folioDe(codigo)}
          </span>
        </div>
      </div>
    </div>
  );
}
