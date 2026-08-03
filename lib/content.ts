import { createClient } from "@/lib/supabase/server";
import { DEFAULT_CONTENT, type PageContent } from "@/lib/content-defaults";

/**
 * Reads editable content for a page. Falls back to DEFAULT_CONTENT for
 * any field that's missing, and to the entire default set if Supabase
 * is unreachable or the row doesn't exist yet — the site should never
 * break because of a CMS hiccup.
 */
export async function getPageContent(slug: string): Promise<PageContent> {
  const defaults = DEFAULT_CONTENT[slug] ?? {};

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("page_slug", slug)
      .maybeSingle();

    if (error || !data) return defaults;

    return { ...defaults, ...(data.content as PageContent) };
  } catch {
    return defaults;
  }
}
