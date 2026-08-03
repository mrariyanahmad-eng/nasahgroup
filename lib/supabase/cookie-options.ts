/**
 * Shared cookie settings for Supabase Auth. Setting `domain` to the
 * root domain (with a leading dot) is what makes a login on
 * nasahgroup.com also work on dashboard.nasahgroup.com,
 * developer.nasahgroup.com, etc., once those apps exist — as long as
 * they point at this same Supabase project (same URL + anon key) and
 * use this same cookie config.
 *
 * Left undefined in development so cookies work normally on localhost.
 */
export const authCookieOptions = {
  domain: process.env.NODE_ENV === "production" ? ".nasahgroup.com" : undefined,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};
