<script setup>
const emit = defineEmits(['open-search', 'open-menu']);

const props = defineProps({
  isMenuOpen: {
    type: Boolean,
    default: false
  }
});

const toggleMenu = () => {
  emit('open-menu');
};
</script>

<template>
 <nav class="navBar">
    <!-- Hjem -->
    <NuxtLink to="/" class="navItem" aria-label="Hjem">
      <span class="navIcon">🏠</span>
      <span class="navLabel">Hjem</span>
    </NuxtLink>

    <!-- Søg -->
  <button
    type="button"
    class="navItem"
    aria-label="Søg"
    @click="emit('open-search')"
  >
    <span class="navIcon">🔍</span>
    <span class="navLabel">Søg</span>
  </button>

    <!-- Favoritter -->
    <NuxtLink to="/favorites" class="navItem" aria-label="Favoritter">
      <span class="navIcon">❤️</span>
      <span class="navLabel">Favorit</span>
    </NuxtLink>

    <!-- Kurv -->
    <NuxtLink to="/cart" class="navItem" aria-label="Kurv">
      <span class="navIcon">🛒</span>
      <span class="navLabel">Kurv</span>

      <!-- Badge kommer senere når vi kobler kurv-logik på -->
      <span class="cartBadge" v-if="false">0</span>
    </NuxtLink>

    <!-- Bruger -->
    <NuxtLink to="/account" class="navItem" aria-label="Bruger">
      <span class="navIcon">👤</span>
      <span class="navLabel">Bruger</span>
    </NuxtLink>

    <!-- Burger-menu -->
    <button
      type="button"
      class="navItem"
      aria-label="Menu"
      @click="toggleMenu"
    >
      <span class="navIcon">{{ isMenuOpen ? '✕' : '☰' }}</span>
      <span class="navLabel">Menu</span>
    </button>
  </nav>
</template>

<style scoped>
.navBar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 0.5rem;

  background: #f3f3f3;
  border-top: 1px solid #ddd;

  padding: 0.5rem 0.75rem;

  /* MOBILE FIRST: fast i bunden */
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 50;
}

.navItem {
  flex: 1;
  text-decoration: none;
  color: #222;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.7rem;
  border: none;
  background: none;
  position: relative; /* vigtig for badge placering */
}

.navIcon {
  font-size: 1.4rem;
  line-height: 1;
}

.navLabel {
  margin-top: 0.15rem;
}

.cartBadge {
  position: absolute;
  top: -2px;
  right: 10px;
  background: red;
  color: white;
  border-radius: 50%;
  padding: 0.15rem 0.45rem;
  font-size: 0.7rem;
}

/* Desktop style */
@media (min-width: 768px) {
  .navBar {
    position: static;
    width: auto;
    border-bottom: 1px solid #ddd;
    border-top: none;
    margin-bottom: 1rem;
    justify-content: flex-start;
  }

  .navItem {
    flex: 0;
    flex-direction: row;
    gap: 0.4rem;
    font-size: 0.85rem;
    padding: 0.25rem 0.75rem;
  }

  .navIcon {
    font-size: 1.1rem;
  }
}
</style>
