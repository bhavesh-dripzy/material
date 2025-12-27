from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET'])
def api_root(request):
    """
    API root endpoint.
    """
    return Response({
        'message': 'BuildQuick API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health/',
        }
    })


@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint.
    """
    return Response({
        'status': 'healthy',
        'message': 'API is running'
    }, status=status.HTTP_200_OK)

