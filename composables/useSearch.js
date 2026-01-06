import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useSearch = () => {
    const router = useRouter();
    const searchQuery = ref('');

    const handleSearch = (query = null) => {
        const searchTerm = query || searchQuery.value;

        if (searchTerm && searchTerm.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
            clearSearch();
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