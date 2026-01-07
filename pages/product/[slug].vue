<script setup>
import { useCart } from '~/composables/useCart';
import { useFavorites } from '~/composables/useFavorites';

const route = useRoute();
const { product, loading, error } = useProduct(route.params.slug);

// Cart and favorites
const { addToCart: addProductToCart } = useCart();
const { isFavorite, toggleFavorite } = useFavorites();
 
// For image gallery
const selectedImage = ref(null);
const quantity = ref(1);
const selectedSize = ref('L');
const showAddedToCart = ref(false);
 
// One-liner to get all product images
const productImages = computed(() =>
  product.value ? ['BilledeMain', 'Billede1', 'Billede2', 'Billede3', 'Billede4']
    .map(key => product.value[key]).filter(Boolean) : []
);
 
// Watch for product changes to set initial image
watch(() => product.value, (newProduct) => {
  if (newProduct && productImages.value.length > 0) {
    selectedImage.value = productImages.value[0];
  }
}, { immediate: true });
 
const decrementQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};
 
const incrementQuantity = () => {
  quantity.value++;
};
 
const addToCart = () => {
  if (!product.value) return;

  // Tilføj til kurv med valgte optioner
  addProductToCart(
    product.value,
    quantity.value,
    selectedSize.value,
    null // Farve - kan tilføjes senere hvis du har farve variants
  );

  // Vis bekræftelse
  showAddedToCart.value = true;
  setTimeout(() => {
    showAddedToCart.value = false;
  }, 3000);

  // Reset quantity
  quantity.value = 1;
};
 
const goBack = () => {
  navigateTo(-1); // Goes back one page in history
};
</script>
 
<template>
  <div v-if="loading" class="loading">Loading...</div>
  <div v-else-if="error" class="error">Produkt ikke fundet</div>
  <div v-else-if="product" class="product-page">
 
    <!-- Back button -->
    <button @click="goBack" class="back-button" aria-label="Tilbage">
      <i class="fa-solid fa-chevron-left"></i>
    </button>
    
    <!-- Favorite button -->
    <button 
      @click="toggleFavorite(product)" 
      class="favorite-button"
      :class="{ active: isFavorite(product.id) }"
      :title="isFavorite(product.id) ? 'Fjern fra favoritter' : 'Tilføj til favoritter'"
    >
      <i :class="isFavorite(product.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
    </button>

    <!-- Left side: Image thumbnails -->
    <div class="image-thumbnails">
      <div
        v-for="(image, index) in productImages"
        :key="index"
        class="thumbnail"
        :class="{ active: selectedImage === image }"
        @click="selectedImage = image"
      >
        <img :src="image" :alt="`${product.ModelNavn} - bilde ${index + 1}`">
      </div>
    </div>
 
    <!-- Center: Main product image -->
    <div class="main-image">
      <img :src="selectedImage || product.BilledeMain" :alt="product.ModelNavn">
    </div>
 
    <!-- Right side: Product details -->
    <div class="product-details">
      <h1 class="brand">{{ product.Mærke }}</h1>
      <h2 class="model-name">{{ product.ModelNavn }}</h2>
      
      <div class="price-section">
        <p class="price">{{ product.Pris.toLocaleString('da-DK') }} DKK</p>
        <p class="installment" v-if="product.Pris >= 300">
          Kun {{ Math.round(product.Pris / 4) }} kr. /md med <strong>VIABILL</strong>
        </p>
      </div>
 
      <!-- Color selection (if you have color variants) -->
      <div class="color-section">
        <label>Farve:</label>
        <div class="color-options">
          <!-- Add color swatches here if available -->
          <div class="color-swatch active"></div>
        </div>
      </div>
 
      <!-- Size selection -->
      <div class="size-section">
        <div class="size-header">
          <label>Størrelse:</label>
          <a href="#" class="size-guide">Størrelsesguide</a>
        </div>
        <div class="size-options">
          <button
            v-for="size in ['S', 'M', 'L', 'XL', 'XXL']"
            :key="size"
            :class="{ active: selectedSize === size, disabled: size === 'XXL' }"
            @click="selectedSize = size"
            :disabled="size === 'XXL'"
          >
            {{ size }}
          </button>
        </div>
      </div>
 
      <!-- Quantity and Add to Cart -->
      <div class="cart-section">
        <div class="quantity-selector">
          <button @click="decrementQuantity" class="qty-btn">-</button>
          <input type="number" v-model.number="quantity" min="1" readonly>
          <button @click="incrementQuantity" class="qty-btn">+</button>
        </div>
        <button class="add-to-cart" @click="addToCart">TILFØJ TIL KURV</button>
      </div>

      <!-- Success message -->
      <Transition name="fade">
        <div v-if="showAddedToCart" class="added-confirmation">
          <i class="fa-solid fa-check-circle"></i>
          <span>Produkt tilføjet til kurven!</span>
          <NuxtLink to="/cart" class="view-cart-link">Se kurv</NuxtLink>
        </div>
      </Transition>
 
      <!-- Delivery info -->
      <div class="delivery-info">
        <p>Hurtig levering ved bestilling inden kl. 16.30 på hverdage.</p>
        <p>Fri fragt ved køb over 599,-</p>
      </div>
 
      <!-- Product tabs -->
      <div class="product-tabs">
        <div class="tab-headers">
          <button class="tab-header active">Beskrivelse</button>
          <button class="tab-header">Materiale</button>
          <button class="tab-header">Fragt og Retur</button>
        </div>
        <div class="tab-content">
          <p>{{ product.ProduktBeskrivelse }}</p>
          
          <div class="usp" v-if="product.USP && product.USP.length">
            <p v-for="(point, index) in product.USP" :key="index">{{ point }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<style scoped>
.back-button {
  position: fixed;
  top: 140px;
  left: 20px;
  width: 25px;
  height: 25px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;
}

.back-button i {
  font-size: 25px;
  color: #000;
  transition: all 0.2s;
}

.back-button:hover {
  transform: scale(1.1);
}

.favorite-button {
  position: fixed;
  top: 140px;
  right: 20px;
  width: 25px;
  height: 25px;
  background: rgba(255, 255, 255, 0);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;
}

.favorite-button i {
  font-size: 25px;
  color: #666;
  transition: all 0.2s;
}

.favorite-button i:hover {
  transform: scale(1.1);
}

.favorite-button.active i {
  color: #c41e3a;
}

.product-page {
  display: grid;
  grid-template-columns: 100px 1fr 500px;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}
 
/* Image Thumbnails */
.image-thumbnails {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
 
.thumbnail {
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s;
}
 
.thumbnail.active {
  border-color: #000;
}
 
.thumbnail img {
  width: 100%;
  height: auto;
  display: block;
}
 
/* Main Image */
.main-image {
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}
 
.main-image img {
  max-width: 100%;
  height: auto;
}
 
/* Product Details */
.product-details {
  padding: 20px 0;
}
 
.brand {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 5px 0;
}
 
.model-name {
  font-size: 1.1rem;
  font-weight: normal;
  color: #666;
  margin: 0 0 20px 0;
}
 
.price-section {
  margin-bottom: 30px;
}
 
.price {
  font-size: 2rem;
  font-weight: bold;
  margin: 0 0 5px 0;
}
 
.installment {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}
 
/* Color Section */
.color-section {
  margin-bottom: 25px;
}
 
.color-section label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
}
 
.color-options {
  display: flex;
  gap: 10px;
}
 
.color-swatch {
  width: 40px;
  height: 40px;
  border: 2px solid #ddd;
  border-radius: 2px;
  cursor: pointer;
  background-color: #4a4a4a;
}
 
.color-swatch.active {
  border-color: #000;
  box-shadow: 0 0 0 1px #000;
}
 
/* Size Section */
.size-section {
  margin-bottom: 25px;
}
 
.size-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
 
.size-header label {
  font-weight: 500;
}
 
.size-guide {
  font-size: 0.9rem;
  color: #666;
  text-decoration: none;
}
 
.size-guide:hover {
  text-decoration: underline;
}
 
.size-options {
  display: flex;
  gap: 10px;
}
 
.size-options button {
  padding: 12px 20px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}
 
.size-options button:hover:not(.disabled) {
  border-color: #000;
}
 
.size-options button.active {
  background-color: #0F2A1E;
  color: white;
  border-color: #0F2A1E;
}
 
.size-options button.disabled {
  text-decoration: line-through;
  opacity: 0.4;
  cursor: not-allowed;
}
 
/* Cart Section */
.cart-section {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}
 
.quantity-selector {
  display: flex;
  border: 1px solid #ddd;
  width: 120px;
}
 
.quantity-selector input {
  width: 40px;
  text-align: center;
  border: none;
  font-size: 1rem;
}
 
.qty-btn {
  width: 40px;
  border: none;
  background: white;
  cursor: pointer;
  font-size: 1.2rem;
}
 
.qty-btn:hover {
  background-color: #f5f5f5;
}
 
.add-to-cart {
  flex: 1;
  background-color: #0F2A1E;
  color: white;
  border: none;
  padding: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}
 
.add-to-cart:hover {
  background-color: #155c37;
}

/* Success Confirmation */
.added-confirmation {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  padding: 16px;
  color: #155724;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  margin-bottom: 20px;
}

.added-confirmation i {
  font-size: 20px;
}

.view-cart-link {
  margin-left: auto;
  color: #155724;
  font-weight: 600;
  text-decoration: underline;
}

.view-cart-link:hover {
  color: #0c3d18;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
 
/* Delivery Info */
.delivery-info {
  background-color: #f9f9f9;
  padding: 15px;
  margin-bottom: 30px;
  font-size: 0.9rem;
}
 
.delivery-info p {
  margin: 5px 0;
}
 
/* Product Tabs */
.product-tabs {
  border-top: 1px solid #ddd;
  padding-top: 20px;
}
 
.tab-headers {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
}
 
.tab-header {
  background: none;
  border: none;
  padding: 10px 0;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  position: relative;
}
 
.tab-header.active {
  color: #000;
  font-weight: 500;
}
 
.tab-header.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #000;
}
 
.tab-content {
  line-height: 1.6;
  color: #333;
}
 
.usp p {
  margin: 10px 0;
}
 
/* Responsive */
@media (max-width: 930px) {
  .product-page {
    grid-template-columns: 1fr;
  }
  
  .image-thumbnails {
    flex-direction: row;
    order: 2;
  }
  
  .main-image {
    order: 1;
  }
  
  .product-details {
    order: 3;
  }

  .back-button {
    top: 20px;
    left: 10px;
    width: 44px;
    height: 44px;
  }

  .back-button i {
    font-size: 16px;
  }

  .favorite-button {
    top: 20px;
    right: 10px;
  }
}
</style>