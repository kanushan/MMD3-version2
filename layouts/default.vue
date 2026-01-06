<script setup>
import DesktopNav from '~/components/DesktopNav.vue';
import NavBar from '~/components/NavBar.vue';
import SearchOverlay from '~/components/SearchOverlay.vue';
import BurgerMenu from '~/components/BurgerMenu.vue';

const isSearchOpen = ref(false);
const isBurgerOpen = ref(false);
</script>

<template>
  <div>
    <DesktopNav />
    
    <NavBar 
      @open-search="isSearchOpen = true"
      @open-menu="isBurgerOpen = !isBurgerOpen"
      :is-menu-open="isBurgerOpen"
    />
    
    <SearchOverlay v-model="isSearchOpen" />
    <BurgerMenu v-model="isBurgerOpen" />
    
    <slot />
  </div>
</template>