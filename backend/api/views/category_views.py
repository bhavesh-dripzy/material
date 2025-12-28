from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.services.category_service import CategoryService
from api.serializers.category_serializer import CategorySerializer


class CategoryListView(APIView):
    """
    API endpoint to list all active categories with product counts
    GET /api/categories/
    """
    
    def get(self, request):
        """Get all active categories"""
        try:
            categories = CategoryService.get_active_categories_with_product_count()
            serializer = CategorySerializer(categories, many=True)
            
            return Response({
                'success': True,
                'count': len(categories),
                'results': serializer.data
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

