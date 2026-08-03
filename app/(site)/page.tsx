import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { Button } from "@/components/ui/Button";
import { getPageContent } from "@/lib/content";

export default async function HomePage() {
  const content = await getPageContent("home");

  return (
    <>
      <Hero content={content} />
      <ProductGrid />

      <section className="px-8 py-28 text-center">
        <h2 className="mx-auto max-w-xl font-display text-h2">
          {content.cta_title}
        </h2>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/get-started">{content.cta_button_primary}</Button>
          <Button href="/docs" variant="secondary">
            {content.cta_button_secondary}
          </Button>
        </div>
      </section>
    </>
  );
}
