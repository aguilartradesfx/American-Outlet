import Link from "next/link";
import { Icon } from "./Icon";

type Variant = "primary" | "ghost" | "whatsapp" | "outline";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-azul-900)] text-white shadow-[0_10px_30px_-12px_rgba(16,29,39,0.8)] hover:shadow-[0_16px_40px_-12px_rgba(16,29,39,0.9)] hover:-translate-y-0.5",
  whatsapp:
    "bg-[#1fae54] text-white shadow-[0_10px_30px_-12px_rgba(31,174,84,0.9)] hover:bg-[#1a9b4a] hover:-translate-y-0.5",
  outline:
    "border border-[var(--color-borde)] bg-white/60 text-[var(--color-tinta)] backdrop-blur hover:bg-white hover:-translate-y-0.5 hover:shadow-[var(--shadow-suave)]",
  ghost:
    "text-[var(--color-tinta)] hover:bg-white/70 hover:backdrop-blur",
};

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: Variant;
  icon?: string;
  iconRight?: boolean;
  external?: boolean;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

export function Button({
  children,
  href,
  variant = "primary",
  icon,
  iconRight = false,
  external = false,
  className = "",
  onClick,
  ariaLabel,
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const inner = (
    <>
      {icon && !iconRight && <Icon name={icon} className="h-[18px] w-[18px]" />}
      <span>{children}</span>
      {icon && iconRight && (
        <Icon
          name={icon}
          className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-0.5"
        />
      )}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cls}
          aria-label={ariaLabel}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cls} aria-label={ariaLabel}>
      {inner}
    </button>
  );
}
