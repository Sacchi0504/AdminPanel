export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductMeta {
  createdAt?: string;
  updatedAt?: string;
  barcode?: string;
  qrCode?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: ProductReview[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: ProductMeta;
  images?: string[];
  thumbnail?: string;
  isDeleted?: boolean;
  deletedOn?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url?: string;
}

export type SortField = 'price' | 'rating' | 'title' | '';
export type SortOrder = 'asc' | 'desc';

export interface ProductFormData {
  title: string;
  description: string;
  price: number | '';
  category: string;
  stock: number | '';
  brand?: string;
  thumbnail?: string;
}

export interface ProductFilterParams {
  page: number;
  pageSize: number;
  search: string;
  category: string;
  sort: SortField;
  order: SortOrder;
}
