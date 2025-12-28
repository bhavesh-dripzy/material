// Utility to map API Product to Frontend Product type
import { Product } from '../types';
import { ApiProduct } from '../services/api';

export const mapApiProductToProduct = (apiProduct: ApiProduct): Product => {
  // Extract price as number
  const price = parseFloat(apiProduct.price) || 0;
  
  // Use main_image or image_url, fallback to first image in images array
  const image = apiProduct.main_image || 
                apiProduct.image_url || 
                (apiProduct.images && apiProduct.images.length > 0 ? apiProduct.images[0] : '') ||
                'https://via.placeholder.com/300';

  return {
    id: apiProduct.id.toString(),
    name: apiProduct.title,
    category: apiProduct.category.name.toLowerCase().replace(/\s+/g, '-'),
    price: price,
    originalPrice: price, // API doesn't provide original price, using same as price
    unit: '', // API doesn't provide unit, will need to extract from title or description
    image: image,
    brand: '', // API doesn't provide brand, will need to extract from title
    rating: undefined,
    ratingCount: undefined,
    deliveryTime: '60 MINS', // Default delivery time
    discount: undefined,
  };
};

export const mapApiProductsToProducts = (apiProducts: ApiProduct[]): Product[] => {
  return apiProducts.map(mapApiProductToProduct);
};

