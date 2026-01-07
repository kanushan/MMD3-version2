<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps({
  products: {
    type: Array,
    required: true
  }
});

const route = useRoute();
const router = useRouter();

const selectedCategory = ref('ALLE PRODUKTER');
const mobileOpen = ref(false);

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

// Funktion til at opdatere kategori fra URL
const updateCategoryFromRoute = () => {
  const query = route.query;
  
  // Hvis BoxensLook eller isNew, ingen kategori er aktiv
  if (query.BoxensLook || query.isNew) {
    selectedCategory.value = null;
    return;
  }
  
  // Check hvilken kategori der er aktiv fra URL
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
      } else {
        selectedCategory.value = null;
      }
    }
  } else {
    // Ingen category i URL = alle produkter
    selectedCategory.value = 'ALLE PRODUKTER';
  }
};

// Initialize from URL on mount
onMounted(() => {
  updateCategoryFromRoute();
});

// Watch for URL changes
watch(() => route.query, () => {
  updateCategoryFromRoute();
});

// Handle category click
const handleCategoryClick = (category) => {
  selectedCategory.value = category;
  
  const newQuery = { ...route.query };
  
  // Remove category, subcategory, BoxensLook og isNew
  delete newQuery.category;
  delete newQuery.subcategory;
  delete newQuery.BoxensLook;
  delete newQuery.isNew;
  
  if (category === 'ALLE PRODUKTER') {
    // Clear category filters
  } else if (category === 'BUKSER') {
    newQuery.category = 'Tøj';
    newQuery.subcategory = 'Bukser';
  } else if (category === 'JAKKER') {
    newQuery.category = 'Tøj';
    newQuery.subcategory = 'Jakke';
  } else if (category === 'T-SHIRTS') {
    newQuery.category = 'Tøj';
    newQuery.subcategory = 'Tshirt';
  } else if (category === 'HOODIES') {
    newQuery.category = 'Tøj';
    newQuery.subcategory = 'Hættetrøje';
  } else if (category === 'SWEATSHIRTS') {
    newQuery.category = 'Tøj';
    newQuery.subcategory = 'Striktrøje';
  } else if (category === 'SKO') {
    newQuery.category = 'Sko';
  }
  
  router.push({ query: newQuery });
  
  // Luk accordion på mobil efter valg
  mobileOpen.value = false;
};
</script>

<template>
  <div class="category-filters">
    <button
      v-for="(count, category) in categories"
      :key="category"
      class="category-btn"
      :class="{ active: selectedCategory === category }"
      @click="handleCategoryClick(category)"
    >
      {{ category }} ({{ count }})
    </button>
  </div>
</template>

<style scoped>
.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
}

.category-btn {
  flex: 1 1 auto;
  min-width: 140px;
  padding: 14px 32px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  border: 2px solid #000;
  background: white;
  color: #000;
  transition: all 0.2s;
  text-align: center;
}

.category-btn:hover {
  background: #000;
  color: white;
}

.category-btn.active {
  background: #000;
  color: white;
  border-color: #000;
}

/* Mobile styles */
@media (max-width: 930px) {
  .category-btn {
    font-size: 13px;
    padding: 10px 20px;
    min-width: 120px;
  }
}

@media (max-width: 600px) {
  .category-btn {
    font-size: 12px;
    padding: 8px 16px;
    min-width: 100px;
  }
}
</style>