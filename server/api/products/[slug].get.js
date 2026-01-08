export default defineEventHandler(async (event) => {
  /* Her henter vi slug parameteren fra URL'en, som angiver hvilket produkt brugeren vil se... Slugs er typisk nogle unikke tekststrenge, som identificerer produktetr. */
  const { slug } = event.context.params;

  /* Her importerer vi hele listen af produkter fra JSON filen, hvor alle vores produkter med al information ligger. Vi bruger import asynkront, så filen kun hentes når funktionen kaldes, hvilket gør koden mere effektiv og forhindrer, at flere scripts kører samtidig. */
  const productsModule = await import("~/data/products.json");

  /* vi trækker selve arrayet med produkter fra JSON objektet, hvor der i JSON filen kan indeholde flere ting, så vi tilgår ".products" for at få selve listen af produkter. */
  const products = productsModule.default.products;

  /* her søger vi så i listen af produkter efter det produkt, hvor slug matcher det vi har fået fra URL'en. Hvis der findes et produkt med den slug, gemmes det i variablen product. som kan ses i koden nedenfor */
  const product = products.find((p) => p.slug === slug);

  /* Hvis vi så ikke finder noget produkt med den slug, betyder det at produktet ikke eksisterer eller der kan være en fejl i vores JSON fil (hvilket i vores tilfælde der ikke kan være fordi det kommer til og ligge lokalt, men der kan ske fejæ hvis man skal hente det ned fra en backend). I så fald sender vi en fejl med status 404 og en besked, så brugeren ved at produktet ikke blev fundet. */
  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: "Product not found",
    });
  }

  /* Til sidst returnere vi det fundne produkt som brugeren har søgt efter , så clieten kan vise informationen om produktet visuelt på siden... */
  return product;
});
