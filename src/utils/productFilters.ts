import { Product } from '@/types/product';

/**
 * Non-vegetarian ingredient and keyword identifiers for grocery/food products.
 */
const NON_VEG_KEYWORDS = [
  'meat',
  'beef',
  'chicken',
  'pork',
  'fish',
  'seafood',
  'egg',
  'eggs',
  'steak',
  'mutton',
  'lamb',
  'bacon',
  'sausage',
  'tuna',
  'salmon',
  'prawn',
  'shrimp',
  'crab',
  'lobster',
  'turkey',
  'duck',
];

/**
 * Checks whether a product is a non-vegetarian food item.
 * Excludes non-food accessories (e.g., 'Egg Slicer').
 */
export function isNonVegetarian(product: Product): boolean {
  if (!product) return false;

  const category = (product.category || '').toLowerCase();
  const tags = (product.tags || []).map((t) => t.toLowerCase());
  const title = (product.title || '').toLowerCase();

  // Only food / groceries items
  const isFoodCategory = category === 'groceries' || tags.includes('meat') || tags.includes('seafood');

  if (!isFoodCategory) {
    return false;
  }

  // Check title words
  const titleMatches = NON_VEG_KEYWORDS.some((keyword) => {
    const regex = new RegExp(`\\b${keyword}s?\\b`, 'i');
    return regex.test(title);
  });

  if (titleMatches) {
    return true;
  }

  // Check tags
  const tagMatches = tags.some((tag) =>
    NON_VEG_KEYWORDS.some((keyword) => tag.includes(keyword))
  );

  return tagMatches;
}

/**
 * Filters out non-vegetarian products from a list.
 */
export function filterVegetarianOnly(products: Product[]): Product[] {
  return products.filter((p) => !isNonVegetarian(p));
}
