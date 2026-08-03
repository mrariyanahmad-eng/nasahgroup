export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden px-8 pb-20 pt-36 text-center sm:pt-44">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-260px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-nasah-red/[0.06] blur-3xl"
      />
      <span className="relative z-10 mb-6 inline-flex items-center gap-2 rounded-full bg-nasah-red/10 px-4 py-1.5 text-[13px] font-semibold text-nasah-red">
        {eyebrow}
      </span>
      <h1 className="relative z-10 mx-auto max-w-2xl font-display text-h1">
        {title}
      </h1>
      {description && (
        <p className="relative z-10 mx-auto mt-5 max-w-lg text-body text-nasah-gray">
          {description}
        </p>
      )}
    </section>
  );
}
