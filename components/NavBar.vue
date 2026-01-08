<script setup>
/* Vi bruger vores composable useFavorites, som er et lille stykke kode, der holder styr på
alt relateret til favoritter. Her henter vi kun "favoritesCount", som fortæller hvor mange
produkter brugeren har markeret som favorit. Det er reaktivt, så hvis tallet ændrer sig,
opdateres UI automatisk. */
const { favoritesCount } = useFavorites();

/* På samme måde bruger vi useCart composable til at holde styr på indkøbskurven. 
Vi henter "cartCount", som viser hvor mange produkter der aktuelt ligger i kurven. 
Dette er også reaktivt, så UI altid viser korrekt antal. */
const { cartCount } = useCart();

/* defineEmits bruges til at registrere events, som denne komponent kan sende til sin parent.
Her kan komponenten sende to events: "open search" og "open menu", så parent kan reagere,
fx åbne søgefeltet eller burger menuen, når brugeren klikker på knapper. */
const emit = defineEmits(["open-search", "open-menu"]);

/* defineProps bruges til at tage imod information fra parent komponenten. 
Her får vi "isMenuOpen", som er en Boolean, der fortæller om menuen er åben eller ej. 
Vi sætter default til false, så menuen er lukket, hvis parent ikke sender en værdi. */
const props = defineProps({
  isMenuOpen: {
    type: Boolean,
    default: false,
  },
});

/* toggleMenu er en funktion, som sender eventet 'open menu' til parent komponenten. 
Når funktionen kaldes (fx når brugeren klikker på burger ikonet), vil parent kunne 
åbne eller lukke menuen baseret på det. */
const toggleMenu = () => {
  emit("open-menu");
};
</script>

<template>
  <nav class="navBar">
    <NuxtLink to="/" class="navItem" aria-label="Hjem">
      <i class="fa-solid fa-house navIcon"></i>
      <span class="navLabel">Hjem</span>
    </NuxtLink>

    <button
      type="button"
      class="navItem"
      aria-label="Søg"
      @click="emit('open-search')"
    >
      <i class="fa-solid fa-magnifying-glass navIcon"></i>
      <span class="navLabel">Søg</span>
    </button>

    <NuxtLink to="/favorites" class="navItem" aria-label="Favoritter">
      <i class="fa-solid fa-heart navIcon"></i>
      <span class="navLabel">Favorit</span>
      <span class="cartBadge" v-if="favoritesCount > 0">{{
        favoritesCount
      }}</span>
    </NuxtLink>

    <NuxtLink to="/cart" class="navItem" aria-label="Kurv">
      <i class="fa-solid fa-cart-shopping navIcon"></i>
      <span class="navLabel">Kurv</span>
      <span class="cartBadge" v-if="cartCount > 0">{{ cartCount }}</span>
    </NuxtLink>

    <NuxtLink to="/account" class="navItem" aria-label="Bruger">
      <i class="fa-solid fa-user navIcon"></i>
      <span class="navLabel">Bruger</span>
    </NuxtLink>

    <button type="button" class="navItem" aria-label="Menu" @click="toggleMenu">
      <i
        :class="isMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"
        class="navIcon"
      ></i>
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
  background: #c41e3a;
  color: white;
  border-radius: 50%;
  padding: 0.15rem 0.45rem;
  font-size: 0.7rem;
}

@media (min-width: 930px) {
  .navBar {
    display: none;
  }
}
</style>
