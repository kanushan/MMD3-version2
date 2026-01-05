<script setup>
const route = useRoute();
const { product, loading, error } = useProduct(route.params.slug);
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Produkt ikke fundet</div>
  <div v-else-if="product">
    <h1>{{ product.ModelNavn }}</h1>
    <p class="brand">{{ product.Mærke }}</p>
    <img :src="product.BilledeMain" :alt="product.ModelNavn" class="product-image">
    <p class="price">{{ product.Pris }} kr</p>
    <p class="category">{{ product.Kategori }} - {{ product.UnderKategori }}</p>
    <p class="description">{{ product.ProduktBeskrivelse }}</p>
    
    <div class="usp" v-if="product.USP">
      <h3>Features:</h3>
      <ul>
        <li v-for="(point, index) in product.USP" :key="index">{{ point }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.brand {
  font-weight: bold;
  color: #666;
}

.price {
  font-size: 1.5rem;
  color: #222;
  font-weight: bold;
}

.category {
  color: #999;
  font-size: 0.9rem;
}

.description {
  margin: 1rem 0;
  line-height: 1.6;
}
</style>