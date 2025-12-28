// API Service for BuildQuick Backend

// Get API base URL from environment variable or use default
const getApiBaseUrl = () => {
  // Check for VITE_API_BASE_URL environment variable
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl;
  }
  // Default to localhost for development
  return 'http://localhost:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

// API Response Types
export interface ApiCategory {
  id: number;
  name: string;
  url: string | null;
  image_url: string | null;
  product_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiProduct {
  id: number;
  title: string;
  category: {
    id: number;
    name: string;
    image_url: string | null;
  };
  price: string;
  price_display: string | null;
  image_url: string | null;
  main_image: string | null;
  availability: string;
  url: string | null;
  is_active: boolean;
  // Detail fields
  product_id?: string | null;
  variant_id?: string | null;
  description_text?: string | null;
  images?: string[];
  specifications?: Record<string, string>;
  formatted_price?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  results?: T[];
  result?: T;
  error?: string;
  page?: number;
  page_size?: number;
  total_pages?: number;
  has_next?: boolean;
  has_previous?: boolean;
}

// API Service Class
class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.log('API Request:', url);
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Request URL was:', `${this.baseUrl}${endpoint}`);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Category APIs
  async getCategories(): Promise<ApiResponse<ApiCategory>> {
    return this.request<ApiCategory>('/categories/');
  }

  // Product APIs
  async getProducts(categoryId?: number, page: number = 1, pageSize: number = 20): Promise<ApiResponse<ApiProduct>> {
    const params = new URLSearchParams();
    if (categoryId) {
      params.append('category_id', categoryId.toString());
    }
    params.append('page', page.toString());
    params.append('page_size', pageSize.toString());

    return this.request<ApiProduct>(`/products/?${params.toString()}`);
  }

  async getProductDetail(productId: number): Promise<ApiResponse<ApiProduct>> {
    return this.request<ApiProduct>(`/products/${productId}/`);
  }
}

export const apiService = new ApiService();

