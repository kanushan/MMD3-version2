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
      <i class="fa-solid fa-house navIcon"></i>
      <span class="navLabel">Hjem</span>
    </NuxtLink>

    <!-- Søg -->
    <button
      type="button"
      class="navItem"
      aria-label="Søg"
      @click="emit('open-search')"
    >
      <i class="fa-solid fa-magnifying-glass navIcon"></i>
      <span class="navLabel">Søg</span>
    </button>

    <!-- Favoritter -->
    <NuxtLink to="/favorites" class="navItem" aria-label="Favoritter">
      <i class="fa-solid fa-heart navIcon"></i>
      <span class="navLabel">Favorit</span>
    </NuxtLink>

    <!-- Kurv -->
    <NuxtLink to="/cart" class="navItem" aria-label="Kurv">
      <i class="fa-solid fa-cart-shopping navIcon"></i>
      <span class="navLabel">Kurv</span>
      <span class="cartBadge" v-if="false">0</span>
    </NuxtLink>

    <!-- Bruger -->
    <NuxtLink to="/account" class="navItem" aria-label="Bruger">
      <i class="fa-solid fa-user navIcon"></i>
      <span class="navLabel">Bruger</span>
    </NuxtLink>

    <!-- Burger-menu -->
    <button
      type="button"
      class="navItem"
      aria-label="Menu"
      @click="toggleMenu"
    >
      <i :class="isMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" class="navIcon"></i>
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
  position: relative;
  cursor: pointer;
}

.navIcon {
  font-size: 1.3rem;
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

/* Skjul på desktop - over 930px */
@media (min-width: 930px) {
  .navBar {
    display: none;
  }
}
</style>