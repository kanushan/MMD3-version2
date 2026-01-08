<script setup>
import { computed } from 'vue'
import { useFavorites } from '~/composables/useFavorites'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const { toggleFavorite, isFavorite } = useFavorites()

const formatPrice = (price) => `${price.toFixed(2)} DKK`

const toggleWishlist = () => {
  toggleFavorite(props.product)
}

const isProductFavorite = computed(() => isFavorite(props.product.id))
</script>

<template>
  <NuxtLink
    :to="`/product/${product.slug}`"
    class="product-card"
    :class="{ 'out-of-stock': !product.inStock }"
  >
    <div class="product-image-wrapper">
      <img
        v-if="product.BilledeMain"
        :src="product.BilledeMain"
        :alt="product.ModelNavn"
        class="product-image"
      />
      <div v-else class="placeholder-image">
        {{ product.ModelNavn?.charAt(0) || '?' }}
      </div>

      <!-- Out of stock badge -->
      <div v-if="!product.inStock" class="stock-badge">Udsolgt</div>

      <!-- Stacked badges -->
      <div class="badges-wrapper">
        <div v-if="product.isNew" class="product-badge">NYHED</div>
        <div v-if="product.BoxensLook" class="boxens-badge">BOXENS LOOK</div>
      </div>

      <!-- Wishlist button -->
      <button
        class="wishlist-btn"
        :class="{ active: isProductFavorite }"
        aria-label="Tilføj til favoritter"
        @click.prevent="toggleWishlist"
      >
        <i
          class="fa-heart"
          :class="isProductFavorite ? 'fa-solid' : 'fa-regular'"
        ></i>
      </button>
    </div>

    <div class="product-info">
      <div class="product-brand">{{ product.Mærke }}</div>
      <div class="product-name">{{ product.ModelNavn }}</div>
      <div class="product-price">{{ formatPrice(product.Pris) }}</div>

      <div v-if="product.colors?.length" class="color-swatches">
        <div
          v-for="(color, idx) in product.colors"
          :key="idx"
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
  flex: 0 0 340px;
  background: white;
  border-radius: 0;
  border: 1px solid #c5c4c4;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.product-card.out-of-stock {
  opacity: 0.6;
}

/* === IMAGE WRAPPER === */
.product-image-wrapper {
  position: relative;
  width: 100%;
  height: 50vh;
  background-color: #f8f8f8;
  overflow: hidden;
}

.product-image {
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
  color: white;
  font-size: 48px;
  font-weight: 600;
}

/* === BADGES === */
.badges-wrapper {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 3;
  align-items: flex-start;
}

.product-badge {
  display: inline-block;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 4px;
  color: white;
  background-color: #ff4444;
  white-space: nowrap;
  text-align: left;
}

.boxens-badge {
  display: inline-block;
  padding: 4px 12px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 4px;
  color: white;
  background-color: #0f2a1e;
  white-space: nowrap;
  text-align: left;
}

/* === OUT OF STOCK BADGE === */
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

/* === WISHLIST === */
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

/* === PRODUCT INFO === */
.product-info {
  padding: 1rem;
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

/* === COLOR SWATCHES === */
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
  .product-image-wrapper {
    height: 320px;
  }
}
</style>
