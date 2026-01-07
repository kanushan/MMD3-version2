<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps({
  products: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['filtered']);

const route = useRoute();
const router = useRouter();

// State
const searchTerm = ref('');
const selectedBrands = ref([]);
const priceRange = ref([0, 1200]);
const brandSearchTerm = ref('');

// Mobile filter accordion state
const mobileFiltersOpen = ref(false);

// Initialize filters from URL on mount
onMounted(() => {
  const query = route.query;
  
  // Set search term from URL
  if (query.search) {
    searchTerm.value = query.search;
  }
  
  // Set brand from URL
  if (query.brand) {
    const brands = Array.isArray(query.brand) ? query.brand : [query.brand];
    selectedBrands.value = brands;
  }
});

// Watch for URL changes
watch(() => route.query, (newQuery) => {
  // Update search term
  if (newQuery.search) {
    searchTerm.value = newQuery.search;
  } else {
    searchTerm.value = '';
  }
  
  if (newQuery.brand) {
    const brands = Array.isArray(newQuery.brand) ? newQuery.brand : [newQuery.brand];
    selectedBrands.value = brands;
  }
});

// Hent alle unikke brands
const allBrands = computed(() => {
  return [...new Set(props.products.map(p => p.Mærke))].sort();
});

// Filtrer brands baseret på søgning
const filteredBrands = computed(() => {
  if (!brandSearchTerm.value) return allBrands.value;
  return allBrands.value.filter(brand => 
    brand.toLowerCase().includes(brandSearchTerm.value.toLowerCase())
  );
});

// Accordion state
const brandAccordionOpen = ref(true);
const priceAccordionOpen = ref(true);

// Filter produkter
const filteredProducts = computed(() => {
  return props.products.filter(product => {
    const query = route.query;
    
    // Nyheder filter fra URL - early return hvis ikke match
    if (query.isNew === 'true') {
      if (!product.isNew) return false;
    }

    // BoxensLook filter fra URL - early return hvis ikke match
    if (query.BoxensLook === 'true') {
      if (!product.BoxensLook) return false;
    }

    // Kategori filter - kun hvis ikke isNew eller BoxensLook filter
    let categoryMatch = true;
    
    // Hvis der er en category i URL
    if (query.category) {
      if (query.category === 'Tøj') {
        if (query.subcategory) {
          categoryMatch = product.Kategori === 'Tøj' && product.UnderKategori === query.subcategory;
        } else {
          categoryMatch = product.Kategori === 'Tøj';
        }
      } else if (query.category === 'Sko') {
        if (query.subcategory) {
          categoryMatch = product.Kategori === 'Sko' && product.UnderKategori === query.subcategory;
        } else {
          categoryMatch = product.Kategori === 'Sko';
        }
      }
    }

    // Søge filter
    const searchMatch = searchTerm.value === '' ||
      product.ModelNavn.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      product.ProduktBeskrivelse?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.value.toLowerCase()));

    // Brand filter
    const brandMatch = selectedBrands.value.length === 0 || 
      selectedBrands.value.includes(product.Mærke);

    // Pris filter
    const priceMatch = product.Pris >= priceRange.value[0] && 
      product.Pris <= priceRange.value[1];

    return categoryMatch && searchMatch && brandMatch && priceMatch;
  });
});

// Emit filtered products når de ændres
watch(filteredProducts, (newVal) => {
  emit('filtered', newVal);
}, { immediate: true });

// Toggle brand selection
const toggleBrand = (brand) => {
  const index = selectedBrands.value.indexOf(brand);
  if (index > -1) {
    selectedBrands.value.splice(index, 1);
  } else {
    selectedBrands.value.push(brand);
  }
};

// Clear all filters
const clearFilters = () => {
  searchTerm.value = '';
  selectedBrands.value = [];
  priceRange.value = [0, 1200];
  brandSearchTerm.value = '';
  
  // Clear URL query params
  router.push({ query: {} });
};

// Count active filters
const activeFiltersCount = computed(() => {
  let count = 0;
  if (searchTerm.value) count++;
  if (selectedBrands.value.length > 0) count += selectedBrands.value.length;
  if (priceRange.value[0] !== 0 || priceRange.value[1] !== 1200) count++;
  return count;
});
</script>

<template>
  <div class="filter-container">
    <!-- Mobile Filter Toggle Button -->
    <button 
      class="mobile-filter-toggle" 
      @click="mobileFiltersOpen = !mobileFiltersOpen"
    >
      <i class="fa-solid fa-filter"></i>
      <span>Filtre</span>
      <span v-if="activeFiltersCount > 0" class="filter-badge">{{ activeFiltersCount }}</span>
      <i class="fa-solid fa-chevron-down" :class="{ 'rotate': mobileFiltersOpen }"></i>
    </button>

    <!-- Sidebar Filters -->
    <div class="sidebar" :class="{ 'mobile-hidden': !mobileFiltersOpen }">
      <!-- Search Filter -->
      <div class="filter-box">
        <h3>Søg</h3>
        <div class="search-wrapper">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            v-model="searchTerm"
            type="text"
            class="search-input"
            placeholder="Søg produkter..."
          >
        </div>
      </div>

      <!-- Brand Filter -->
      <div class="filter-box">
        <h3 
          class="accordion"
          :class="{ collapsed: !brandAccordionOpen }"
          @click="brandAccordionOpen = !brandAccordionOpen"
        >
          Mærke
        </h3>
        <div 
          class="filter-content"
          :class="{ collapsed: !brandAccordionOpen }"
        >
          <div class="search-wrapper" style="margin-bottom: 12px;">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              v-model="brandSearchTerm"
              type="text"
              class="search-input"
              placeholder="Søg mærke..."
            >
          </div>
          <div class="brand-list">
            <div
              v-for="brand in filteredBrands"
              :key="brand"
              class="brand-item"
            >
              <input
                :id="`brand-${brand}`"
                type="checkbox"
                :checked="selectedBrands.includes(brand)"
                @change="toggleBrand(brand)"
              >
              <label :for="`brand-${brand}`">{{ brand }}</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Price Filter -->
      <div class="filter-box">
        <h3 
          class="accordion"
          :class="{ collapsed: !priceAccordionOpen }"
          @click="priceAccordionOpen = !priceAccordionOpen"
        >
          Pris
        </h3>
        <div 
          class="filter-content"
          :class="{ collapsed: !priceAccordionOpen }"
        >
          <div class="price-filter">
            <div class="price-range">
              <label>Min: {{ priceRange[0] }} kr</label>
              <input
                v-model.number="priceRange[0]"
                type="range"
                min="0"
                max="1200"
                step="50"
              >
            </div>
            <div class="price-range">
              <label>Max: {{ priceRange[1] }} kr</label>
              <input
                v-model.number="priceRange[1]"
                type="range"
                min="0"
                max="1200"
                step="50"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Clear Filters Button -->
      <button class="clear-btn" @click="clearFilters">
        Ryd alle filtre
      </button>
    </div>
  </div>
</template>

<style scoped>
.filter-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Mobile Filter Toggle Button - kun synlig på mobil */
.mobile-filter-toggle {
  display: none;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.filter-box {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-box h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #111;
}

.filter-box h3.accordion {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-box h3.accordion::after {
  content: '▼';
  font-size: 10px;
  transition: transform 0.2s;
}

.filter-box h3.accordion.collapsed::after {
  transform: rotate(-90deg);
}

.filter-content {
  max-height: 500px;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.filter-content.collapsed {
  max-height: 0;
}

.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 14px;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #000;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.brand-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.brand-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.brand-item input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.brand-item label {
  margin-left: 8px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  flex: 1;
}

.price-filter {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.price-range {
  display: flex;
  flex-direction: column;
}

.price-range label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.price-range input[type="range"] {
  width: 100%;
}

.clear-btn {
  width: 100%;
  padding: 10px;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  color: #333;
  transition: background 0.2s;
}

.clear-btn:hover {
  background: #e5e5e5;
}

/* Mobile styles - under 930px */
@media (max-width: 930px) {
  .mobile-filter-toggle {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .mobile-filter-toggle:hover {
    background: #f5f5f5;
  }

  .mobile-filter-toggle i:first-child {
    font-size: 16px;
  }

  .mobile-filter-toggle i:last-child {
    margin-left: auto;
    transition: transform 0.3s;
  }

  .mobile-filter-toggle i.rotate {
    transform: rotate(180deg);
  }

  .filter-badge {
    background: #000;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
  }

  .mobile-hidden {
    display: none;
  }

  .filter-box {
    padding: 14px;
  }

  .filter-box h3 {
    font-size: 13px;
  }

  .search-input {
    font-size: 13px;
    padding: 7px 12px 7px 34px;
  }

  .brand-list {
    max-height: 200px;
  }

  .brand-item label {
    font-size: 13px;
  }

  .clear-btn {
    font-size: 13px;
    padding: 9px;
  }
}

@media (max-width: 600px) {
  .mobile-filter-toggle {
    padding: 10px 14px;
    font-size: 14px;
  }

  .filter-box {
    padding: 12px;
  }
}
</style>