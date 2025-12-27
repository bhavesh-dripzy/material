
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  unit: string;
  image: string;
  brand: string;
  rating?: number;
  ratingCount?: number;
  deliveryTime?: string;
  discount?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface CategoryGroup {
  title: string;
  categories: Category[];
}

export interface CartItem extends Product {
  quantity: number;
}

export enum AppTab {
  HOME = 'home',
  CATEGORIES = 'categories',
  SEARCH = 'search',
  CART = 'cart',
  ORDERS = 'orders',
  PRODUCTS = 'products'
}
