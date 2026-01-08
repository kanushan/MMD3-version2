import { ref, computed } from 'vue';

const favorites = ref([]);

/* Hvis vi kører på klienten (browseren), prøver vi at hente gemte favoritter fra localStorage. Dette sikrer, at favoritter huskes mellem sideopdateringer.*/
if (process.client) {
  const stored = localStorage.getItem('favorites');
  if (stored) {
    try {
      /* den analysere JSON-strengen fra localStorage og gemmer det i favorites. (det er et program der analysere data som hedder parser) */
      favorites.value = JSON.parse(stored);
    } catch (e) {
      /* Hvis parsing fejler, logges fejlen, så vi kan debugge data som ikke virker */
      console.error('Failed to load favorites:', e);
    }
  }
}

/* useFavorites composable giver funktionalitet til at håndtere favoritter. Man kan returnerer metoder og computed værdier, som komponenter kan bruge. */
export const useFavorites = () => {

  /* Her bliver der tilføjet et produkt til favoritterne, hvis det ikke allerede findes. "product" er et objekt med produktdata. der bliver tjekket først med `isFavorite` for at undgå kopieringer. derefter bliver gemmer listen til localStorage for persistens. */
  const addToFavorites = (product) => {
    if (!isFavorite(product.id)) {
      favorites.value.push(product);
      saveFavorites();
    }
  };

  /* RemoveFromFavorites fjerner et produkt fra favoritterne baseret på produktets id. Den filterer alle produkter fra listen, der ikke matcher id'et og opdaterer localStorage efter ændring. */
  const removeFromFavorites = (productId) => {
    favorites.value = favorites.value.filter(p => p.id !== productId);
    saveFavorites();
  };

  /* ToggleFavorite toggler favoritstatus for et produkt der gøre hvis produktet allerede er i favoritter, fjernes det... Hvis produktet ikke er i favoritter, tilføjes det og bruges ved klik på "hjerte" ikon. */
  const toggleFavorite = (product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  /* Checker om et produkt er i favoritterne hvor den derefter returnerer "true" hvis produktets id findes i listen. Den returnerer `false` ellers... den bruges f.eks. til at vise fyldt med en solid fill med en rød farve hvis hjertet af produktet allerede er gjort til en favorit. */
  const isFavorite = (productId) => {
    return favorites.value.some(p => p.id === productId);
  };

  /* Her gemmer den aktuelle favoritliste til localStorage for at sikrer at favoritter huskes mellem sideopdateringer. Her er det kun på klienten, da server side rendering ikke har localStorage. */
  const saveFavorites = () => {
    if (process.client) {
      localStorage.setItem('favorites', JSON.stringify(favorites.value));
    }
  };

  /* Computed property der returnerer alle favoritter reaktivt gør det nemt for komponenter at lytte til ændringer i listen. */
  const getFavorites = computed(() => favorites.value);

  /* Computed property der returnerer antal favoritter. Her kan man bruge det til at vise badge med antal favoritter i Ui som vi har i top højre hjørne af vores navbar  */
  const favoritesCount = computed(() => favorites.value.length);

  /* til sidst bliver at returneret hvor alle funktioner og computed værdier bliver kørt igennem */
  return {
    favorites: getFavorites,
    favoritesCount,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite
  };
};
