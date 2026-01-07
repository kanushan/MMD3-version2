export const useCart = () => {
    const cart = useState('cart', () => []);

    // Tilføj produkt til kurv
    const addToCart = (product, quantity = 1, size = null, color = null) => {
        const existingItem = cart.value.find(
            item => item.id === product.id && item.size === size && item.color === color
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.value.push({
                ...product,
                quantity,
                size,
                color,
                cartItemId: Date.now() + Math.random() // Unikt ID for kurv item
            });
        }
    };

    // Opdater antal
    const updateQuantity = (cartItemId, quantity) => {
        const item = cart.value.find(item => item.cartItemId === cartItemId);
        if (item && quantity > 0 && quantity <= 99) {
            item.quantity = quantity;
        }
    };

    // Fjern produkt fra kurv
    const removeFromCart = (cartItemId) => {
        cart.value = cart.value.filter(item => item.cartItemId !== cartItemId);
    };

    // Beregn total
    const cartTotal = computed(() => {
        return cart.value.reduce((total, item) => {
            return total + (item.Pris * item.quantity);
        }, 0);
    });

    // Antal items i kurv
    const cartCount = computed(() => {
        return cart.value.reduce((count, item) => count + item.quantity, 0);
    });

    // Tøm kurv
    const clearCart = () => {
        cart.value = [];
    };

    return {
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        cartTotal,
        cartCount,
        clearCart
    };
};