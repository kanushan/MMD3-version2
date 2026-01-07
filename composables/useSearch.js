import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useSearch = () => {
    const router = useRouter();
    const searchQuery = ref('');

    const handleSearch = (query = null) => {
        const searchTermValue = query || searchQuery.value;

        if (searchTermValue && searchTermValue.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchTermValue.trim())}`);
        }
    };
    const clearSearch = () => {
        searchQuery.value = '';
    };

    const setSearchQuery = (query) => {
        searchQuery.value = query;
    };

    return {
        searchQuery,
        handleSearch,
        clearSearch,
        setSearchQuery
    };
};