import apiClient from '@/lib/axios';
import { Product, ProductsResponse, SortField, SortOrder } from '@/types/product';
import { GenericAbortSignal } from 'axios';

export interface FetchProductsParams {
  limit?: number;
  skip?: number;
  sortBy?: SortField;
  order?: SortOrder;
  delay?: number;
  signal?: GenericAbortSignal;
}

export interface SearchProductsParams extends FetchProductsParams {
  q: string;
}

export interface CategoryProductsParams extends FetchProductsParams {
  category: string;
}

/**
 * Fetches paginated products with optional sorting
 * Endpoint: GET /products
 */
export async function getProducts(params?: FetchProductsParams): Promise<ProductsResponse> {
  const queryParams: Record<string, string | number> = {
    limit: params?.limit ?? 20,
    skip: params?.skip ?? 0,
  };

  if (params?.sortBy) {
    queryParams.sortBy = params.sortBy;
    queryParams.order = params.order || 'asc';
  }

  if (params?.delay) {
    queryParams.delay = params.delay;
  }

  const response = await apiClient.get<ProductsResponse>('/products', {
    params: queryParams,
    signal: params?.signal,
  });

  return response.data;
}

/**
 * Searches products by query term with optional sorting
 * Endpoint: GET /products/search?q=...
 */
export async function searchProducts(params: SearchProductsParams): Promise<ProductsResponse> {
  const queryParams: Record<string, string | number> = {
    q: params.q,
    limit: params.limit ?? 20,
    skip: params.skip ?? 0,
  };

  if (params.sortBy) {
    queryParams.sortBy = params.sortBy;
    queryParams.order = params.order || 'asc';
  }

  if (params.delay) {
    queryParams.delay = params.delay;
  }

  const response = await apiClient.get<ProductsResponse>('/products/search', {
    params: queryParams,
    signal: params.signal,
  });

  return response.data;
}

/**
 * Filters products by category with optional sorting
 * Endpoint: GET /products/category/:category
 */
export async function getProductsByCategory(params: CategoryProductsParams): Promise<ProductsResponse> {
  const queryParams: Record<string, string | number> = {
    limit: params.limit ?? 20,
    skip: params.skip ?? 0,
  };

  if (params.sortBy) {
    queryParams.sortBy = params.sortBy;
    queryParams.order = params.order || 'asc';
  }

  if (params.delay) {
    queryParams.delay = params.delay;
  }

  const response = await apiClient.get<ProductsResponse>(
    `/products/category/${encodeURIComponent(params.category)}`,
    {
      params: queryParams,
      signal: params.signal,
    }
  );

  return response.data;
}

/**
 * Retrieves a single product by ID
 * Endpoint: GET /products/:id
 */
export async function getProduct(id: number | string): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
}

/**
 * Creates a new product (Simulated mutation on DummyJSON)
 * Endpoint: POST /products/add
 */
export async function createProduct(data: Partial<Product>): Promise<Product> {
  const response = await apiClient.post<Product>('/products/add', data);
  return response.data;
}

/**
 * Updates an existing product (Simulated mutation on DummyJSON)
 * Endpoint: PUT /products/:id
 */
export async function updateProduct(id: number | string, data: Partial<Product>): Promise<Product> {
  const response = await apiClient.put<Product>(`/products/${id}`, data);
  return response.data;
}

/**
 * Deletes a product (Simulated mutation on DummyJSON)
 * Endpoint: DELETE /products/:id
 */
export async function deleteProduct(id: number | string): Promise<Product> {
  const response = await apiClient.delete<Product>(`/products/${id}`);
  return response.data;
}
