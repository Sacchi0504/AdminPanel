import apiClient from '@/lib/axios';
import { Category } from '@/types/product';

/**
 * Fetches all available product categories from DummyJSON
 * Endpoint: GET /products/categories
 */
export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<Array<Category | string>>('/products/categories');
  const data = response.data;

  // Normalize response: DummyJSON v2 returns objects { slug, name, url }, older returned strings
  return data.map((item) => {
    if (typeof item === 'string') {
      return {
        slug: item,
        name: item.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      };
    }
    return {
      slug: item.slug,
      name: item.name,
      url: item.url,
    };
  });
}
