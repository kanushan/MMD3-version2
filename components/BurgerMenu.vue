<script setup>
const isOpen = defineModel({ type: Boolean, default: false });

const accordions = ref({
  brands: false,
  shoes: false,
  clothing: false,
  accessories: false
});

const toggleAccordion = (key) => {
  accordions.value[key] = !accordions.value[key];
};

const close = () => {
  isOpen.value = false;
};
</script>

<template>
  <Transition name="slideDown">
    <div v-if="isOpen" class="burgerMenu">
      <div class="menuContent">
        <!-- Brands Accordion -->
<div class="accordion">
  <button @click="toggleAccordion('brands')" class="accordionHeader">
    <span>Brands</span>
    <span class="arrow" :class="{ open: accordions.brands }">▼</span>
  </button>
  <div v-show="accordions.brands" class="accordionContent">
    <NuxtLink to="/products?brand=JACK%20%26%20JONES" @click="close">JACK & JONES</NuxtLink>
    <NuxtLink to="/products?brand=ONLY%20%26%20SONS" @click="close">ONLY & SONS</NuxtLink>
    <NuxtLink to="/products?brand=Woodbird." @click="close">Woodbird.</NuxtLink>
    <NuxtLink to="/products?brand=SELECTED" @click="close">SELECTED</NuxtLink>
    <NuxtLink to="/products?brand=LVL" @click="close">LVL</NuxtLink>
  </div>
</div>

        <!-- Sko Accordion -->
        <div class="accordion">
          <button @click="toggleAccordion('shoes')" class="accordionHeader">
            <span>Sko</span>
            <span class="arrow" :class="{ open: accordions.shoes }">▼</span>
          </button>
          <div v-show="accordions.shoes" class="accordionContent">
            <NuxtLink to="/products?category=Sko&subcategory=Loafer" @click="close">Loafers</NuxtLink>
            <NuxtLink to="/products?category=Sko&subcategory=Støvle" @click="close">Støvler</NuxtLink>
            <NuxtLink to="/products?category=Sko" @click="close">Alle Sko</NuxtLink>
          </div>
        </div>

        <!-- Tøj Accordion -->
        <div class="accordion">
          <button @click="toggleAccordion('clothing')" class="accordionHeader">
            <span>Tøj</span>
            <span class="arrow" :class="{ open: accordions.clothing }">▼</span>
          </button>
          <div v-show="accordions.clothing" class="accordionContent">
            <NuxtLink to="/products?category=Tøj&subcategory=Tshirt" @click="close">T-shirts</NuxtLink>
            <NuxtLink to="/products?category=Tøj&subcategory=Striktrøje" @click="close">Striktrøjer</NuxtLink>
            <NuxtLink to="/products?category=Tøj&subcategory=Hættetrøje" @click="close">Hættetrøjer</NuxtLink>
            <NuxtLink to="/products?category=Tøj&subcategory=Jakke" @click="close">Jakker</NuxtLink>
            <NuxtLink to="/products?category=Tøj&subcategory=Bukser" @click="close">Bukser</NuxtLink>
            <NuxtLink to="/products?category=Tøj" @click="close">Alt Tøj</NuxtLink>
          </div>
        </div>

        <!-- Accessories Accordion - tom indtil du får accessories -->
        <div class="accordion">
          <button @click="toggleAccordion('accessories')" class="accordionHeader">
            <span>Accessories</span>
            <span class="arrow" :class="{ open: accordions.accessories }">▼</span>
          </button>
          <div v-show="accordions.accessories" class="accordionContent">
            <p style="color: #999; padding: 0.5rem;">Kommer snart...</p>
          </div>
        </div>

        <!-- Direkte links -->
        <div class="directLinks">
          <NuxtLink to="/news" @click="close" class="directLink">Nyheder</NuxtLink>
          <NuxtLink to="/lookbook" @click="close" class="directLink">Boxens Look</NuxtLink>
        </div>
      </div>
    </div>
  </Transition>
  
  <!-- Backdrop -->
  <Transition name="fade">
    <div v-if="isOpen" class="backdrop" @click="close"></div>
  </Transition>
</template>

<style scoped>
.burgerMenu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: white;
  z-index: 100;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  padding: 1rem;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}

.menuContent {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.accordion {
  border-bottom: 1px solid #eee;
}

.accordionHeader {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
}

.arrow {
  transition: transform 0.3s ease;
  font-size: 0.8rem;
}

.arrow.open {
  transform: rotate(-180deg);
}

.accordionContent {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1rem 1rem 1rem;
  gap: 0.75rem;
}

.accordionContent a {
  color: #666;
  text-decoration: none;
  padding: 0.5rem;
  transition: color 0.2s;
}

.accordionContent a:hover {
  color: #222;
}

.directLinks {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
}

.directLink {
  padding: 1rem 0.5rem;
  text-decoration: none;
  color: #222;
  font-weight: 500;
  border-bottom: 1px solid #eee;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 40;
}

/* SlideDown animation */
.slideDown-enter-active,
.slideDown-leave-active {
  transition: transform 0.3s ease;
}

.slideDown-enter-from {
  transform: translateY(-100%);
}

.slideDown-leave-to {
  transform: translateY(-100%);
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>