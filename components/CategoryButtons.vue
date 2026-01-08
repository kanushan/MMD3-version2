<script setup>
/* Vi definerer props så komponenten kan modtage et array af produkter fra parent komponenten. 
   Dette array skal indeholde alle relevante produktdata såsom navn, kategori og underkategori. 
   Det er påkrævet fordi resten af komponenten er afhængig af det for at kunne vise produkter og tælle dem i kategorier. */
const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
});

/* Vi bruger Vue Routing for at få adgang til URL'en. Med useRoute kan vi læse query parametre fra URL'en (fx ?category=Tøj&subcategory=Bukser), 
   og med useRouter kan vi opdatere URL'en uden at reloade siden, så UX føles hurtig og dynamisk. */
const route = useRoute();
const router = useRouter();

/* Reaktive variabler til at holde styr på hvilkee kategorier brugeren har valgt (selectedCategory) og om mobil menuen/accordion er åben (mobileOpen)... Det gør det muligt for Vue at opdatere det visuelle automatisk når disse værdier ændres. */
const selectedCategory = ref("ALLE PRODUKTER");
const mobileOpen = ref(false);

/* Computed property er noget som dynamisk tæller antallet af produkter i hver kategori. Den kører automatisk når products ændres. Her bruges filter til at tælle underkategorier (fx "Bukser", "Tshirt") og hovedkategori ("Sko"). Det gør at kategorilisten kan vise fx "BUKSER (12)", hvor 12 er antallet af bukser i data. */
const categories = computed(() => {
  return {
    "ALLE PRODUKTER": props.products.length,
    BUKSER: props.products.filter((p) => p.UnderKategori === "Bukser").length,
    JAKKER: props.products.filter((p) => p.UnderKategori === "Jakke").length,
    "T-SHIRTS": props.products.filter((p) => p.UnderKategori === "Tshirt")
      .length,
    HOODIES: props.products.filter((p) => p.UnderKategori === "Hættetrøje")
      .length,
    SWEATSHIRTS: props.products.filter((p) => p.UnderKategori === "Striktrøje")
      .length,
    SKO: props.products.filter((p) => p.Kategori === "Sko").length,
  };
});

/* Funktion til at opdatere den valgte kategori baseret på URL query-parametre. Dette sikrer at UI og URL altid er synkroniseret. Fx hvis brugeren deler link med ?category=Tøj&subcategory=Bukser, vil selectedCategory automatisk blive "BUKSER". */
const updateCategoryFromRoute = () => {
  const query = route.query;

  /* Hvis BoxensLook eller isNew er i query, betyder det at ingen kategori skal markeres, fx ved særlige kampagner. */
  if (query.BoxensLook || query.isNew) {
    selectedCategory.value = null;
    return;
  }

  /* Tjek hvilken kategori eller subkategori der står i URL, og sæt selectedCategory tilsvarende */
  if (query.category) {
    if (query.category === "Sko") {
      selectedCategory.value = "SKO";
    } else if (query.category === "Tøj") {
      if (query.subcategory === "Tshirt") selectedCategory.value = "T-SHIRTS";
      else if (query.subcategory === "Striktrøje")
        selectedCategory.value = "SWEATSHIRTS";
      else if (query.subcategory === "Hættetrøje")
        selectedCategory.value = "HOODIES";
      else if (query.subcategory === "Jakke") selectedCategory.value = "JAKKER";
      else if (query.subcategory === "Bukser")
        selectedCategory.value = "BUKSER";
      else selectedCategory.value = null; // Hvis subkategori ikke findes
    }
  } else {
    /* Hvis ingen kategori i URL, bliver alle produkter vist */
    selectedCategory.value = "ALLE PRODUKTER";
  }
};

/* Når komponenten mountes første gang, opdateres selectedCategory fra URL. 
   Det sikrer at siden viser korrekt kategori hvis brugeren loader direkte på en URL med query parametre. */
onMounted(() => {
  updateCategoryFromRoute();
});

/* Watcher er en Vue funktion som observere en eller flere ændringer i URL query. Hvis brugeren fx navigerer med browserens tilbage eller forward knapper, opdateres selectedCategory automatisk uden at reload siden. */
watch(
  () => route.query,
  () => {
    updateCategoryFromRoute();
  }
);

/* Funktion til håndtering af klik på en kategori i UI. Den opdaterer selectedCategory og samtidig URL'ens query parametre så derefter matcher brugerens valg. */
const handleCategoryClick = (category) => {
  selectedCategory.value = category;

  const newQuery = { ...route.query };

  /* Fjern tidligere kategori, subkategori og specielle parametre som BoxensLook og isNew */
  delete newQuery.category;
  delete newQuery.subcategory;
  delete newQuery.BoxensLook;
  delete newQuery.isNew;

  /* Sæt nye query parametre baseret på valgt kategori */
  if (category === "ALLE PRODUKTER") {
    /* hvis der ingen filtrering er sat på bliver der vist alle produkter */
  } else if (category === "BUKSER") {
    newQuery.category = "Tøj";
    newQuery.subcategory = "Bukser";
  } else if (category === "JAKKER") {
    newQuery.category = "Tøj";
    newQuery.subcategory = "Jakke";
  } else if (category === "T-SHIRTS") {
    newQuery.category = "Tøj";
    newQuery.subcategory = "Tshirt";
  } else if (category === "HOODIES") {
    newQuery.category = "Tøj";
    newQuery.subcategory = "Hættetrøje";
  } else if (category === "SWEATSHIRTS") {
    newQuery.category = "Tøj";
    newQuery.subcategory = "Striktrøje";
  } else if (category === "SKO") {
    newQuery.category = "Sko";
  }

  /* Opdater URL'en med de nye query parametre uden reload */
  router.push({ query: newQuery });

  /* Luk mobil menuen efter valg, så UX på mobil bliver bedre og brugeren ser resultatet af valget direkte */
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
