import { permanentRedirect } from "next/navigation";

// The nav calls this page "Company", but the actual content lives at
// /about — redirect so /company is a real, resolvable URL instead of
// a sitemap entry that 404s (which hurts indexing more than helps it).
export default function CompanyRedirect() {
  permanentRedirect("/about");
}
