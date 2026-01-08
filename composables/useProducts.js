/*  useProducts composable henter en liste af produkter fra API’et med mulighed for filtre. Den returnerer produkter, loading-status, fejl og en refresh-funktion. */
export const useProducts = (filters = {}) => {
  /* her bliver der oprettet et URLSearchParams (URLSearchParams er en indbygget javascript klasse som gør det nemt at arbejde med URL query strings... Den bruges til at bygge, læse eller ændre ændre query parametre i en URL) objekt til at bygge query string */
  const query = new URLSearchParams();

  /* Vi tilføjer filtre til query string, hvis de findes */
  if (filters.type)
    /* Filter på produkt type */
    query.append("type", filters.type);
  if (filters.category)
    /* Filter på kategori */
    query.append("category", filters.category);
  if (filters.subcategory)
    query.append(
      "subcategory",
      filters.subcategory
    ); /* Filter på underkategori */
  /* Filter på mærke */
  if (filters.brand) query.append("brand", filters.brand);
  if (filters.search)
    /* Filter på søgeord */
    query.append("search", filters.search);
  /* Filter på tags */
  if (filters.tags) query.append("tags", filters.tags);

  /* der bliver konverter query params til en streng */
  const queryString = query.toString();

  /* vi bygger en API URL, inkl. query string hvis den ikke er tom */
  const url = queryString ? `/api/products?${queryString}` : "/api/products";

  /* Hent produkter fra API'en med useFetch på den angivne URL. useFetch gør data reaktiv, så komponenten automatisk opdateres, når API-kaldet fuldføres. Den returnerer et objekt med data, som indeholder produktlisten, pending, som er tilstanden der bliver vist, når fetch stadig kører. Error, som indeholder fejlinformation hvis fetch fejler, og refresh, en funktion til manuelt at genindlæse data uden at genloade siden. Dette gør det muligt at vise produktlisten dynamisk, håndtere loading-tilstande og fejl på en enkel måde. */
  const { data, pending, error, refresh } = useFetch(url);

  /* her retunere objektet med alle nyttige værdier */
  return {
    products: data,
    loading: pending,
    error,
    refresh,
  };
};
