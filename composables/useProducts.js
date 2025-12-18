export const useProducts = () => {
    const { data, pending, error } = useFetch('/api/products');

    return {
        products: data,
        loading: pending,
        error,
    };
};