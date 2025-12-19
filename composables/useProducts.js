export const useProducts = (filters = {}) => {
    const query = new URLSearchParams();

    if (filters.type) query.append('type', filters.type);
    if (filters.category) query.append('category', filters.category);
    if (filters.subcategory) query.append('subcategory', filters.subcategory);
    if (filters.brand) query.append('brand', filters.brand);
    if (filters.search) query.append('search', filters.search);
    if (filters.tags) query.append('tags', filters.tags);

    const queryString = query.toString();
    const url = queryString ? `/api/products?${queryString}` : '/api/products';

    const { data, pending, error, refresh } = useFetch(url);

    return {
        products: data,
        loading: pending,
        error,
        refresh
    };
};