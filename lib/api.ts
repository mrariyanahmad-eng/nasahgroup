/**
 * Shared API client for the Nasah ecosystem.
 *
 * Every product surface (apps.nasahgroup.com, dashboard.nasahgroup.com,
 * developer.nasahgroup.com, etc.) should call through this client instead
 * of hitting `fetch` directly, so that:
 *   - auth headers are attached consistently
 *   - errors have one shape across the whole ecosystem
 *   - the API base URL can move (staging / prod / preview) via env vars only
 *
 * Point NEXT_PUBLIC_API_BASE_URL at api.nasahgroup.com (or a per-env
 * equivalent) in .env.local. See .env.example.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.nasahgroup.com";

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Auth token for the current session. Wire this up to your auth provider. */
  token?: string;
  /** Skip the default JSON content-type header (e.g. for file uploads). */
  rawBody?: boolean;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, token, rawBody, headers, ...rest } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(rawBody ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? (rawBody ? (body as BodyInit) : JSON.stringify(body)) : undefined,
    // Products behind auth should override this per-call as needed.
    cache: "no-store",
  });

  if (!res.ok) {
    let message = res.statusText;
    let code: string | undefined;
    try {
      const errBody = await res.json();
      message = errBody.message ?? message;
      code = errBody.code;
    } catch {
      // response wasn't JSON — fall back to statusText
    }
    throw new ApiError(message, res.status, code);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};

/* ---------------------------------------------------------------------
 * api.nasahgroup.com is now live (see the separate nasah-api project).
 * The website itself (this app) still reads products/posts directly
 * from Supabase via lib/site-data.ts — that's intentional, it avoids
 * an extra network hop for data this app already has direct access to.
 * This client (api.get/post/...) is for OTHER apps/services that don't
 * have their own Supabase connection and need to go through the API
 * instead, e.g. api.get<{ data: Product[] }>("/v1/products").
 * ------------------------------------------------------------------- */
export type ProductStatus = "live" | "beta" | "soon";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: ProductStatus;
  href: string;
}
