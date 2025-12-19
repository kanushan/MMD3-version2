export default defineEventHandler(async (event) => {
    const { slug } = event.context.params;

    // Hent alle produkter fra JSON
    const productsModule = await import('~/data/products.json');
    const products = productsModule.default.products; // Tilføj .products her!

    // Find produktet med det givne slug
    const product = products.find((p) => p.slug === slug);

    // Hvis ikke fundet, smid 404
    if (!product) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Product not found',
        });
    }

    return product;
});