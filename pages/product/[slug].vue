<script setup>
const route = useRoute();          // giver adgang til URL parametre
const slug = route.params.slug;    // fx "basic-tshirt"

const { product, loading, error } = useProduct(slug);
</script>

<template>
  <main style="max-width: 900px; margin: 0 auto; padding: 1.5rem;">
    <NuxtLink to="/">← Tilbage til produkter</NuxtLink>

    <p v-if="loading">Loader produkt…</p>
    <p v-else-if="error">Produktet blev ikke fundet.</p>

    <section v-else>
      <h1>{{ product.title }}</h1>
      <p><strong>{{ product.price }} kr</strong></p>
      <p>{{ product.description }}</p>
    </section>
  </main>
</template>