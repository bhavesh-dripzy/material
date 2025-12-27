# Install deps
# !pip install -q requests beautifulsoup4

import os
import sys
import django
import requests
import json
import time
import re
from decimal import Decimal
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import urllib3

# Disable SSL warnings for development
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Setup Django environment
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# Import Django models
from api.models import Category, Product

BASE_URL = "https://home-run.co"
HEADERS = {"User-Agent": "Mozilla/5.0"}

# Helper functions for database operations
def parse_price(price_str):
    """Convert price string like 'Rs. 330.00' to Decimal"""
    if not price_str:
        return None
    
    # Remove common currency symbols and text
    price_str = str(price_str).strip()
    
    # Remove currency symbols (Rs., ₹, $, etc.)
    price_str = re.sub(r'[Rr][Ss]\.?\s*', '', price_str)
    price_str = re.sub(r'₹\s*', '', price_str)
    price_str = re.sub(r'\$\s*', '', price_str)
    price_str = re.sub(r'[A-Za-z:]+', '', price_str)  # Remove any remaining text
    
    # Remove commas and whitespace
    price_str = price_str.replace(',', '').strip()
    
    # Extract numeric value (including decimal)
    # Match: digits, optional decimal point, optional more digits
    match = re.search(r'(\d+\.?\d*)', price_str)
    if match:
        try:
            return Decimal(match.group(1))
        except (ValueError, TypeError):
            return None
    
    return None

def map_availability(availability_str):
    """Map availability string to model choices"""
    if not availability_str:
        return 'in_stock'
    availability_lower = availability_str.lower()
    if 'out of stock' in availability_lower or 'unavailable' in availability_lower:
        return 'out_of_stock'
    elif 'limited' in availability_lower:
        return 'limited'
    else:
        return 'in_stock'

def get_or_create_category(category_data):
    """Get or create category in database"""
    category, created = Category.objects.get_or_create(
        name=category_data['category_name'],
        defaults={
            'url': category_data.get('category_url'),
            'image_url': category_data.get('image_url'),
            'is_active': True
        }
    )
    # Update if exists
    if not created:
        category.url = category_data.get('category_url', category.url)
        category.image_url = category_data.get('image_url', category.image_url)
        category.save()
    return category

def create_or_update_product(category, product_data):
    """Create or update product in database"""
    product_details = product_data.get('product_details', {})
    product_id = product_details.get('product_id')
    price = parse_price(product_data.get('price'))
    
    if not price:
        print(f"⚠️  Skipping {product_data.get('product_title')} - No valid price")
        return None
    
    # Clean description text to handle emoji encoding issues
    description_text = product_details.get('description_text', '')
    if description_text:
        try:
            # Remove emojis and other problematic unicode characters
            import re
            # Remove emoji ranges
            emoji_pattern = re.compile("["
                u"\U0001F600-\U0001F64F"  # emoticons
                u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                u"\U0001F680-\U0001F6FF"  # transport & map symbols
                u"\U0001F1E0-\U0001F1FF"  # flags
                u"\U00002702-\U000027B0"
                u"\U000024C2-\U0001F251"
                u"\U0001F900-\U0001F9FF"  # supplemental symbols
                "]+", flags=re.UNICODE)
            description_text = emoji_pattern.sub(r'', description_text)
            # Clean up any remaining problematic characters
            description_text = description_text.encode('utf-8', errors='ignore').decode('utf-8')
            # Remove extra whitespace
            description_text = ' '.join(description_text.split())
        except Exception as e:
            print(f"    ⚠️  Description cleaning failed: {str(e)[:50]}")
            description_text = ''
    
    defaults = {
        'title': product_data.get('product_title'),
        'category': category,
        'url': product_data.get('product_url'),
        'image_url': product_data.get('image_url'),
        'price': price,
        'price_display': product_data.get('price'),
        'availability': map_availability(product_details.get('availability')),
        'variant_id': product_details.get('variant_id'),
        'description_text': description_text,
        'images': product_details.get('images', []),
        'specifications': product_details.get('specifications', {}),
        'is_active': True
    }
    
    if product_id:
        product, created = Product.objects.update_or_create(
            product_id=product_id,
            defaults=defaults
        )
    else:
        # If no product_id, try to match by title and category
        product, created = Product.objects.get_or_create(
            title=product_data.get('product_title'),
            category=category,
            defaults=defaults
        )
        if not created:
            # Update existing product
            for key, value in defaults.items():
                setattr(product, key, value)
            product.save()
    
    return product

def get_soup(url, retries=3):
    """Get BeautifulSoup object from URL with retry logic"""
    for attempt in range(retries):
        try:
            r = requests.get(url, headers=HEADERS, timeout=30, verify=False)
            r.raise_for_status()
            return BeautifulSoup(r.text, "html.parser")
        except (requests.exceptions.SSLError, requests.exceptions.RequestException) as e:
            if attempt < retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
                continue
            else:
                print(f"    ⚠️  Failed to fetch {url} after {retries} attempts: {str(e)[:50]}")
                raise

# ---------------------------------
# Product detail scraper
# ---------------------------------
def scrape_product_details(product_url):
    soup = get_soup(product_url)

    availability = soup.select_one(".product__inventory")
    availability = availability.get_text(strip=True) if availability else None

    variant_id = soup.select_one("input.product-variant-id")
    variant_id = variant_id["value"] if variant_id else None

    product_id = soup.select_one("input[name='product-id']")
    product_id = product_id["value"] if product_id else None

    images = []
    for img in soup.select("ul.product__media-list img"):
        src = img.get("src")
        if src:
            if src.startswith("//"):
                src = "https:" + src
            images.append(src)
    images = list(dict.fromkeys(images))

    desc_div = soup.select_one("div.product__description")
    description_html = str(desc_div) if desc_div else None
    description_text = desc_div.get_text("\n", strip=True) if desc_div else None

    specs = {}
    if desc_div:
        for li in desc_div.select("li"):
            strong = li.select_one("strong")
            if strong:
                key = strong.get_text(strip=True).replace(":", "")
                value = li.get_text(strip=True).replace(strong.get_text(strip=True), "").strip()
                specs[key] = value

    return {
        "availability": availability,
        "product_id": product_id,
        "variant_id": variant_id,
        "images": images,
        "description_text": description_text,
        "specifications": specs
    }

# ---------------------------------
# Step 1: Categories
# ---------------------------------
home = get_soup(BASE_URL)
categories_map = {}

for item in home.select("a.mhp-menu-item"):
    url = urljoin(BASE_URL, item.get("href"))
    name = item.select_one(".mhp-title div")
    img = item.select_one("img")

    if url and name:
        categories_map[url] = {
            "category_name": name.get_text(strip=True),
            "category_url": url,
            "image_url": "https:" + img["src"] if img and img["src"].startswith("//") else img["src"],
            "products": []
        }

categories = list(categories_map.values())
print("Categories:", len(categories))

# ---------------------------------
# Step 2: Products + nested details + Database Save
# ---------------------------------
# Option: Skip categories that already have products (set to True to skip)
SKIP_CATEGORIES_WITH_PRODUCTS = False

for cat in categories:
    print(f"🔍 {cat['category_name']}")
    
    # Save category to database
    category_obj = get_or_create_category(cat)
    
    # Skip if category already has products and SKIP_CATEGORIES_WITH_PRODUCTS is True
    if SKIP_CATEGORIES_WITH_PRODUCTS and category_obj.products.exists():
        print(f"  ⏭️  Skipping {category_obj.name} (already has {category_obj.products.count()} products)")
        continue
    
    print(f"  ✅ Category saved: {category_obj.name}")
    
    page = 1
    seen = {}
    products_saved = 0

    while True:
        soup = get_soup(f"{cat['category_url']}?page={page}")
        cards = soup.select("div.card-wrapper.product-card-wrapper")
        if not cards:
            break

        for card in cards:
            title_a = card.select_one(".card__heading a")
            if not title_a:
                continue

            product_title = title_a.get_text(strip=True)
            product_url = urljoin(BASE_URL, title_a["href"])

            if product_url in seen:
                continue

            img = card.select_one(".card__media img")
            img_url = img.get("src") if img else None
            if img_url and img_url.startswith("//"):
                img_url = "https:" + img_url

            price_tag = card.select_one(".price-item--regular")
            price = price_tag.get_text(strip=True) if price_tag else None

            # 🔥 Fetch product detail page
            product_details = scrape_product_details(product_url)

            product_data = {
                "product_title": product_title,
                "product_url": product_url,
                "price": price,
                "image_url": img_url,
                "product_details": product_details
            }
            
            seen[product_url] = product_data
            
            # Save product to database
            try:
                product_obj = create_or_update_product(category_obj, product_data)
                if product_obj:
                    products_saved += 1
                    print(f"    ✓ {product_title[:50]}...")
            except Exception as e:
                print(f"    ✗ Error saving {product_title[:50]}: {str(e)}")

            time.sleep(0.3)

        page += 1

    cat["products"] = list(seen.values())
    print(f"  📊 Saved {products_saved} products for {cat['category_name']}")

# ---------------------------------
# Save JSON (optional - for backup/reference)
# ---------------------------------
json_output_path = os.path.join(os.path.dirname(__file__), "home_run_catalog_nested.json")
with open(json_output_path, "w", encoding="utf-8") as f:
    json.dump(categories, f, indent=2, ensure_ascii=False)

print(f"✅ JSON saved → {json_output_path}")

# ---------------------------------
# Database Summary
# ---------------------------------
total_categories = Category.objects.filter(is_active=True).count()
total_products = Product.objects.filter(is_active=True).count()
print(f"\n📊 Database Summary:")
print(f"   Categories: {total_categories}")
print(f"   Products: {total_products}")
print("✅ DONE - All data saved to database!")
