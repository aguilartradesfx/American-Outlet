export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  center = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <div className={`flex items-center gap-3 ${center ? "justify-center" : ""}`}>
          <span className="divider-brand" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-azul)]">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-tinta)] sm:mt-4 sm:text-4xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-tinta-suave)] sm:mt-4 sm:text-base">
          {intro}
        </p>
      )}
    </div>
  );
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
