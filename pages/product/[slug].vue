<script setup>
  
/* Hent nuværende rute information samt router funktionalitet til navigation tilbage */
const route = useRoute();
const router = useRouter();

/* Hent produktdata baseret på slug fra ruten og samtidig loading og error status */
const { product, loading, error } = useProduct(route.params.slug);

/* Hent alle produkter til at vise i bunden af siden */
const { products, loading: productsLoading, error: productsError } = useProducts({ type: "product" });

/* Initialiser kurv funktioner til at tilføje produkter og favoritter funktioner til at tjekke og ændre favorit status */
const { addToCart: addProductToCart } = useCart();
const { isFavorite, toggleFavorite } = useFavorites();

/* Opret reaktive variable til håndtering af valgt produktbillede, antal, valgt størrelse, visning af bekræftelse og loader status */
const selectedImage = ref(null);
const quantity = ref(1);
const selectedSize = ref("");
const showAddedToCart = ref(false);
const showLoader = ref(true);

/* Computed property der laver en liste af alle eksisterende produktbilleder og filtrerer tomme værdier væk */
const productImages = computed(() =>
  product.value
    ? ["BilledeMain", "Billede1", "Billede2", "Billede3", "Billede4"]
        .map((key) => product.value[key])
        .filter(Boolean)
    : []
);

/* Computed property der returnerer tilgængelige størrelser baseret på produkttype */
const availableSizes = computed(() => {
  if (!product.value) return [];

  // Hvis produktet har Størrelser i JSON, brug dem
  if (product.value.Størrelser && product.value.Størrelser.length > 0) {
    return product.value.Størrelser;
  }

  // Fallback baseret på produkttype
  if (product.value.produktType === "shoes") {
    return ["38", "39", "40", "41", "42", "43", "44", "45"];
  } else {
    return ["S", "M", "L", "XL", "XXL"];
  }
});

/* Computed property der tjekker om produktet er sko */
const isShoes = computed(() => {
  return (
    product.value?.produktType === "shoes" ||
    product.value?.Kategori?.toLowerCase().includes("sko")
  );
});

/* Watcher der overvåger når produktet bliver loadet, slukker loader efter 400 millisekunder og sætter det første billede som valgt billede */
watch(
  () => product.value,
  (newProduct) => {
    if (newProduct) {
      setTimeout(() => {
        showLoader.value = false;
      }, 400);
      if (productImages.value.length > 0) {
        selectedImage.value = productImages.value[0];
      }
      // Reset valgt størrelse når produktet ændres
      selectedSize.value = "";
    }
  },
  { immediate: true }
);

/* Watcher der overvåger ændringer i slug parameteren, og hvis ruten ændres vises loader igen */
watch(
  () => route.params.slug,
  () => {
    showLoader.value = true;
    selectedSize.value = "";
  }
);

/* Funktion til at reducere antallet af produkter man vil have i kurven, men kun hvis antallet er større end 1 */
const decrementQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};

/* Funktion til at øge antallet af produkter man vil have i kurven med 1 */
const incrementQuantity = () => {
  quantity.value++;
};

/* Funktion der tjekker om en størrelse er udsolgt baseret på lager */
const isSizeDisabled = (size) => {
  if (!product.value) return false;
  
  // Check udsolgtStørrelser array (simpel metode)
  if (product.value.udsolgtStørrelser) {
    return product.value.udsolgtStørrelser.includes(size);
  }
  
  // Check størrelseLager object (avanceret metode)
  if (product.value.størrelseLager) {
    return product.value.størrelseLager[size] === 0;
  }
  
  return false;
};

/* Funktion til at tilføje produktet til kurven med valgt antal og størrelse samt vise en bekræftelse i 3 sekunder */
const addToCart = () => {
  if (!product.value) return;

  // Tjek om en størrelse er valgt
  if (!selectedSize.value) {
    alert("Vælg venligst en størrelse");
    return;
  }

  addProductToCart(product.value, quantity.value, selectedSize.value, null);
  showAddedToCart.value = true;
  setTimeout(() => {
    showAddedToCart.value = false;
  }, 3000);
  quantity.value = 1;
};

/* Funktion til at navigere tilbage til den forrige side */
const goBack = () => {
  router.back();
};
</script>

<template>
  <div v-if="showLoader" class="loader-overlay">
    <Loader />
  </div>

  <div v-if="error" class="error">Produkt ikke fundet</div>
  <div v-else-if="product" class="product-page">
    <button
      @click="goBack"
      class="back-button desktop-btn"
      aria-label="Tilbage"
    >
      <i class="fa-solid fa-chevron-left"></i>
    </button>

    <button
      @click="toggleFavorite(product)"
      class="favorite-button desktop-btn"
      :class="{ active: isFavorite(product.id) }"
      :title="
        isFavorite(product.id)
          ? 'Fjern fra favoritter'
          : 'Tilføj til favoritter'
      "
    >
      <i
        :class="
          isFavorite(product.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'
        "
      ></i>
    </button>

    <div class="image-thumbnails">
      <div
        v-for="(image, index) in productImages"
        :key="index"
        class="thumbnail"
        :class="{ active: selectedImage === image }"
        @click="selectedImage = image"
      >
        <img :src="image" :alt="`${product.ModelNavn} - bilde ${index + 1}`" />
      </div>
    </div>

    <div class="main-image">
      <button
        @click="goBack"
        class="back-button mobile-btn"
        aria-label="Tilbage"
      >
        <i class="fa-solid fa-chevron-left"></i>
      </button>

      <button
        @click="toggleFavorite(product)"
        class="favorite-button mobile-btn"
        :class="{ active: isFavorite(product.id) }"
      >
        <i
          :class="
            isFavorite(product.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'
          "
        ></i>
      </button>

      <img
        :src="selectedImage || product.BilledeMain"
        :alt="product.ModelNavn"
      />
    </div>

    <div class="product-details">
      <h1 class="brand">{{ product.Mærke }}</h1>
      <h2 class="model-name">{{ product.ModelNavn }}</h2>

      <div class="price-section">
        <p class="price">{{ product.Pris.toLocaleString("da-DK") }} DKK</p>
        <p class="installment" v-if="product.Pris >= 300">
          Kun {{ Math.round(product.Pris / 4) }} kr. /md med
          <strong>VIABILL</strong>
        </p>
      </div>

      <div class="color-section">
        <label>Farve:</label>
        <div class="color-options">
          <div class="color-swatch1 active"></div>
          <div class="color-swatch2 active"></div>
          <div class="color-swatch3 active"></div>
        </div>
      </div>

      <div class="size-section">
        <div class="size-header">
          <label>Størrelse:</label>
          <a href="#" class="size-guide">Størrelsesguide</a>
        </div>
        <div class="size-options" :class="{ 'shoe-sizes': isShoes }">
          <button
            v-for="size in availableSizes"
            :key="size"
            :class="{
              active: selectedSize === size,
              disabled: isSizeDisabled(size),
            }"
            @click="!isSizeDisabled(size) && (selectedSize = size)"
            :disabled="isSizeDisabled(size)"
            :title="isSizeDisabled(size) ? 'Udsolgt' : `Vælg størrelse ${size}`"
          >
            {{ size }}
            <span v-if="isSizeDisabled(size)" class="sold-out-badge"></span>
          </button>
        </div>
      </div>

      <div class="cart-section">
        <div class="quantity-selector">
          <button @click="decrementQuantity" class="qty-btn">-</button>
          <input type="number" v-model.number="quantity" min="1" readonly />
          <button @click="incrementQuantity" class="qty-btn">+</button>
        </div>
        <button class="add-to-cart" @click="addToCart">TILFØJ TIL KURV</button>
      </div>

      <Transition name="fade">
        <div v-if="showAddedToCart" class="added-confirmation">
          <i class="fa-solid fa-check-circle"></i>
          <span>Produkt tilføjet til kurven!</span>
          <NuxtLink to="/cart" class="view-cart-link">Se kurv</NuxtLink>
        </div>
      </Transition>

      <div class="delivery-info">
        <p>
          <img src="../../public/svgIcons/local_shipping.png" alt="" />Hurtig
          levering ved bestilling inden kl. 16.30 på hverdage.
        </p>
        <p>
          <img src="../../public/svgIcons/package_2.png" alt="" />Fri fragt ved
          køb over 599,-
        </p>
      </div>

      <div class="product-tabs">
        <div class="tab-headers">
          <button class="tab-header active">Beskrivelse</button>
          <button class="tab-header">Materiale</button>
          <button class="tab-header">Fragt og Retur</button>
        </div>
        <div class="tab-content">
          <p>{{ product.ProduktBeskrivelse }}</p>

          <div class="usp" v-if="product.USP && product.USP.length">
            <p v-for="(point, index) in product.USP" :key="index">
              {{ point }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Produkt anbefalinger sektion -->
  <div class="recommendations-section">
    <h2 class="section-title">
      <NuxtLink to="/products" class="h2-link">
        VI TROR DU VIL ELSKE  &gt;
      </NuxtLink>
    </h2>

    <!-- Hvis produkterne stadig hentes, vises en loading besked -->
    <div v-if="productsLoading" class="loading-message">Loading...</div>

    <!-- Hvis der opstod en fejl under hentning af produkterne, vises fejlmeddelelsen her -->
    <div v-else-if="productsError" class="error-message">Fejl: {{ productsError }}</div>

    <!-- Hvis der ikke findes produkter i listen -->
    <div v-else-if="!products || products.length === 0" class="no-products-message">
      Ingen produkter fundet
    </div>

    <!-- Hvis produkterne er hentet korrekt og listen ikke er tom, vises produktkortene -->
    <div v-else class="product-scroll">
      <ProductCard
        v-for="prod in products.filter((p) => p.isNew)"
        :key="prod.id"
        :product="prod"
      />
    </div>
  </div>
</template>

<style scoped>
.recommendations-section {
  max-width: 1400px;
  margin: 3rem auto 0;
  padding: 0 20px;
}

.section-title {
  font-size: 1.4em;
  font-weight: bold;
  padding-left: 0;
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding-bottom: 0;
  color: black;
}

.product-scroll {
  display: flex;
  padding: 0;
  overflow-x: auto;
  scroll-behavior: smooth;
  margin-left: 0;
  padding-bottom: 0.3rem;
  margin-bottom: 2rem;
}

.product-scroll::-webkit-scrollbar {
  height: 3px;
}

.product-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.product-scroll::-webkit-scrollbar-thumb {
  background: #c5c4c4;
  border-radius: 4px;
}

.product-scroll::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.loading-message,
.error-message,
.no-products-message {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.h2-link {
  position: relative;
  text-decoration: none;
  color: inherit;
  display: inline-block;
  transition: color 0.2s;
}

.h2-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 0%;
  background-color: #8E8E8E;
  transition: width 0.3s ease;
}

.h2-link:hover {
  color: #8E8E8E;
}

.h2-link:hover::after {
  width: 100%;
}

.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.back-button {
  position: fixed;
  top: 140px;
  left: 20px;
  width: 44px;
  height: 44px;
  background: rgb(0, 0, 0);
  border: none;
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
  color: #ffffff;
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
  background: rgba(255, 255, 255);
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

.main-image {
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.main-image img {
  max-width: 100%;
  height: auto;
}

.mobile-btn {
  display: none;
}

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

.color-swatch1 {
  width: 40px;
  height: 40px;
  border: 2px solid #ddd;
  border-radius: 2px;
  cursor: pointer;
  background-color: #4a4a4a;
}
.color-swatch2 {
  width: 40px;
  height: 40px;
  border: 2px solid #ddd;
  border-radius: 2px;
  cursor: pointer;
  background-color: #f6ebc6;
}
.color-swatch3 {
  width: 40px;
  height: 40px;
  border: 2px solid #ddd;
  border-radius: 2px;
  cursor: pointer;
  background-color: #1c4965;
}

.color-swatch1.active {
  border-color: #000;
  box-shadow: 0 0 0 1px #000;
}

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

.size-options button.disabled {
  text-decoration: line-through;
  opacity: 0.4;
  cursor: not-allowed;
  position: relative;
}

.sold-out-badge {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  color: #999;
  white-space: nowrap;
}

.size-options button:hover:not(.disabled) {
  border-color: #000;
}

.size-options button.active {
  background-color: #0f2a1e;
  color: white;
  border-color: #0f2a1e;
}

.size-options button.disabled {
  text-decoration: line-through;
  opacity: 0.4;
  cursor: not-allowed;
}

.size-options.shoe-sizes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 8px;
}

.size-options.shoe-sizes button {
  padding: 12px 8px;
  font-size: 0.95rem;
}

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
  background-color: #0f2a1e;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.delivery-info {
  padding: 15px;
  margin-bottom: 30px;
  font-size: 0.9rem;
}

.delivery-info p {
  margin: 5px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

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
  content: "";
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

@media (max-width: 930px) {
  .desktop-btn {
    display: none !important;
  }

  .mobile-btn {
    display: flex !important;
    position: absolute;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    z-index: 10;
  }

  .mobile-btn.back-button {
    top: 20px;
    left: 16px;
  }

  .mobile-btn.favorite-button {
    top: 20px;
    right: 16px;
    background: none;
  }

  .mobile-btn i {
    font-size: 20px;
  }

  .product-page {
    grid-template-columns: 1fr;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .image-thumbnails {
    flex-direction: row;
    order: 2;
    justify-content: space-around;
    height: 100px;
    padding: 10px;
  }

  .thumbnail img {
    width: 100%;
    height: 100%;
    display: block;
  }

  .main-image {
    order: 1;
  }

  .product-details {
    order: 3;
    padding: 20px 16px;
    margin-bottom: 50px;
  }

  .recommendations-section {
    padding: 0 16px;
  }

  .section-title {
    padding-left: 0;
  }

  .size-options.shoe-sizes {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>