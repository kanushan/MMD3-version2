export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);

        const productsModule = await import('../../data/products.json');
        const allProducts = productsModule.default.products;

        if (!allProducts) {
            throw new Error('Products array not found in JSON');
        }

        let filtered = [...allProducts];

        if (query.type) {
            filtered = filtered.filter(p => p.type === query.type);
        }

        if (query.category) {
            filtered = filtered.filter(p =>
                p.Kategori?.toLowerCase() === query.category.toLowerCase()
            );
        }

        if (query.subcategory) {
            filtered = filtered.filter(p =>
                p.UnderKategori?.toLowerCase() === query.subcategory.toLowerCase()
            );
        }

        if (query.brand) {
            filtered = filtered.filter(p =>
                p.Mærke?.toLowerCase() === query.brand.toLowerCase()
            );
        }

        if (query.search) {
            const searchLower = query.search.toLowerCase();
            filtered = filtered.filter(p =>
                p.ModelNavn?.toLowerCase().includes(searchLower) ||
                p.ProduktBeskrivelse?.toLowerCase().includes(searchLower)
            );
        }

        if (query.tags) {
            const tagArray = query.tags.split(',');
            filtered = filtered.filter(p =>
                p.tags?.some(tag => tagArray.includes(tag))
            );
        }

        return filtered;
    } catch (error) {
        console.error('API Error:', error);
        throw createError({
            statusCode: 500,
            message: 'Failed to load products: ' + error.message
        });
    }
});