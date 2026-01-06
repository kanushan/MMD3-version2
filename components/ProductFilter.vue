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
const selectedCategory = ref('ALLE PRODUKTER');
const searchTerm = ref('');
const selectedBrands = ref([]);
const priceRange = ref([0, 1200]);
const brandSearchTerm = ref('');

// Mobile filter accordion state
const mobileFiltersOpen = ref(false);

// Initialize filters from URL on mount
onMounted(() => {
  const query = route.query;
  
  // Set brand from URL
  if (query.brand) {
    const brands = Array.isArray(query.brand) ? query.brand : [query.brand];
    selectedBrands.value = brands;
  }
  
  // Set category from URL
  if (query.category) {
    if (query.category === 'Sko') {
      selectedCategory.value = 'SKO';
    } else if (query.category === 'Tøj') {
      if (query.subcategory === 'Tshirt') {
        selectedCategory.value = 'T-SHIRTS';
      } else if (query.subcategory === 'Striktrøje') {
        selectedCategory.value = 'SWEATSHIRTS';
      } else if (query.subcategory === 'Hættetrøje') {
        selectedCategory.value = 'HOODIES';
      } else if (query.subcategory === 'Jakke') {
        selectedCategory.value = 'JAKKER';
      } else if (query.subcategory === 'Bukser') {
        selectedCategory.value = 'BUKSER';
      }
    }
  }
  
  // Set subcategory for shoes
  if (query.subcategory && query.category === 'Sko') {
    selectedCategory.value = 'SKO';
  }
});

// Watch for URL changes
watch(() => route.query, (newQuery) => {
  if (newQuery.brand) {
    const brands = Array.isArray(newQuery.brand) ? newQuery.brand : [newQuery.brand];
    selectedBrands.value = brands;
  }
  
  if (newQuery.category) {
    if (newQuery.category === 'Sko') {
      selectedCategory.value = 'SKO';
    } else if (newQuery.category === 'Tøj') {
      if (newQuery.subcategory === 'Tshirt') {
        selectedCategory.value = 'T-SHIRTS';
      } else if (newQuery.subcategory === 'Striktrøje') {
        selectedCategory.value = 'SWEATSHIRTS';
      } else if (newQuery.subcategory === 'Hættetrøje') {
        selectedCategory.value = 'HOODIES';
      } else if (newQuery.subcategory === 'Jakke') {
        selectedCategory.value = 'JAKKER';
      } else if (newQuery.subcategory === 'Bukser') {
        selectedCategory.value = 'BUKSER';
      }
    }
  }
});

// Beregn kategorier med antal
const categories = computed(() => {
  return {
    'ALLE PRODUKTER': props.products.length,
    'BUKSER': props.products.filter(p => p.UnderKategori === 'Bukser').length,
    'JAKKER': props.products.filter(p => p.UnderKategori === 'Jakke').length,
    'T-SHIRTS': props.products.filter(p => p.UnderKategori === 'Tshirt').length,
    'HOODIES': props.products.filter(p => p.UnderKategori === 'Hættetrøje').length,
    'SWEATSHIRTS': props.products.filter(p => p.UnderKategori === 'Striktrøje').length,
    'SKO': props.products.filter(p => p.Kategori === 'Sko').length,
  };
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
    // Nyheder filter fra URL
    const query = route.query;
    if (query.isNew === 'true') {
      if (!product.isNew) return false;
    }

    // Kategori filter
    const categoryMatch = selectedCategory.value === 'ALLE PRODUKTER' ||
      (selectedCategory.value === 'BUKSER' && product.UnderKategori === 'Bukser') ||
      (selectedCategory.value === 'JAKKER' && product.UnderKategori === 'Jakke') ||
      (selectedCategory.value === 'T-SHIRTS' && product.UnderKategori === 'Tshirt') ||
      (selectedCategory.value === 'HOODIES' && product.UnderKategori === 'Hættetrøje') ||
      (selectedCategory.value === 'SWEATSHIRTS' && product.UnderKategori === 'Striktrøje') ||
      (selectedCategory.value === 'SKO' && product.Kategori === 'Sko');

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

    // Handle subcategory from URL for shoes
    let subcategoryMatch = true;
    if (query.subcategory && query.category === 'Sko') {
      subcategoryMatch = product.UnderKategori === query.subcategory;
    }

    return categoryMatch && searchMatch && brandMatch && priceMatch && subcategoryMatch;
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
  selectedCategory.value = 'ALLE PRODUKTER';
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
  if (selectedCategory.value !== 'ALLE PRODUKTER') count++;
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

    <!-- Category Filters -->
    <div class="category-filters" :class="{ 'mobile-hidden': !mobileFiltersOpen }">
      <button
        v-for="(count, category) in categories"
        :key="category"
        class="category-btn"
        :class="{ active: selectedCategory === category }"
        @click="selectedCategory = category"
      >
        {{ category }} ({{ count }})
      </button>
    </div>

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

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.category-btn {
  padding: 10px 24px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #ddd;
  background: white;
  color: #333;
  transition: all 0.2s;
}

.category-btn:hover {
  background: #f5f5f5;
}

.category-btn.active {
  background: #000;
  color: white;
  border-color: #000;
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
  /* Vis mobile filter toggle knap */
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

  /* Skjul filtre som standard på mobil */
  .mobile-hidden {
    display: none;
  }

  .category-filters {
    flex-wrap: wrap;
  }

  .category-btn {
    font-size: 13px;
    padding: 8px 20px;
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

  .category-btn {
    font-size: 12px;
    padding: 7px 16px;
  }

  .filter-box {
    padding: 12px;
  }
}
</style>