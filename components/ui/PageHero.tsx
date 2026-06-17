import Link from "next/link";
import { Container } from "./Container";
import { Icon } from "./Icon";

type Crumb = { name: string; href?: string };

export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  crumbs?: Crumb[];
}) {
  return (
    <section className="relative overflow-hidden pt-28 pb-8 sm:pt-40 sm:pb-14">
      <div
        className="pointer-events-none absolute left-1/2 top-20 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-[var(--color-azul)]/10 blur-3xl"
        aria-hidden="true"
      />
      <Container className="relative">
        {crumbs && (
          <nav aria-label="Migas de pan" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--color-tinta-tenue)]">
              {crumbs.map((c, i) => (
                <li key={c.name} className="flex items-center gap-1.5">
                  {c.href ? (
                    <Link href={c.href} className="transition-colors hover:text-[var(--color-azul)]">
                      {c.name}
                    </Link>
                  ) : (
                    <span className="text-[var(--color-tinta-suave)]">{c.name}</span>
                  )}
                  {i < crumbs.length - 1 && (
                    <Icon name="arrow" className="h-3 w-3 opacity-40" />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && (
          <div className="flex items-center gap-3">
            <span className="divider-brand" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-azul)]">
              {eyebrow}
            </span>
          </div>
        )}
        <h1 className="mt-4 max-w-3xl text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.04em] text-[var(--color-tinta)] sm:text-5xl sm:leading-[1.05]">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-tinta-suave)] sm:mt-5 sm:text-lg">
            {intro}
          </p>
        )}
      </Container>
    </section>
  );
}
