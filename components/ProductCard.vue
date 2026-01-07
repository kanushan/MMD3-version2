<script setup>
import { useFavorites } from '~/composables/useFavorites';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const { toggleFavorite, isFavorite } = useFavorites();

const formatPrice = (price) => {
  return `${price.toFixed(2)} DKK`;
};

const toggleWishlist = () => {
  toggleFavorite(props.product);
};

const isProductFavorite = computed(() => isFavorite(props.product.id));
</script>

<template>
  <NuxtLink 
    :to="`/product/${product.slug}`" 
    class="product-card"
    :class="{ 'out-of-stack': !product.inStock }"
  >
    <div class="product-image">
      <img 
        v-if="product.BilledeMain" 
        :src="product.BilledeMain" 
        :alt="product.ModelNavn"
      >
      <div v-else class="placeholder-image">
        {{ product.ModelNavn?.charAt(0) || '?' }}
      </div>
      
      <div v-if="!product.inStock" class="stock-badge">Udsolgt</div>
      
      <button 
        class="wishlist-btn"
        :class="{ active: isProductFavorite }"
        aria-label="Tilføj til favoritter"
        @click.prevent="toggleWishlist"
      >
        <i class="fa-heart" :class="isProductFavorite ? 'fa-solid' : 'fa-regular'"></i>
      </button>
    </div>
    
    <div class="product-info">
      <div class="product-brand">{{ product.Mærke }}</div>
      <div class="product-name">{{ product.ModelNavn }}</div>
      <div class="product-price">{{ formatPrice(product.Pris) }}</div>
      
      <div v-if="product.colors && product.colors.length > 0" class="color-swatches">
        <div 
          v-for="(color, index) in product.colors" 
          :key="index"
          class="color-swatch"
          :style="{ backgroundColor: color }"
          :title="color"
        ></div>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.product-card {
  background: white;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
  display: block;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.product-card.out-of-stock {
  opacity: 0.6;
}

.product-card.out-of-stock .product-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
}

.product-image {
  position: relative;
  width: 100%;
  height: 380px;
  background-color: #f8f8f8;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 48px;
  font-weight: 600;
}

.stock-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #d32f2f;
  color: white;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;
}

.wishlist-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  z-index: 2;
}

.wishlist-btn:hover {
  transform: scale(1.1);
}

.wishlist-btn i {
  font-size: 18px;
  color: #666;
  transition: all 0.2s;
}

.wishlist-btn.active i {
  color: #ff4444;
}

.product-info {
  padding: 16px;
}

.product-brand {
  font-size: 14px;
  color: #000;
  margin-bottom: 4px;
  font-weight: 600;
}

.product-name {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.4;
}

.product-price {
  font-size: 16px;
  color: #000;
  font-weight: 700;
  margin-bottom: 10px;
}

.color-swatches {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.color-swatch {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-swatch:hover {
  transform: scale(1.15);
  border-color: #999;
}

@media (max-width: 768px) {
  .product-image {
    height: 320px;
  }
}
</style> 