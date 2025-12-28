from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.paginator import Paginator
from api.services.product_service import ProductService
from api.services.category_service import CategoryService
from api.serializers.product_serializer import ProductListSerializer, ProductDetailSerializer


class ProductListView(APIView):
    """
    API endpoint to list products filtered by category
    GET /api/products/?category_id=1&page=1&page_size=20
    """
    
    def get(self, request):
        """Get products list with optional category filter"""
        try:
            category_id = request.query_params.get('category_id')
            page = int(request.query_params.get('page', 1))
            page_size = int(request.query_params.get('page_size', 20))
            
            # Validate page_size (max 100)
            page_size = min(page_size, 100)
            
            if category_id:
                # Verify category exists
                category = CategoryService.get_category_by_id(category_id)
                if not category:
                    return Response({
                        'success': False,
                        'error': 'Category not found'
                    }, status=status.HTTP_404_NOT_FOUND)
                
                # Get products by category
                products = ProductService.get_products_by_category(
                    category_id, page, page_size
                )
                total_count = ProductService.get_product_count_by_category(category_id)
            else:
                # Get all products
                products = ProductService.get_all_active_products(page, page_size)
                total_count = ProductService.get_total_product_count()
            
            serializer = ProductListSerializer(products, many=True)
            
            # Calculate pagination info
            total_pages = (total_count + page_size - 1) // page_size
            
            return Response({
                'success': True,
                'count': total_count,
                'page': page,
                'page_size': page_size,
                'total_pages': total_pages,
                'has_next': page < total_pages,
                'has_previous': page > 1,
                'results': serializer.data
            }, status=status.HTTP_200_OK)
        
        except ValueError as e:
            return Response({
                'success': False,
                'error': f'Invalid parameter: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProductDetailView(APIView):
    """
    API endpoint to get product details
    GET /api/products/{product_id}/
    """
    
    def get(self, request, product_id):
        """Get product details by ID"""
        try:
            product = ProductService.get_product_by_id(product_id)
            
            if not product:
                return Response({
                    'success': False,
                    'error': 'Product not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            serializer = ProductDetailSerializer(product)
            
            return Response({
                'success': True,
                'result': serializer.data
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

