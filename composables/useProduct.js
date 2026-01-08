/* Her har vi en const der hedder useProduct composable der henter data for et enkelt produkt baseret på dets slug. Den returnerer produktdata, loading status og fejl hvis der opstår en fejl i processen eller dataen ikke er tilgængeligt. */
export const useProduct = (slug) => {
  /* useFetch bruges til at hente data fra API’et. URL’en "/api/products/${slug}" betyder, at vi henter produktet med det specifikke slug "data" som er det reaktive objekt der indeholder produktdata når det er hentet. "pending" er en boolean der viser om fetch stadig kører. "error" er et reaktivt objekt der indeholder fejlinfo, hvis fetch fejler. */
  const { data, pending, error } = useFetch(`/api/products/${slug}`);

  /* Returnér et simpelt objekt, som komponenter kan bruge */
  return {
    product: data,
    loading: pending,
    error,
  };
};
