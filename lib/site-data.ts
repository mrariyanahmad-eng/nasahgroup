import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_PRODUCTS,
  DEFAULT_LINKS,
  DEFAULT_CARDS,
  DEFAULT_SETTINGS,
  DEFAULT_DOCS,
  type Product,
  type SiteLink,
  type SiteCard,
  type SiteSettings,
  type DocPage,
} from "@/lib/content-defaults";

export async function getSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    if (error || !data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...data };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function getDocs(): Promise<DocPage[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_docs")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return DEFAULT_DOCS;
    return data as DocPage[];
  } catch {
    return DEFAULT_DOCS;
  }
}

export async function getDocBySlug(slug: string): Promise<DocPage | null> {
  const docs = await getDocs();
  return docs.find((d) => d.slug === slug) ?? null;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_products")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return DEFAULT_PRODUCTS;
    return data as Product[];
  } catch {
    return DEFAULT_PRODUCTS;
  }
}

export async function getCards(section: SiteCard["section"]): Promise<SiteCard[]> {
  const defaults = DEFAULT_CARDS.filter((c) => c.section === section);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_cards")
      .select("*")
      .eq("section", section)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return defaults;
    return data as SiteCard[];
  } catch {
    return defaults;
  }
}
export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  published: boolean;
  published_at: string | null;
};

export async function getPosts(): Promise<Post[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error || !data) return [];
    return data as Post[];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error || !data) return null;
    return data as Post;
  } catch {
    return null;
  }
}

export async function getLinks(group: SiteLink["group"]): Promise<SiteLink[]> {
  const defaults = DEFAULT_LINKS.filter((l) => l.group === group);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_links")
      .select("*")
      .eq("group", group)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return defaults;
    return data as SiteLink[];
  } catch {
    return defaults;
  }
}
