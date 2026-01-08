<script setup>
/* Vi henter vores produkter fra en ekstern kilde eller API via useProducts composable som i vores tilfælde er en JSON fil med alt product data... Vi destructurerer resultatet til "products" (produktlisten), "loading" (loading status) og "error" (fejlstatus). */
const { products, loading, error } = useProducts({ type: 'product' });

/* Opretter en reaktiv variabel som indholder et array til de produkter, som er filtreret af ProductFilter komponenten. */
const filteredProducts = ref([]);

/* Funktion, der opdaterer filteredProducts, når ProductFilter sender et nyt filtreret resultat. Dette gør det muligt at vise kun de produkter, som matcher brugerens filtre. */
const handleFiltered = (filtered) => {
  filteredProducts.value = filtered;
};
</script>


<template>
  <div class="container">
    <div class="header">
      <h1>Produkter</h1>
      <p>Se vores udvalg af produkter</p>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else-if="error" class="error">
      <p>Fejl: {{ error }}</p>
    </div>
    
    <div v-else-if="!products || products.length === 0" class="no-products">
      <p>Ingen produkter fundet</p>
    </div>
    
    <div v-else class="main-content">
      <div class="category-section-desktop">
        <CategoryButtons :products="products" />
      </div>

      <div class="content-wrapper">
        <aside class="sidebar">
          <ProductFilter 
            :products="products"
            @filtered="handleFiltered"
          >
            <template #categories>
              <CategoryButtons :products="products" />
            </template>
          </ProductFilter>
        </aside>

        <div class="products-section">
          <div class="product-count">
            Viser {{ filteredProducts.length }} produkter
          </div>
          
          <div v-if="filteredProducts.length === 0" class="no-products">
            Ingen produkter matcher dine filtre
          </div>
          
          <div v-else class="products-grid">
            <ProductCard 
              v-for="product in filteredProducts" 
              :key="product.id"
              :product="product"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 12px;
}

.header {
  margin-bottom: 20px;
}

.header h1 {
  font-size: 20px;
  font-weight: 700;
  color: #111;
  margin-bottom: 8px;
}

.header p {
  color: #666;
  font-size: 14px;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #666;
}

.error {
  color: #d32f2f;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.category-section-desktop {
  display: none;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.sidebar {
  width: 100%;
}

.products-section {
  display: flex;
  flex-direction: column;
}

.product-count {
  font-size: 13px;
  color: #666;
  margin-bottom: 16px;
}

.no-products {
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #666;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 50px;
}

@media (min-width: 930px) {
  .container {
    padding: 20px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .header {
    margin-bottom: 32px;
  }

  .header h1 {
    font-size: 28px;
  }

  .header p {
    font-size: 15px;
  }

  .category-section-desktop {
    display: block;
  }

  .content-wrapper {
    grid-template-columns: 280px 1fr;
    gap: 24px;
  }

  .sidebar {
    width: 280px;
  }

  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 0px;
  }

  .product-count {
    font-size: 14px;
  }
}

@media (min-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
    margin-bottom: 0px;
  }
}
</style>
