import { ref, computed } from 'vue';

const favorites = ref([]);

/* Hvis vi besøger webshoppen, prøver vi at hente gemte favoritter fra localStorage, det betyder at den tjekker om denne browser har været på siden før og om de har gemt nogle favoritter. Dette sikrer, at favoritter huskes mellem sideopdateringer og besøg fra samme enhed.*/
if (process.client) {
  const stored = localStorage.getItem('favorites');
  if (stored) {
    try {
      /* den analysere JSON-strengen fra localStorage og gemmer det i favorites. Det fungerer ved at tage det JSON som ligger i localStorage og parse det til et eller flere objekter */
      favorites.value = JSON.parse(stored);
    } catch (e) {
      /* Hvis parsing fejler, logges fejlen, så vi kan debugge data som ikke virker */
      console.error('Failed to load favorites:', e);
    }
  }
}

/* useFavorites composable giver funktionalitet til at håndtere favoritter. Man kan returnerer metoder og computed værdier, som komponenter kan bruge. */
export const useFavorites = () => {

  /* AddToFavorites tilføjer et produkt til favoritterne hvis det ikke allerede findes i listen. Efter tilføjelse opdateres localStorage for at gemme ændringen. */
  const addToFavorites = (product) => {
    if (!isFavorite(product.id)) {
      favorites.value.push(product);
      saveFavorites();
    }
  };

  /* RemoveFromFavorites fjerner et produkt fra favoritter ved at sammenligne id'erne i arrayet og beholder alle dem der ikke matcher det id vi gerne vil fjerne. Vi gemmer det nye array med saveFavorites */
  const removeFromFavorites = (productId) => {
    favorites.value = favorites.value.filter(p => p.id !== productId);
    saveFavorites();
  };

  /* ToggleFavorite toggler favoritstatus for et produkt. Hvis det allerede er i favoritter, fjernes det. Hvis det ikke er i favoritter, tilføjes det. ved at kalde henholdsvis addToFavorites og removeFromFavorites */
  const toggleFavorite = (product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  /* Tjekker om et produkt er i favoritterne ved at bruge some() hvor den derefter returnerer "true" hvis produktets id findes i listen. Den returnerer `false` ellers. Den bruges til at vise hjerterne som fyldte hvis de er favoritiseret */
  const isFavorite = (productId) => {
    return favorites.value.some(p => p.id === productId);
  };

  /* Her gemmes den aktuelle favoritliste til localStorage for at sikre at favoritter huskes mellem sideopdateringer. Her er det kun på klienten (process.client), da server side rendering ikke har localStorage. */
  const saveFavorites = () => {
    if (process.client) {
      localStorage.setItem('favorites', JSON.stringify(favorites.value));
    }
  };

  /* getFavorites er en computed property der returnerer favoritlisten reaktivt. Dette betyder at komponenter, der bruger getFavorites, automatisk opdateres når favorites ændres (når produkter tilføjes eller fjernes). */
  const getFavorites = computed(() => favorites.value);

  /* favoritesCount er en computed property der returnerer antal favoritter. Her kan man bruge det til at vise badge med antal favoritter i UI som vi har i top højre hjørne af vores navbar  */
  const favoritesCount = computed(() => favorites.value.length);

  /* til sidst bliver alt returneret, så vi kan bruge dem på tværs af webshoppens komponenter og sider ved brug af useFavorites */
  return {
    favorites: getFavorites,
    favoritesCount,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite
  };
};
