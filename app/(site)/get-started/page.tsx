import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { getPageContent } from "@/lib/content";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Get Started",
  description: "Create your Nasah Group LTD account.",
  path: "/get-started",
});

export default async function GetStartedPage() {
  const content = await getPageContent("get-started");

  return (
    <>
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <section className="px-8 pb-28 text-center">
        <Button href="/sign-up">Create account</Button>
      </section>
    </>
  );
}
