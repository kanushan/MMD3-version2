import { ref, computed } from 'vue';

// Global state for favorites
const favorites = ref([]);

// Load favorites from localStorage on initialization
if (process.client) {
    const stored = localStorage.getItem('favorites');
    if (stored) {
        try {
            favorites.value = JSON.parse(stored);
        } catch (e) {
            console.error('Failed to load favorites:', e);
        }
    }
}

export const useFavorites = () => {
    // Add product to favorites
    const addToFavorites = (product) => {
        if (!isFavorite(product.id)) {
            favorites.value.push(product);
            saveFavorites();
        }
    };

    // Remove product from favorites
    const removeFromFavorites = (productId) => {
        favorites.value = favorites.value.filter(p => p.id !== productId);
        saveFavorites();
    };

    // Toggle favorite status
    const toggleFavorite = (product) => {
        if (isFavorite(product.id)) {
            removeFromFavorites(product.id);
        } else {
            addToFavorites(product);
        }
    };

    // Check if product is favorite
    const isFavorite = (productId) => {
        return favorites.value.some(p => p.id === productId);
    };

    // Save to localStorage
    const saveFavorites = () => {
        if (process.client) {
            localStorage.setItem('favorites', JSON.stringify(favorites.value));
        }
    };

    // Get all favorites
    const getFavorites = computed(() => favorites.value);

    // Get favorites count
    const favoritesCount = computed(() => favorites.value.length);

    return {
        favorites: getFavorites,
        favoritesCount,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite
    };
};