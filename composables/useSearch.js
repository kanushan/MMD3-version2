import { ref } from "vue";
import { useRouter } from "vue-router";

/* useSearch er en composable, der håndterer søgefunktionalitet i applikationen. Den gør det muligt at gemme søgeteksten reaktivt, opdatere den, rydde den og navigere til søgeresultater uden at komponenten selv skal bruge krafter på routing logikken. */
export const useSearch = () => {
  const router = useRouter();
  /* Reaktiv reference der holder på den aktuelle søgetekst */
  const searchQuery = ref("");

  /* handleSearch bruger enten den søgetekst, der sendes som argument, eller den aktuelle værdi fra searchQuery. Hvis teksten ikke er tom, navigerer funktionen automatisk til "/products" siden og tilføjer søgetermen som en URL query. encodeURIComponent sørger for, at søgetermen kan indgå i URL'en uden problemer med specialtegn. */

  const handleSearch = (query = null) => {
    const searchTermValue = query || searchQuery.value;

    if (searchTermValue && searchTermValue.trim()) {
      router.push(
        `/products?search=${encodeURIComponent(searchTermValue.trim())}`
      );
    }
  };

  /* clearSearch nulstiller den reaktive søgetekst til en tom streng, hvilket typisk bruges når man lukker søgefeltet eller vil starte en ny søgning. */
  const clearSearch = () => {
    searchQuery.value = "";
  };

  /* setSearchQuery giver mulighed for at sætte søgeteksten direkte, fx fra hurtigtags eller eksterne inputfelter, og opdaterer dermed den reaktive reference. */
  const setSearchQuery = (query) => {
    searchQuery.value = query;
  };

  /* Returnerer de reaktive data og funktioner, så komponenter der bruger useSearch kan binde inputfeltet til searchQuery, udføre søgninger med handleSearch, rydde feltet med clearSearch eller sætte søgetekst med setSearchQuery. */
  return {
    searchQuery,
    handleSearch,
    clearSearch,
    setSearchQuery,
  };
};
