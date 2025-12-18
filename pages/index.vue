<script setup>
const { products, loading, error } = useProducts();
</script>

<template>
  <main style="max-width: 900px; margin: 0 auto; padding: 1.5rem;">
    <h1>Produkter</h1>
<p>hello test kanu</p>
    <p v-if="loading">Loader produkter…</p>
    <p v-else-if="error">Noget gik galt 😅</p>
    <ul v-else>
      <li
        v-for="product in products"
        :key="product.id"
        style="margin-bottom: 1rem;"
      >
        <NuxtLink :to="`/product/${product.slug}`">
          <strong>{{ product.title }}</strong> – {{ product.price }} kr
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>