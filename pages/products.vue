<script setup>
const route = useRoute();
const products = ref([]);
const loading = ref(true);

const fetchProducts = async () => {
    loading.value = true;
    try {
        products.value = await $fetch('/api/products', {
            params: {
                type: 'product',
                category: route.query.category,
                subcategory: route.query.subcategory,
                brand: route.query.brand
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    } finally {
        loading.value = false;
    }
};

// Fetch ved første load
await fetchProducts();

// Refetch når route query ændres
watch(() => route.query, () => {
    fetchProducts();
});

const title = computed(() => {
  if (route.query.subcategory) return route.query.subcategory;
  if (route.query.category) return route.query.category;
  if (route.query.brand) return route.query.brand;
  return 'Alle Produkter';
});
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    
    <div v-if="loading">Loading...</div>
    
    <div v-else-if="products?.length === 0">
      <p>Ingen produkter fundet</p>
    </div>
    
    <div v-else class="product-grid">
      <NuxtLink 
        v-for="product in products" 
        :key="product.id"
        :to="`/product/${product.slug}`"
        class="product-card"
      >
        <h3>{{ product.ModelNavn }}</h3>
        <p class="brand">{{ product.Mærke }}</p>
        <p class="price">{{ product.Pris }} kr</p>
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
  margin-bottom: 100px;
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

h3 {
  margin: 0 0 0.5rem 0;
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
}
</style>