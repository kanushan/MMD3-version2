<script setup>
/* Vi definerer props, som gør det muligt for komponenten at modtage data fra parent komponenten.
   Her modtager vi en liste af produkter (products), som er et Array og et påkrævet felt. */
const props = defineProps({
  products: {
    type: Array,
    required: true
  }
})

/* Vi definerer et event, som komponenten kan udsende til parent komponenten.
   Eventet hedder "filtered" og bruges til at sende de filtrerede produkter tilbage. */
const emit = defineEmits(['filtered'])

/* Vi bruger router hooks til at arbejde med URL'en som "useRoute" giver adgang til de aktuelle query parametre (fx ?brand=LVL)... useRouter gør det muligt at ændre URL'en uden at genindlæse siden. */
const route = useRoute()
const router = useRouter()

/* Reaktive variabler der holder styr på ting som searchTerm som gøre tekst brugeren skriver i søgefeltet. der kan også bruges til selectedBrands som hvilke brands der er valgt i filteret. eller priceRange som det valgte prisinterval (min og max) og mere som brandSearchTerm som søgefelt til filtrering af mærker inde i filteret er som hvad vi har fundet frem til som løsning */
const searchTerm = ref('')
const selectedBrands = ref([])
const priceRange = ref([0, 1200])
const brandSearchTerm = ref('')

/* simple boolean der observere og styrer om mobilens filter menu er åben eller ej... */
const mobileFiltersOpen = ref(false)

/* Når komponenten loader første gang (onMounted), tjekkes URL'en for eksisterende filtre. Hvis der fx står ?search=jeans, sættes søgefeltet automatisk til "jeans" og hvis der står ?brand=LVL, vælges det brand automatisk i filteret. */
onMounted(() => {
  const query = route.query
  if (query.search) {
    searchTerm.value = query.search
  }
  if (query.brand) {
    const brands = Array.isArray(query.brand) ? query.brand : [query.brand]
    selectedBrands.value = brands
  }
})

/* Watch observere ændringer i URL'en. Hvis brugeren navigerer frem og tilbage i browseren, bliver filtrene opdateret, så de matcher den aktuelle URL. */
watch(() => route.query, (newQuery) => {
  if (newQuery.search) {
    searchTerm.value = newQuery.search
  } else {
    searchTerm.value = ''
  }
  if (newQuery.brand) {
    const brands = Array.isArray(newQuery.brand) ? newQuery.brand : [newQuery.brand]
    selectedBrands.value = brands
  }
})

/* computed laver en liste over alle unikke brands i produktlisten. Vi bruger "Set" til at fjerne kopier af andre produkter og ".sort()" til at sortere alfabetisk. */
const allBrands = computed(() => {
  return [...new Set(props.products.map(p => p.Mærke))].sort()
})

/* Her filtreres brands baseret på brugerens input i brands søgefeltet. Hvis brugeren fx skriver "jack", vises kun mærker der indeholder "jack" så som jack & jones... */
const filteredBrands = computed(() => {
  if (!brandSearchTerm.value) return allBrands.value
  return allBrands.value.filter(brand => 
    brand.toLowerCase().includes(brandSearchTerm.value.toLowerCase())
  )
})

/* Accordion state styrer om pris og brandfiltrene er åbne eller lukkede */
const brandAccordionOpen = ref(true)
const priceAccordionOpen = ref(true)

/* Her foregår den egentlige filtrering af produkterne. Computed sørger for automatisk at opdatere listen, når brugeren ændrer noget i filtrene. */
const filteredProducts = computed(() => {
  return props.products.filter(product => {
    const query = route.query

 /* Filtrer nye produkter, hvis isNew=true i URL'en */
    if (query.isNew === 'true') {
      if (!product.isNew) return false
    }

    /* Filtrer produkter der hører til "BoxensLook" */
    if (query.BoxensLook === 'true') {
      if (!product.BoxensLook) return false
    }

    /* Match kategori og underkategori (fx "Tøj" og "Bukser") */
    let categoryMatch = true
    if (query.category) {
      if (query.category === 'Tøj') {
        if (query.subcategory) {
          categoryMatch = product.Kategori === 'Tøj' && product.UnderKategori === query.subcategory
        } else {
          categoryMatch = product.Kategori === 'Tøj'
        }
      } else if (query.category === 'Sko') {
        if (query.subcategory) {
          categoryMatch = product.Kategori === 'Sko' && product.UnderKategori === query.subcategory
        } else {
          categoryMatch = product.Kategori === 'Sko'
        }
      }
    }

    /* Søgefilteret tjekker navn, beskrivelse, mærke, kategori, underkategori og tags på de forskellige produkter som gøre søgning mere effektivt og giver bedre resultater. */
    const searchMatch = searchTerm.value === '' ||
      product.ModelNavn?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      product.ProduktBeskrivelse?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      product.Mærke?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      product.Kategori?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      product.UnderKategori?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.value.toLowerCase()))

    /* Brand filter viser hvis ingen brand er valgt, ellers vises alle produkter */
    const brandMatch = selectedBrands.value.length === 0 || 
      selectedBrands.value.includes(product.Mærke)

    /* Det samme sker hernede som ovenover med filtrering */
    const priceMatch = product.Pris >= priceRange.value[0] && 
      product.Pris <= priceRange.value[1]

    /* Et produkt bliver kun vist, hvis det matcher alle kriterier */
    return categoryMatch && searchMatch && brandMatch && priceMatch
  })
})

/* Når listen over filtrerede produkter ændrer sig, sender vi dem til parent komponenten. Dette sker automatisk, også første gang komponenten loader. */
watch(filteredProducts, (newVal) => {
  emit('filtered', newVal)
}, { immediate: true })

/* Funktion til at håndtere valg og fravalg af brands i filteret. Når brugeren klikker på et brand i listen, tjekker vi først om det allerede findes i "selectedBrands". Hvis brandet allerede er valgt (hvor det findes i arrayet), bliver det fjernet ved hjælp af splice(). Eller hvis brandet ikke findes, bliver det tilføjet til arrayet med push(). På den måde fungerer funktionen som en "toggle" hvor hver klik skifter mellem valgt og ikke tilvalgt. Dette gør det muligt for brugeren at vælge flere brands på samme tid. */
const toggleBrand = (brand) => {
  const index = selectedBrands.value.indexOf(brand)
  if (index > -1) {
    selectedBrands.value.splice(index, 1)
  } else {
    selectedBrands.value.push(brand)
  }
}


/* 
Funktion til at nulstille ALLE filtre i produktlisten og gendanne standardindstillingerne. det vil sige når brugeren klikker på "Ryd alle filtre" knappen, udføres følgende funktioner så som searchTerm der bliver tømt, så der ikke længere søges på tekst og selectedBrands bliver sat til et tomt array, så ingen mærker er markeret. priceRange bliver nulstillet til standardværdien [0, 1200], så alle priser vises igen og brandSearchTerm bliver tømt, så mærke søgefeltet ikke filtrerer listen. Til sidst opdateres URL’en ved hjælp af router.push({ query: {} }), hvilket fjerner alle query parametre (som fx ?brand= eller ?search=) fra adresselinjen.

Så i alt hvad denne funktion gøre er bare et reset af filteret... Denne funktion giver brugeren en hurtig måde at starte forfra uden at skulle manuelt fjerne hvert enkelt filter.*/
const clearFilters = () => {
  searchTerm.value = ''
  selectedBrands.value = []
  priceRange.value = [0, 1200]
  brandSearchTerm.value = ''
  router.push({ query: {} })
}


/* computed tæller hvor mange filtre der er aktive. Det bruges fx til at vise et badge med antal aktive filtre på mobil. */
const activeFiltersCount = computed(() => {
  let count = 0
  if (searchTerm.value) count++
  if (selectedBrands.value.length > 0) count += selectedBrands.value.length
  if (priceRange.value[0] !== 0 || priceRange.value[1] !== 1200) count++
  return count
})
</script>


<template>
  <div class="filter-container">
    <button 
      class="mobile-filter-toggle" 
      @click="mobileFiltersOpen = !mobileFiltersOpen"
    >
      <i class="fa-solid fa-filter"></i>
      <span>Filtre</span>
      <span v-if="activeFiltersCount > 0" class="filter-badge">{{ activeFiltersCount }}</span>
      <i class="fa-solid fa-chevron-down" :class="{ 'rotate': mobileFiltersOpen }"></i>
    </button>

    <div class="sidebar" :class="{ 'mobile-hidden': !mobileFiltersOpen }">
      <div class="mobile-categories">
        <slot name="categories"></slot>
      </div>

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

      <button class="clear-button" @click="clearFilters">
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

.mobile-filter-toggle {
  display: none;
}

.mobile-categories {
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
  color: #111111;
}

.filter-box h3.accordion {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-box h3.accordion::after {
  content: '';
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
  margin-bottom: 12px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #8E8E8E;
  font-size: 14px;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #8E8E8E;
  border-radius: 8px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #111111;
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
  color: #111111;
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

.clear-button {
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

.clear-button:hover {
  background: #e5e5e5;
}

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
    background: #FAFAFA;
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
    color: #FAFAFA;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
  }

  .mobile-categories {
    display: block;
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

  .clear-button {
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
