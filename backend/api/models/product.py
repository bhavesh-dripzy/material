from django.db import models
from django.urls import reverse
from django.core.validators import MinValueValidator
from decimal import Decimal


class Product(models.Model):
    """
    Product model for construction materials
    """
    AVAILABILITY_CHOICES = [
        ('in_stock', 'In stock'),
        ('out_of_stock', 'Out of stock'),
        ('limited', 'Limited stock'),
    ]

    # Basic Information
    title = models.CharField(
        max_length=500,
        help_text="Product title/name"
    )
    category = models.ForeignKey(
        'Category',
        on_delete=models.CASCADE,
        related_name='products',
        help_text="Category this product belongs to"
    )
    url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        help_text="Product URL from source website"
    )
    image_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        help_text="Main product image URL"
    )

    # Pricing
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Product price in rupees"
    )
    price_display = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Original price string (e.g., 'Rs. 330.00')"
    )

    # Product Details
    availability = models.CharField(
        max_length=20,
        choices=AVAILABILITY_CHOICES,
        default='in_stock',
        help_text="Product availability status"
    )
    product_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        unique=True,
        help_text="External product ID from source"
    )
    variant_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Product variant ID"
    )

    # Description
    description_text = models.TextField(
        blank=True,
        null=True,
        help_text="Product description in plain text"
    )

    # Images (stored as JSON)
    images = models.JSONField(
        default=list,
        blank=True,
        help_text="List of product image URLs"
    )

    # Specifications (stored as JSON for flexibility)
    specifications = models.JSONField(
        default=dict,
        blank=True,
        help_text="Product specifications as key-value pairs"
    )

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(
        default=True,
        help_text="Whether the product is active and visible"
    )

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['product_id']),
            models.Index(fields=['is_active']),
            models.Index(fields=['availability']),
            models.Index(fields=['price']),
        ]

    def __str__(self):
        return f"{self.title} - {self.category.name}"

    def get_absolute_url(self):
        return reverse('api:product-detail', kwargs={'pk': self.pk})

    @property
    def formatted_price(self):
        """Return formatted price string"""
        if self.price_display:
            return self.price_display
        return f"Rs. {self.price:.2f}"

    @property
    def main_image(self):
        """Return main image URL or first image from images list"""
        if self.image_url:
            return self.image_url
        if self.images and len(self.images) > 0:
            return self.images[0]
        return None

