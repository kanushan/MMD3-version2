export default defineEventHandler(async () => {
    const products = await import('~/data/products.json');
    return products.default;
});