from django.db.models import Q, Prefetch
from api.models import Product, Category


class ProductService:
    """Service layer for Product operations with optimized queries"""
    
    @staticmethod
    def get_products_by_category(category_id, page=1, page_size=20):
        """
        Get products by category with optimized query
        Uses select_related for category to avoid N+1 queries
        """
        offset = (page - 1) * page_size
        
        return Product.objects.filter(
            category_id=category_id,
            is_active=True
        ).select_related(
            'category'
        ).order_by(
            '-created_at'
        )[offset:offset + page_size]
    
    @staticmethod
    def get_product_by_id(product_id):
        """
        Get product by ID with optimized query
        Uses select_related for category
        """
        return Product.objects.filter(
            id=product_id,
            is_active=True
        ).select_related(
            'category'
        ).first()
    
    @staticmethod
    def get_all_active_products(page=1, page_size=20):
        """
        Get all active products with optimized query
        """
        offset = (page - 1) * page_size
        
        return Product.objects.filter(
            is_active=True
        ).select_related(
            'category'
        ).order_by(
            '-created_at'
        )[offset:offset + page_size]
    
    @staticmethod
    def get_total_product_count():
        """Get total count of active products"""
        return Product.objects.filter(is_active=True).count()
    
    @staticmethod
    def search_products(query, page=1, page_size=20):
        """
        Search products by title with optimized query
        """
        offset = (page - 1) * page_size
        
        return Product.objects.filter(
            Q(title__icontains=query) | Q(description_text__icontains=query),
            is_active=True
        ).select_related(
            'category'
        ).order_by(
            '-created_at'
        )[offset:offset + page_size]
    
    @staticmethod
    def get_product_count_by_category(category_id):
        """Get product count for a category"""
        return Product.objects.filter(
            category_id=category_id,
            is_active=True
        ).count()

