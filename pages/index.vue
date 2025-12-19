<script setup>
const { products, loading, error } = useProducts({ type: 'product' });
</script>

<template>
  <div>
    <h1>Velkommen til Shoppen</h1>
    
    <div v-if="loading">Loading...</div>
    
    <div v-else-if="error">
      <p>Fejl: {{ error }}</p>
    </div>
    
    <div v-else-if="!products || products.length === 0">
      <p>Ingen produkter fundet</p>
    </div>
    
    <div v-else class="product-grid">
      <NuxtLink 
        v-for="product in products" 
        :key="product.id"
        :to="`/product/${product.slug}`"
        class="product-card"
      >
        <div class="product-info">
          <h3>{{ product.ModelNavn }}</h3>
          <p class="brand">{{ product.Mærke }}</p>
          <p class="price">{{ product.Pris }} kr</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
  margin-bottom: 100px; /* Plads til navbar i bunden */
}

.product-card {
  border: 1px solid #ddd;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
  border-radius: 8px;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.product-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.brand {
  color: #666;
  font-size: 0.9rem;
  margin: 0.25rem 0;
}

.price {
  font-weight: bold;
  color: #222;
  margin-top: 0.5rem;
  font-size: 1.1rem;
}
</style>