<script setup>
import HeroSection from "~/components/HeroSection.vue";
import BannerSplitCards from "~/components/BannerSplitCards.vue";
import { useFavorites } from "~/composables/useFavorites";

const { products, loading, error } = useProducts({ type: "product" });
const { toggleFavorite, isFavorite } = useFavorites();

const formatPrice = (price) => `${price.toFixed(2)} DKK`;

const toggleWishlist = (product) => {
  toggleFavorite(product);
};

const isProductFavorite = (product) => isFavorite(product.id);
</script>

<template>
  <div>
    <HeroSection />

    <h1>
      <NuxtLink to="/products" class="h1-link"> NYHEDER &gt; </NuxtLink>
    </h1>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Fejl: {{ error }}</div>
    <div v-else-if="!products || products.length === 0">
      Ingen produkter fundet
    </div>

    <div v-else class="product-scroll">
      <NuxtLink
        v-for="product in products"
        :key="product.id"
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
            {{ product.ModelNavn?.charAt(0) || "?" }}
          </div>

          <div v-if="!product.inStock" class="stock-badge">Udsolgt</div>

          <button
            class="wishlist-btn"
            :class="{ active: isProductFavorite(product) }"
            aria-label="Tilføj til favoritter"
            @click.prevent="toggleWishlist(product)"
          >
            <i
              class="fa-heart"
              :class="isProductFavorite(product) ? 'fa-solid' : 'fa-regular'"
            ></i>
          </button>
        </div>

        <div class="product-info">
          <div class="product-brand">{{ product.Mærke }}</div>
          <div class="product-name">{{ product.ModelNavn }}</div>
          <div class="product-price">{{ formatPrice(product.Pris) }}</div>

          <div
            v-if="product.colors && product.colors.length > 0"
            class="color-swatches"
          >
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
    </div>
    <div class="banner-wrapper">
  <BannerSplitCards />
</div>


  </div>

</template>

<style scoped>
h1 {
  font-size: 1.4em;
  font-weight: bold;
  padding-left: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding-bottom: 0;
  color: black;
}

.h1-link {
  position: relative;
  text-decoration: none;
  color: inherit;
  display: inline-block;
  transition: color 0.2s;
}

.h1-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 0%;
  background-color: #757474;
  transition: width 0.3s ease;
}

.h1-link:hover {
  color: #757474;
}

.h1-link:hover::after {
  width: 100%;
}

.product-scroll {
  display: flex;
  padding: 0;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 0;
  margin-left: 1.5rem;
}

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
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.product-card.out-of-stock {
  opacity: 0.6;
}

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

.banner-wrapper {
  padding: 2rem 0;
}

</style>
