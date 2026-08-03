import { getSettings, getLinks } from "@/lib/site-data";

export async function OrganizationJsonLd() {
  const [settings, social] = await Promise.all([getSettings(), getLinks("social")]);

  const logoUrl = settings.logo_mark_url.startsWith("http")
    ? settings.logo_mark_url
    : `https://nasahgroup.com${settings.logo_mark_url}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.site_name,
    url: "https://nasahgroup.com",
    logo: logoUrl,
    sameAs: social.map((link) => link.href),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export async function WebsiteJsonLd() {
  const settings = await getSettings();

  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.site_name,
    url: "https://nasahgroup.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://nasahgroup.com/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
