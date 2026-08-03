export function DocsArticle({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article>
      <p className="mb-6 text-sm text-nasah-gray">
        Docs <span className="mx-1.5">/</span> {title}
      </p>
      <h1 className="mb-6 font-display text-h2">{title}</h1>
      <div className="prose prose-neutral max-w-none dark:prose-invert prose-a:text-nasah-red prose-headings:font-display prose-code:before:content-none prose-code:after:content-none">
        {children}
      </div>
    </article>
  );
}
