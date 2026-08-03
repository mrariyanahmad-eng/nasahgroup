import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";
import { getPageContent } from "@/lib/content";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with Nasah Group LTD.",
  path: "/contact",
  keywords: ["contact Nasah Group LTD"],
});

export default async function ContactPage() {
  const content = await getPageContent("contact");

  return (
    <>
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <section className="px-8 pb-28">
        <ContactForm />
        <p className="mt-8 text-center text-sm text-nasah-gray">
          Or email us directly at{" "}
          <a href={`mailto:${content.email}`} className="font-semibold text-nasah-red">
            {content.email}
          </a>
        </p>
      </section>
    </>
  );
}
