<script setup>
/* Her henter vi produkter fra API eller datastore som i vores tilfælde er et JSON fil hvor products er vores produkter og loading der viser om vores boolean stadig henter data... og til sidst error som viser en fejlmeddelelse om der er nogle fejl under processen */
const { products, loading, error } = useProducts({ type: "product" });
</script>

<template>
  <div>
    <HeroSection />

    <h2 style="margin-top: 2rem">
      <NuxtLink to="/products?isNew=true" class="h2-link"
        >NYHEDER &gt;</NuxtLink
      >
    </h2>

    <!-- Hvis produkterne stadig hentes, vises en loading besked -->
    <div v-if="loading">Loading...</div>

    <!-- Hvis der opstod en fejl under hentning af produkterne, vises fejlmeddelelsen her -->
    <div v-else-if="error">Fejl: {{ error }}</div>

    <!-- Hvis der ikke findes produkter i listen (enten fordi products er tom eller undefined eller en anden form for fejl), vises en besked om, at ingen produkter blev fundet -->
    <div v-else-if="!products || products.length === 0">
      Ingen produkter fundet
    </div>

    <!-- Hvis produkterne er hentet korrekt og listen ikke er tom, vises produktkortene i et scrollbart område med overflow på. Vi bruger nu ProductCard komponenten i stedet for at gentage al markup og logik -->
    <div v-else class="product-scroll">
      <ProductCard
        v-for="product in products.filter((p) => p.isNew)"
        :key="product.id"
        :product="product"
      />
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
      <ProductCard
        v-for="product in products.filter((p) => p.BoxensLook)"
        :key="product.id"
        :product="product"
      />
    </div>

    <div class="shipping-information-section">
      <div class="shipping-information-container">
        <div class="benefit-item">
          <div class="benefit-icon">
            <img
              src="../public/svgIcons/localShipping.png"
              alt="Hurtig levering ikon"
            />
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
          <p class="benefit-description">På ordre over 599,- i hele Danmark</p>
        </div>

        <div class="benefit-item">
          <div class="benefit-icon">
            <img
              src="../public/svgIcons/retunering.png"
              alt="Gratis bytte ikon"
            />
          </div>
          <h3 class="benefit-title">Gratis bytte</h3>
          <p class="benefit-description">Byt nemt og gratis med byteposer</p>
        </div>
      </div>
    </div>

    <div class="footer-spacing"></div>
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

.banner-wrapper {
  padding: 2rem 0;
  overflow-x: hidden;
}

.shipping-information-section {
  padding: 3rem 1.5rem;
  margin: 2rem 0;
}

.shipping-information-container {
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
  .shipping-information-container {
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
