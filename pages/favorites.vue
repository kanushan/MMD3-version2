<script setup>
const { favorites, favoritesCount } = useFavorites();
</script>

<template>
  <div class="container">
    <!-- Denne header viser overskriften "Mine Favoritter" og en beskrivelse af, hvor mange favoritter brugeren har. Hvis "favoritesCount" er større end 0, vises antallet af favoritter, og teksten tilpasses ental eller flertal. Hvis der ingen favoritter er, vises i stedet en besked om, at brugeren endnu ikke har nogle favoritter. -->
    <div class="header">
      <h1>Mine Favoritter</h1>
      <p v-if="favoritesCount > 0">
        Du har {{ favoritesCount }}
        {{ favoritesCount === 1 ? "favorit" : "favoritter" }}
      </p>
      <p v-else>Du har ingen favoritter endnu</p>
    </div>

    <div v-if="favoritesCount === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fa-regular fa-heart"></i>
      </div>
      <h2>Ingen favoritter endnu</h2>
      <p>Klik på hjertet på produkter for at tilføje dem til dine favoritter</p>
      <NuxtLink to="/products" class="browse-btn">
        Gennemse produkter
      </NuxtLink>
    </div>

    <div v-else class="products-grid">
      <ProductCard
        v-for="product in favorites"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 60vh;
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-icon i {
  font-size: 64px;
  color: #ccc;
}

.empty-state h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.empty-state p {
  color: #666;
  font-size: 16px;
  margin-bottom: 32px;
  max-width: 400px;
}

.browse-btn {
  display: inline-block;
  padding: 12px 32px;
  background: #000;
  color: white;
  text-decoration: none;
  border-radius: 2px;
  font-weight: 500;
  transition: background 0.2s;
}

.browse-btn:hover {
  background: #333;
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
