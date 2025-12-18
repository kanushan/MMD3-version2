export const useProduct = (slug) => {
    const { data, pending, error } = useFetch(`/api/products/${slug}`);

    return {
        product: data,
        loading: pending,
        error,
    };
};