<script setup>
import { useSearch } from '~/composables/useSearch';

const isOpen = defineModel({ type: Boolean, default: false });
const { searchQuery, handleSearch: search, setSearchQuery } = useSearch();

const handleSearch = () => {
  search();
  isOpen.value = false;
};

const handleQuickSearch = (query) => {
  setSearchQuery(query);
  handleSearch();
};

const close = () => {
  isOpen.value = false;
  setSearchQuery('');
};

// Close on escape key
const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    close();
  }
};

watch(isOpen, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleKeydown);
    // Focus input when opened
    nextTick(() => {
      const input = document.querySelector('.search-overlay-input');
      if (input) input.focus();
    });
  } else {
    document.removeEventListener('keydown', handleKeydown);
  }
});
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="search-overlay">
      <div class="search-container">
        <div class="search-header">
          <h2>Søg produkter</h2>
          <button class="close-btn" @click="close" aria-label="Luk søgning">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form @submit.prevent="handleSearch" class="search-form">
          <div class="search-input-wrapper">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Søg efter produkter, mærker..."
              class="search-overlay-input"
            >
            <button
              v-if="searchQuery"
              type="button"
              class="clear-btn"
              @click="setSearchQuery('')"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <button type="submit" class="search-btn" :disabled="!searchQuery.trim()">
            Søg
          </button>
        </form>

        <div class="search-hints">
          <p class="hint-title">Populære søgninger:</p>
          <div class="hint-tags">
            <button @click="handleQuickSearch('jakke')" class="hint-tag">Jakke</button>
            <button @click="handleQuickSearch('t-shirt')" class="hint-tag">T-shirt</button>
            <button @click="handleQuickSearch('sko')" class="hint-tag">Sko</button>
            <button @click="handleQuickSearch('bukser')" class="hint-tag">Bukser</button>
          </div>
        </div>
      </div>

      <div class="overlay-backdrop" @click="close"></div>
    </div>
  </Transition>
</template>

<style scoped>
.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
}

.search-container {
  background: white;
  padding: 20px;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #000;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  color: #666;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #000;
}

.search-form {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #999;
  font-size: 16px;
  pointer-events: none;
}

.search-overlay-input {
  width: 100%;
  padding: 14px 46px 14px 48px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.search-overlay-input:focus {
  outline: none;
  border-color: #000;
}

.clear-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  font-size: 18px;
  color: #999;
  cursor: pointer;
  padding: 8px;
}

.clear-btn:hover {
  color: #000;
}

.search-btn {
  padding: 14px 28px;
  background: #000;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.search-btn:hover:not(:disabled) {
  background: #333;
}

.search-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.search-hints {
  margin-top: 16px;
}

.hint-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  font-weight: 500;
}

.hint-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hint-tag {
  padding: 8px 16px;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  border-radius: 20px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.hint-tag:hover {
  background: #e5e5e5;
  border-color: #d5d5d5;
}

.overlay-backdrop {
  flex: 1;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Desktop - hide on large screens */
@media (min-width: 930px) {
  .search-overlay {
    display: none;
  }
}

/* Small mobile adjustments */
@media (max-width: 480px) {
  .search-form {
    flex-direction: column;
  }

  .search-btn {
    width: 100%;
  }

  .search-header h2 {
    font-size: 18px;
  }
}
</style>