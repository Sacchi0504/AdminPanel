/**
 * Helpers for preserving dashboard pagination and filter state across page transitions.
 */

const STORAGE_KEY_CATALOG_QUERY = 'admin_last_catalog_query';

/**
 * Saves current catalog query string (e.g. "?page=2&pageSize=10") to sessionStorage.
 */
export function saveCatalogQuery(queryString: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY_CATALOG_QUERY, queryString || '');
  } catch {}
}

/**
 * Retrieves the last saved catalog query string.
 * Falls back to URL search if available, or empty string.
 */
export function getCatalogQuery(currentSearchParams?: URLSearchParams | null): string {
  if (currentSearchParams && currentSearchParams.toString()) {
    return `?${currentSearchParams.toString()}`;
  }

  if (typeof window !== 'undefined') {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_CATALOG_QUERY);
      if (saved) return saved.startsWith('?') ? saved : `?${saved}`;
    } catch {}
  }

  return '';
}

/**
 * Returns full return URL to products dashboard preserving exact page, pageSize, search, etc.
 */
export function getCatalogReturnUrl(currentSearchParams?: URLSearchParams | null): string {
  const query = getCatalogQuery(currentSearchParams);
  return `/products${query}`;
}
