import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ProductGrid } from "@/components/ProductGrid";
import { getPageContent } from "@/lib/content";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Products",
  description: "Every product in the Nasah Group LTD ecosystem, in one place.",
  path: "/products",
  keywords: ["Nasah products", "Nasah apps", "Nasah AI", "Nasah dashboard"],
});

export default async function ProductsPage() {
  const content = await getPageContent("products");

  return (
    <>
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <ProductGrid />
    </>
  );
}
