/**
 * Logo de American Outlet (isotipo oficial + wordmark).
 * El isotipo vive en /public/brand/ (pack oficial del brand book).
 */
type LogoProps = { className?: string; compact?: boolean; light?: boolean };

export function Logo({ className = "", compact = false, light = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`relative inline-flex h-9 w-9 items-center justify-center rounded-xl shadow-[0_6px_16px_-6px_rgba(16,29,39,0.6)] ${
          light ? "bg-white/15 backdrop-blur" : "bg-[var(--color-azul-900)]"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/isotipo-blanco.svg"
          alt=""
          aria-hidden="true"
          className="h-5 w-auto"
        />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={`text-[15px] font-semibold tracking-[-0.02em] ${
              light ? "text-white" : "text-[var(--color-tinta)]"
            }`}
          >
            American <span className="text-[var(--color-rojo)]">Outlet</span>
          </span>
          <span
            className={`mt-0.5 text-[9px] font-medium uppercase tracking-[0.16em] ${
              light ? "text-white/60" : "text-[var(--color-tinta-tenue)]"
            }`}
          >
            Costa Rica
          </span>
        </span>
      )}
    </span>
  );
}
