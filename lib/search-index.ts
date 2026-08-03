export type SearchEntry = {
  title: string;
  description: string;
  href: string;
  group: "Pages" | "Docs";
};

export const STATIC_SEARCH_INDEX: SearchEntry[] = [
  { title: "Home", description: "Nasah Group LTD homepage", href: "/", group: "Pages" },
  { title: "Products", description: "Every product in the ecosystem", href: "/products", group: "Pages" },
  { title: "AI", description: "Applied AI across Nasah Group LTD", href: "/ai", group: "Pages" },
  { title: "Developers", description: "API, SDKs, and developer console", href: "/developers", group: "Pages" },
  { title: "About", description: "About Nasah Group LTD", href: "/about", group: "Pages" },
  { title: "Careers", description: "Work at Nasah Group LTD", href: "/careers", group: "Pages" },
  { title: "Contact", description: "Get in touch", href: "/contact", group: "Pages" },
  { title: "Privacy Policy", description: "How we handle your data", href: "/privacy", group: "Pages" },
  { title: "Terms of Service", description: "Terms of use", href: "/terms", group: "Pages" },
  { title: "Get Started", description: "Create your Nasah account", href: "/get-started", group: "Pages" },
  { title: "Sign In", description: "Sign in to your account", href: "/sign-in", group: "Pages" },

  { title: "Blog", description: "News and updates from Nasah Group LTD", href: "/blog", group: "Pages" },
  { title: "Docs: Introduction", description: "Documentation home", href: "/docs", group: "Docs" },
  { title: "Docs: Quick Start", description: "Make your first API request", href: "/docs/quick-start", group: "Docs" },
  { title: "Docs: Authentication", description: "API keys and OAuth 2.0", href: "/docs/authentication", group: "Docs" },
  { title: "Docs: Products API", description: "Query products via the API", href: "/docs/products-api", group: "Docs" },
  { title: "Docs: Webhooks", description: "Real-time event subscriptions", href: "/docs/webhooks", group: "Docs" },
  { title: "Docs: Rate Limits", description: "Request limits per plan", href: "/docs/rate-limits", group: "Docs" },
  { title: "Docs: JavaScript SDK", description: "Official JS client", href: "/docs/sdk-js", group: "Docs" },
  { title: "Docs: Python SDK", description: "Official Python package", href: "/docs/sdk-python", group: "Docs" },
  { title: "Docs: Go SDK", description: "Official Go client", href: "/docs/sdk-go", group: "Docs" },
];
