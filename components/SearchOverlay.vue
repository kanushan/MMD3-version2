<script setup>
const isOpen = defineModel({ type: Boolean, default: false });

const close = () => {
  isOpen.value = false;
};
</script>

<template>
  <Transition name="slideDown">
    <div v-if="isOpen" class="searchOverlay">
      <div class="overlayHeader">
        <h2>Søg</h2>
        <button @click="close" class="closeBtn" aria-label="Luk">✕</button>
      </div>
      
      <div class="searchContent">
        <input 
          type="search" 
          placeholder="Søg efter produkter..." 
          class="searchInput"
          autofocus
        />
        <!-- Din søgelogik kommer her -->
      </div>
    </div>
  </Transition>
  
  <!-- Backdrop -->
  <Transition name="fade">
    <div v-if="isOpen" class="backdrop" @click="close"></div>
  </Transition>
</template>

<style scoped>
.searchOverlay {
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

.overlayHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.closeBtn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.searchInput {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
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