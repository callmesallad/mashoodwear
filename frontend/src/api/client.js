/**
 * Thin fetch wrapper for the Mashhoodwear API.
 * Vite dev server proxies /api to the backend.
 */

/**
 * @template T
 * @param {string} path
 * @param {RequestInit} [options]
 * @returns {Promise<T>}
 */
export async function fetchJson(path, options = {}) {
  const response = await fetch(path, options);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

/**
 * @returns {Promise<import('../types').HomeSettings>}
 */
export function getHomeSettings() {
  return fetchJson("/api/settings/home");
}

/**
 * @returns {Promise<import('../types').CheckoutSettings>}
 */
export function getCheckoutSettings() {
  return fetchJson("/api/settings/checkout");
}

/**
 * @param {{
 *   featured?: boolean,
 *   limit?: number,
 *   page?: number,
 *   category?: string,
 *   size?: string,
 *   color?: string,
 *   minPrice?: number,
 *   maxPrice?: number,
 *   search?: string,
 *   collection?: string,
 *   signal?: AbortSignal
 * }} params
 * @returns {Promise<import('../types').ProductsResponse>}
 */
export function getProducts(params = {}) {
  const { signal, ...queryParams } = params;
  const search = new URLSearchParams();
  if (queryParams.featured) {
    search.set("featured", "true");
  }
  if (queryParams.limit) {
    search.set("limit", String(queryParams.limit));
  }
  if (queryParams.page) {
    search.set("page", String(queryParams.page));
  }
  if (queryParams.category) {
    search.set("category", queryParams.category);
  }
  if (queryParams.size) {
    search.set("size", queryParams.size);
  }
  if (queryParams.color) {
    search.set("color", queryParams.color);
  }
  if (queryParams.minPrice !== undefined && queryParams.minPrice !== null) {
    search.set("minPrice", String(queryParams.minPrice));
  }
  if (queryParams.maxPrice !== undefined && queryParams.maxPrice !== null) {
    search.set("maxPrice", String(queryParams.maxPrice));
  }
  if (queryParams.search) {
    search.set("search", queryParams.search);
  }
  if (queryParams.collection) {
    search.set("collection", queryParams.collection);
  }
  const query = search.toString();
  return fetchJson(`/api/products${query ? `?${query}` : ""}`, { signal });
}

/**
 * @returns {Promise<import('../types').CategoriesResponse>}
 */
export function getCategories() {
  return fetchJson("/api/categories");
}

/**
 * @param {string} slug
 * @returns {Promise<import('../types').ProductDetailResponse | import('../types').ProductNotFoundResponse>}
 */
export async function getProductBySlug(slug) {
  const response = await fetch(`/api/products/${encodeURIComponent(slug)}`);
  const body = await response.json();

  if (response.status === 404) {
    return { ok: false, notFound: true };
  }

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return body;
}

/**
 * @returns {Promise<import('../types').CollectionsResponse>}
 */
export function getCollections() {
  return fetchJson("/api/collections");
}

/**
 * @param {string} slug
 * @returns {Promise<import('../types').CollectionDetailResponse | import('../types').CollectionNotFoundResponse>}
 */
export async function getCollectionBySlug(slug) {
  const response = await fetch(`/api/collections/${encodeURIComponent(slug)}`);
  const body = await response.json();

  if (response.status === 404) {
    return { ok: false, notFound: true };
  }

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return body;
}
