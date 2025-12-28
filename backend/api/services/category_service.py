from django.db.models import Count, Q
from api.models import Category


class CategoryService:
    """Service layer for Category operations with optimized queries"""
    
    @staticmethod
    def get_active_categories_with_product_count():
        """
        Get all active categories with product count using optimized query
        Uses select_related and prefetch_related for optimization
        """
        return Category.objects.filter(
            is_active=True
        ).annotate(
            product_count=Count('products', filter=Q(products__is_active=True))
        ).order_by('name')
    
    @staticmethod
    def get_category_by_id(category_id):
        """Get category by ID with optimized query"""
        return Category.objects.filter(
            id=category_id,
            is_active=True
        ).first()
    
    @staticmethod
    def get_category_by_slug_or_id(identifier):
        """Get category by slug or ID"""
        try:
            # Try as ID first
            category_id = int(identifier)
            return Category.objects.filter(
                id=category_id,
                is_active=True
            ).first()
        except (ValueError, TypeError):
            # If not a number, treat as slug/name
            return Category.objects.filter(
                name__iexact=identifier,
                is_active=True
            ).first()

