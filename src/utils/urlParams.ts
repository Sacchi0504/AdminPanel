import { ProductFilterParams, SortField, SortOrder } from '@/types/product';

export const ALLOWED_PAGE_SIZES = [10, 20, 50] as const;
export const DEFAULT_PAGE_SIZE = 20;

export const ALLOWED_SORT_FIELDS: SortField[] = ['price', 'rating', 'title'];
export const ALLOWED_SORT_ORDERS: SortOrder[] = ['asc', 'desc'];

export interface RawSearchParams {
  page?: string | string[];
  pageSize?: string | string[];
  search?: string | string[];
  category?: string | string[];
  sort?: string | string[];
  order?: string | string[];
}

/**
 * Parses and sanitizes URL search parameters into safe typed values.
 * Handles edge cases like ?page=abc, ?page=-5, ?pageSize=7, ?sort=invalid
 */
export function parseFilterParams(searchParams: URLSearchParams | RawSearchParams): ProductFilterParams {
  const getParam = (key: string): string => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) || '';
    }
    const val = searchParams[key as keyof RawSearchParams];
    if (Array.isArray(val)) return val[0] || '';
    return val || '';
  };

  // 1. Sanitize Page
  const rawPage = parseInt(getParam('page'), 10);
  const page = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;

  // 2. Sanitize Page Size
  const rawPageSize = parseInt(getParam('pageSize'), 10);
  const pageSize = (ALLOWED_PAGE_SIZES as readonly number[]).includes(rawPageSize)
    ? rawPageSize
    : DEFAULT_PAGE_SIZE;

  // 3. Sanitize Search
  const search = getParam('search').trim();

  // 4. Sanitize Category
  const category = getParam('category').trim();

  // 5. Sanitize Sort Field
  const rawSort = getParam('sort').toLowerCase() as SortField;
  const sort = ALLOWED_SORT_FIELDS.includes(rawSort) ? rawSort : '';

  // 6. Sanitize Sort Order
  const rawOrder = getParam('order').toLowerCase() as SortOrder;
  const order = ALLOWED_SORT_ORDERS.includes(rawOrder) ? rawOrder : 'asc';

  return {
    page,
    pageSize,
    search,
    category,
    sort,
    order,
  };
}

/**
 * Builds clean URL search string omitting default/empty parameters
 */
export function buildFilterQueryString(params: Partial<ProductFilterParams>): string {
  const sp = new URLSearchParams();

  if (params.page && params.page > 1) {
    sp.set('page', params.page.toString());
  }

  if (params.pageSize && params.pageSize !== DEFAULT_PAGE_SIZE) {
    sp.set('pageSize', params.pageSize.toString());
  }

  if (params.search && params.search.trim()) {
    sp.set('search', params.search.trim());
  }

  if (params.category && params.category.trim()) {
    sp.set('category', params.category.trim());
  }

  if (params.sort) {
    sp.set('sort', params.sort);
    if (params.order) {
      sp.set('order', params.order);
    }
  }

  const query = sp.toString();
  return query ? `?${query}` : '';
}
