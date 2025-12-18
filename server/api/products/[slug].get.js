export default defineEventHandler(async (event) => {
    // Læs slug fra URL'en, fx /api/products/basic-tshirt
    const { slug } = event.context.params;

    // Hent alle produkter fra vores JSON
    const productsModule = await import('~/data/products.json');
    const products = productsModule.default;

    // Find det produkt der matcher slug
    const product = products.find((p) => p.slug === slug);

    // Hvis ikke vi finder noget, smid en 404-fejl
    if (!product) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Product not found',
        });
    }

    // Returner produktet som JSON
    return product;
});
