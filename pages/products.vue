<script setup>
import ProductFilter from '~/components/ProductFilter.vue';
import ProductCard from '~/components/ProductCard.vue';

// Hent produkter
const { products, loading, error } = useProducts({ type: 'product' });

// Filtered products fra filter component
const filteredProducts = ref([]);

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
      <!-- Sidebar med filters -->
      <aside>
        <ProductFilter 
          :products="products"
          @filtered="handleFiltered"
        />
      </aside>

      <!-- Products Grid -->
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
</template>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  margin-bottom: 32px;
}

.header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #111;
  margin-bottom: 8px;
}

.header p {
  color: #666;
  font-size: 15px;
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
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
}

.products-section {
  display: flex;
  flex-direction: column;
}

.product-count {
  font-size: 14px;
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
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style> 