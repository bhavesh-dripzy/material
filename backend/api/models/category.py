from django.db import models
from django.urls import reverse


class Category(models.Model):
    """
    Category model for organizing products
    """
    name = models.CharField(
        max_length=255,
        unique=True,
        help_text="Category name (e.g., Cement, Steel, etc.)"
    )
    url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        help_text="Category URL from source website"
    )
    image_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        help_text="Category image URL"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(
        default=True,
        help_text="Whether the category is active and visible"
    )

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ['name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('api:category-detail', kwargs={'pk': self.pk})

