export function DocsPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article>
      <p className="mb-6 text-sm text-nasah-gray">
        Docs <span className="mx-1.5">/</span> {title}
      </p>
      <h1 className="mb-4 font-display text-h2">{title}</h1>
      <p className="mb-6 text-body leading-relaxed text-nasah-gray">
        {description}
      </p>
      <div className="rounded-control border border-dashed border-nasah-border p-6 text-sm text-nasah-gray dark:border-white/15">
        This page is a placeholder — content hasn't been written yet.
      </div>
    </article>
  );
}
