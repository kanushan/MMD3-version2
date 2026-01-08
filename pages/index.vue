<script setup>
/* Her henter vi produkter fra API eller datastore som i vores tilfælde er et JSON fil hvor products er vores produkter og loading der viser om vores boolean stadig henter data... og til sidst error som viser en fejlmeddelelse om der er nogle fejl under processen */
const { products, loading, error } = useProducts({ type: "product" });

/* Her henter vi funktioner fra vores useFavorites composable, som håndtere favoritter. Den her composable retunere to funktioner som er toggle favorite som derfra tilføjer eller fjerner produkterne man har tilvalgt via hjerte ikonet på vores produkt cards... Is favourite tjekker om produktet allerede er markeret */

/* Når man bruger disse funktioner direkte fra useFavorites kan vi bruge dem i komponenten uden ekstra reference, 
   hvilket gør det nemt at opdatere UI'et og vise fx et hjerte, der skifter farve alt efter om produktet er en favorit eller ej.*/
const { toggleFavorite, isFavorite } = useFavorites();

/* Her definerer vi en funktion, der formaterer prisen fra vores JSON-data fil, så den kan vises pænt i template. 
   Funktionen tager et tal som input og konverterer det til et string med to decimaler efterfulgt af 'DKK', 
   så en pris som 100 bliver vist som "100.00 DKK" i brugergrænsefladen. */
const formatPrice = (price) => `${price.toFixed(2)} DKK`;

/* Her definerer vi en funktion, der ændrer et produkts status i favoritlisten. 
   Funktionen modtager et produkt som input og kalder toggleFavorite fra useFavorites composable, 
   hvilket tilføjer produktet til favoritter, hvis det ikke allerede er der, eller fjerner det, hvis det allerede er markeret som favorit. */
const toggleWishlist = (product) => {
  toggleFavorite(product); /* her kalder vi toggleFavorite fra useFavorites */
};

/* Her definerer vi en funktion, der tjekker, om et produkt allerede er markeret som favorit...
   Funktionen modtager et produkt som input og kalder isFavorite fra useFavorites composable med produktets id. 
   Den returnerer true, hvis produktet er en favorit, og false, hvis det ikke er, så vi kan bruge resultatet til at opdatere det visuelle UI, fx farven på et hjerteikon. */
const isProductFavorite = (product) => isFavorite(product.id);
</script>

<template>
  <div>
    <HeroSection />

    <h2 style="margin-top: 2rem">
      <NuxtLink to="/products?isNew=true" class="h2-link">NYHEDER &gt;</NuxtLink>
    </h2>
    <!-- Hvis produkterne stadig hentes, vises en loading besked -->
    <div v-if="loading">Loading...</div>

    <!-- Hvis der opstod en fejl under hentning af produkterne, vises fejlmeddelelsen her -->
    <div v-else-if="error">Fejl: {{ error }}</div>

    <!-- Hvis der ikke findes produkter i listen (enten fordi products er tom eller undefined eller en anden form for fejl), vises en besked om, at ingen produkter blev fundet -->
    <div v-else-if="!products || products.length === 0">
      Ingen produkter fundet
    </div>

    <!-- Hvis produkterne er hentet korrekt og listen ikke er tom, vises produktkortene i et scrollbart område med overflow på -->
    <!-- NuxtLink opretter et link til alle nye produkter. Den tilføjer så en css class som hedder "out-of-stock", hvis produktet ikke er på lager. -->
    <div v-else class="product-scroll">
      <NuxtLink
        v-for="product in products.filter((p) => p.isNew)"
        :key="product.id"
        :to="`/product/${product.slug}`"
        class="product-card"
        :class="{ 'out-of-stock': !product.inStock }"
      >
        <div class="product-image-wrapper">
          <!-- Her bliver der vist produktets hovedbillede, hvis det findes via den korrekte sti også bruger vi "ModelNavn" som alternativ tekst for at forbedre tilgængeligheden for søgemaskiner -->
          <img
            v-if="product.BilledeMain"
            :src="product.BilledeMain"
            :alt="product.ModelNavn"
            class="product-image"
          />

          <!-- Hvis produktet ikke har et billede, vises denne placeholder i stedet. "charAt(0)" tager det første bogstav i produktets navn, og hvis navnet ikke findes, vises et spørgsmålstegn som fallback. css klassen "placeholder-image" bruges til at style placeholderen. -->
          <div v-else class="placeholder-image">
            {{ product.ModelNavn?.charAt(0) || "?" }}
          </div>

          <div v-if="!product.inStock" class="stock-badge">Udsolgt</div>

          <div class="badges-wrapper">
            <div v-if="product.isNew" class="product-badge">NYHED</div>
            <div v-if="product.BoxensLook" class="boxens-badge">
              BOXENS LOOK
            </div>
          </div>

          <!-- Her bliver der lavet en knap til at tilføje eller fjerne produktet fra ønskelisten. den bliver markeret som en "active" class, hvis produktet allerede er i ønskelisten... -->
          <button
            class="wishlist-btn"
            :class="{ active: isProductFavorite(product) }"
            aria-label="Tilføj til favoritter"
            @click.prevent="toggleWishlist(product)"
          >
            <!-- Hvis hjertets ikon til ønskelisten allerede er markeret som favorit bliver den fylt ud med en solid rød fill farve -->
            <i
              class="fa-heart"
              :class="isProductFavorite(product) ? 'fa-solid' : 'fa-regular'"
            ></i>
          </button>
        </div>

        <!-- Her bliver produktets mærke, navn og pris samt små farveprøver vist, hvis produktet findes i flere farver. -->
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
    </div>

    <!-- Her tager vi en div og sætter vores BannerSplitCards Component ind, der er ikke rigtig grund til og sætte den ind i en div men vi har valgt og gøre det fordi det giver nemmere justering til styling for vi kan komme ind og ramme den i Index.vue istedet for komponenten... + vi havde problemer med fullwidth versionen hvor der var gap til højre side men der fandt vi en fix som bare skulle give den en min-width på 100%... -->
    <div class="banner-wrapper">
      <BannerSplitCards />
    </div>

    <h2 style="margin-top: 2rem">
      <NuxtLink to="/products?BoxensLook=true" class="h2-link">
        BOXENS LOOK &gt;
      </NuxtLink>
    </h2>
    <div class="product-scroll">
      <NuxtLink
        v-for="product in products.filter((p) => p.BoxensLook)"
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

          <div class="badges-wrapper">
            <div v-if="product.isNew" class="product-badge">NYHED</div>
            <div v-if="product.BoxensLook" class="boxens-badge">
              BOXENS LOOK
            </div>
          </div>

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

<!-- Denne sektion viser produktets information på kortet. Først vises produktets mærke med "product.Mærke", derefter modelnavnet med "product.ModelNavn", og prisen vises med "formatPrice(product.Pris)" for korrekt formatering. Hvis produktet har tilgængelige farver, vises små farveprøver ved hjælp af "v-for", hvor hver prøve får baggrundsfarven sat dynamisk via ":style" og viser farven som tooltip med ":title"... Dette gør det nemt for brugeren visuelt at se, hvilke farver produktet findes i. -->
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
    </div>
  </div>
      <div class="benefits-section">
      <div class="benefits-container">
        
        <div class="benefit-item">
          <div class="benefit-icon">
            <img src="../public/svgIcons/localShipping.png" alt="Hurtig levering ikon" />
          </div>
          <h3 class="benefit-title">Hurtig levering</h3>
          <p class="benefit-description">
            Ved bestilling inden kl. 16.30 er leveringstiden 1-2 dage
          </p>
        </div>

        <div class="benefit-item">
          <div class="benefit-icon">
            <img src="../public/svgIcons/package.png" alt="Gratis fragt ikon" />
          </div>
          <h3 class="benefit-title">Gratis fragt</h3>
          <p class="benefit-description">
            På ordre over 599,- i hele Danmark
          </p>
        </div>

        <div class="benefit-item">
          <div class="benefit-icon">
            <img src="../public/svgIcons/retunering.png" alt="Gratis bytte ikon" />
          </div>
          <h3 class="benefit-title">Gratis bytte</h3>
          <p class="benefit-description">
            Byt nemt og gratis med byteposer
          </p>
        </div>

      </div>
    </div>

  <div class="footer-spacing">
  </div>
</template>

<style scoped>
h2 {
  font-size: 1.4em;
  font-weight: bold;
  padding-left: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding-bottom: 0;
  color: black;
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
  background-color: #757474;
  transition: width 0.3s ease;
}

.h2-link:hover {
  color: #757474;
}

.h2-link:hover::after {
  width: 100%;
}

.product-scroll {
  display: flex;
  padding: 0 1rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  margin-left: 0;
  padding-bottom: 0.3rem;
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

.product-card:hover {
  transform: scale(1.01);
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
  overflow-x: hidden;
}

.benefits-section {
  padding: 3rem 1.5rem;
  margin: 2rem 0;
}
.benefits-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;
}

.benefit-item {
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.benefit-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.benefit-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.benefit-title {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-bottom: 0.5rem;
  text-transform: none;
}

.benefit-description {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  max-width: 250px;
}

@media (max-width: 930px) {
  .benefits-container {
    flex-direction: column;
    gap: 2.5rem;
  }
  
  .benefit-item {
    width: 100%;
  }
  
  .benefit-description {
    max-width: 100%;
  }
}

.footer-spacing {
  margin-top: 2rem;
}

</style>
