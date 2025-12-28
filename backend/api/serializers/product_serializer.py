from rest_framework import serializers
from api.models import Product, Category


class CategoryBasicSerializer(serializers.ModelSerializer):
    """Basic category info for product serializers"""
    class Meta:
        model = Category
        fields = ['id', 'name', 'image_url']


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer for Product list (optimized for listing)"""
    category = CategoryBasicSerializer(read_only=True)
    main_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id',
            'title',
            'category',
            'price',
            'price_display',
            'image_url',
            'main_image',
            'availability',
            'url',
            'is_active',
        ]
        read_only_fields = ['id']
    
    def get_main_image(self, obj):
        """Return main image URL"""
        return obj.main_image


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer for Product detail (includes all fields)"""
    category = CategoryBasicSerializer(read_only=True)
    main_image = serializers.SerializerMethodField()
    formatted_price = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id',
            'title',
            'category',
            'url',
            'image_url',
            'main_image',
            'price',
            'price_display',
            'formatted_price',
            'availability',
            'product_id',
            'variant_id',
            'description_text',
            'images',
            'specifications',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_main_image(self, obj):
        """Return main image URL"""
        return obj.main_image

