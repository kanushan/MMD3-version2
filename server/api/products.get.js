export default defineEventHandler(async (event) => {
  try {
    /* Vi henter query parametre fra URL'en, som bruges til at filtrere produkter efter type, kategori, brand osv... i den kørende funktion */
    const query = getQuery(event);

    /* Under importere vi hele produktlisten fra JSON filen asynkront, så filen kun hentes når funktionen kaldes... igen er det bedre end vi køre flere unødvendige scripts af gangen... */
    const productsModule = await import("../../data/products.json");

    /* vi hiver selve arrayet med produkter fra JSON objektet ved hjælp af brug af linjen under*/
    const allProducts = productsModule.default.products;

    /* Hvis JSON filen ikke indeholder et products array, bliver der sendt en fejl afsted som displayer ("Products array not found in JSON") */
    if (!allProducts) {
      throw new Error("Products array not found in JSON");
    }

    /* Her starter vi med at lave en kopi af alle produkter, så vi har et separat array som vi kan filtrere baseret på query parametre uden at ændre det originale produkt array */
    let filtered = [...allProducts];

    /* Her filtrerer vi det kopierede produkt array efter type, hvis der er angivet en type i query. Dette betyder, at kun produkter som matcher den ønskede type bliver tilbage i det filtrerede array */
    if (query.type) {
      filtered = filtered.filter((p) => p.type === query.type);
    }

    /* Her filtrerer vi det kopierede produkt array efter kategorier, hvis query indeholder en kategori. Vi sammenligner kategori navnet fra produktet med den ønskede kategori fra query, begge bliver omdannet til små bogstaver for at sikre, at store og små bogstaver ikke påvirker resultatet */
    if (query.category) {
      filtered = filtered.filter(
        (p) => p.Kategori?.toLowerCase() === query.category.toLowerCase()
      );
    }

    /* Filtrer produkter efter underkategori, hvis query indeholder en subcategory */
    if (query.subcategory) {
      filtered = filtered.filter(
        (p) =>
          p.UnderKategori?.toLowerCase() === query.subcategory.toLowerCase()
      );
    }

    /* vi filtrere produkter efter brand, hvis query indeholder brand */
    if (query.brand) {
      filtered = filtered.filter(
        (p) => p.Mærke?.toLowerCase() === query.brand.toLowerCase()
      );
    }

    /* vi søger i produktnavn og beskrivelse, hvis query indeholder search parameter */
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.ModelNavn?.toLowerCase().includes(searchLower) ||
          p.ProduktBeskrivelse?.toLowerCase().includes(searchLower)
      );
    }

    /* vi filtrere produkter baseret på tags, hvis query indeholder tags som komma-separeret liste */
    if (query.tags) {
      const tagArray = query.tags.split(",");
      filtered = filtered.filter((p) =>
        p.tags?.some((tag) => tagArray.includes(tag))
      );
    }

    /* Når alle filtreringer er gennemført, returnerer vi det endelige array af produkter til klienten, så frontenden kan vise de produkter der matcher de valgte filtre */
    return filtered;
  } catch (error) {
    /* Hvis der opstår en fejl under afhentning eller filtrering af produkter, logges fejlen i konsollen for hvem enden der skal være developer for hjemmesiden, info og vi sender en serverfejl med status 500 til klienten, så brugeren får besked om at noget gik galt */
    console.error("API Error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to load products: " + error.message,
    });
  }
});
