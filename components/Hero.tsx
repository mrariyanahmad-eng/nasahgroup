import { Button } from "@/components/ui/Button";
import type { PageContent } from "@/lib/content-defaults";

export function Hero({ content }: { content: PageContent }) {
  return (
    <section className="relative overflow-hidden px-8 pb-32 pt-40 text-center sm:pt-52">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-220px] h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-nasah-red/[0.07] blur-3xl"
      />

      <span className="relative z-10 mb-7 inline-flex items-center gap-2 rounded-full bg-nasah-red/10 px-4 py-1.5 text-[13px] font-semibold text-nasah-red">
        {content.hero_eyebrow}
      </span>

      <h1 className="relative z-10 mx-auto max-w-3xl font-display text-[44px] font-bold leading-[1.08] tracking-tight sm:text-hero">
        {content.hero_title_pre}
        <span className="text-nasah-red">{content.hero_title_highlight}</span>
        {content.hero_title_post}
      </h1>

      <p className="relative z-10 mx-auto mt-7 max-w-md text-body text-nasah-gray">
        {content.hero_description}
      </p>

      <div className="relative z-10 mt-10 flex justify-center gap-3">
        <Button href="/products">{content.hero_button_primary}</Button>
        <Button href="/about" variant="secondary">
          {content.hero_button_secondary}
        </Button>
      </div>
    </section>
  );
}
