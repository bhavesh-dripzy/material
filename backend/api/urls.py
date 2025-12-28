from django.urls import path
# Import legacy views from legacy_views.py
from .legacy_views import api_root, health_check
# Import new class-based views from views package
from .views import CategoryListView, ProductListView, ProductDetailView

app_name = 'api'

urlpatterns = [
    path('', api_root, name='api-root'),
    path('health/', health_check, name='health-check'),
    
    # Category APIs
    path('categories/', CategoryListView.as_view(), name='category-list'),
    
    # Product APIs
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:product_id>/', ProductDetailView.as_view(), name='product-detail'),
]
