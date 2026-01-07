<script setup>
import { useCart } from '~/composables/useCart';

const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

// Øg antal
const increaseQuantity = (item) => {
  if (item.quantity < 99) {
    updateQuantity(item.cartItemId, item.quantity + 1);
  }
};

// Reducer antal
const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    updateQuantity(item.cartItemId, item.quantity - 1);
  }
};

// Formater pris
const formatPrice = (price) => {
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK',
    minimumFractionDigits: 2
  }).format(price);
};
</script>

<template>
  <div class="cart-page">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>Kurv</h1>
        <p v-if="cartCount > 0">{{ cartCount }} {{ cartCount === 1 ? 'produkt' : 'produkter' }} i kurven</p>
      </div>

      <!-- Tom kurv -->
      <div v-if="cart.length === 0" class="empty-cart">
        <i class="fa-solid fa-cart-shopping empty-icon"></i>
        <h2>Din kurv er tom</h2>
        <p>Tilføj produkter til din kurv for at se dem her</p>
        <NuxtLink to="/products" class="shop-btn">
          Shop produkter
        </NuxtLink>
      </div>

      <!-- Kurv med produkter -->
      <div v-else class="cart-content">
        <!-- Produkt liste -->
        <div class="cart-items">
          <div
            v-for="item in cart"
            :key="item.cartItemId"
            class="cart-item"
          >
            <!-- Produkt billede -->
            <NuxtLink :to="`/product/${item.slug}`" class="item-image">
              <img :src="item.BilledeMain" :alt="item.ModelNavn">
            </NuxtLink>

            <!-- Produkt info -->
            <div class="item-details">
              <div class="item-main">
                <div class="item-info">
                  <NuxtLink :to="`/product/${item.slug}`" class="item-name">
                    {{ item.ModelNavn }}
                  </NuxtLink>
                  <p class="item-brand">{{ item.Mærke }}</p>
                  
                  <!-- Størrelse og farve -->
                  <div class="item-variants">
                    <span v-if="item.size" class="variant-info">
                      Størrelse: <strong>{{ item.size }}</strong>
                    </span>
                    <span v-if="item.color" class="variant-info">
                      <span class="color-dot" :style="{ backgroundColor: item.color }"></span>
                      Farve
                    </span>
                  </div>
                </div>

                <!-- Pris -->
                <div class="item-price">
                  <p class="price">{{ formatPrice(item.Pris) }}</p>
                </div>
              </div>

              <!-- Antal og handlinger -->
              <div class="item-actions">
                <!-- Antal selector -->
                <div class="quantity-selector">
                  <button
                    @click="decreaseQuantity(item)"
                    class="qty-btn"
                    :disabled="item.quantity <= 1"
                  >
                    <i class="fa-solid fa-minus"></i>
                  </button>
                  <span class="qty-display">{{ item.quantity }}</span>
                  <button
                    @click="increaseQuantity(item)"
                    class="qty-btn"
                    :disabled="item.quantity >= 99"
                  >
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>

                <!-- Total for dette item -->
                <p class="item-total">
                  {{ formatPrice(item.Pris * item.quantity) }}
                </p>

                <!-- Slet knap -->
                <button
                  @click="removeFromCart(item.cartItemId)"
                  class="remove-btn"
                  aria-label="Fjern produkt"
                >
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Ordre oversigt -->
        <aside class="order-summary">
          <div class="summary-box">
            <h2>Ordre oversigt</h2>
            
            <div class="summary-row">
              <span>Subtotal</span>
              <span>{{ formatPrice(cartTotal) }}</span>
            </div>
            
            <div class="summary-row">
              <span>Levering</span>
              <span>Gratis</span>
            </div>
            
            <div class="summary-divider"></div>
            
            <div class="summary-row total">
              <span>Total</span>
              <span>{{ formatPrice(cartTotal) }}</span>
            </div>

            <button class="checkout-btn">
              Gå til kassen
            </button>

            <NuxtLink to="/products" class="continue-shopping">
              Fortsæt med at handle
            </NuxtLink>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  min-height: 100vh;
  padding-bottom: 100px; /* Space for mobile nav */
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* Header */
.header {
  margin-bottom: 32px;
}

.header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #111;
  margin-bottom: 8px;
}

.header p {
  color: #666;
  font-size: 15px;
}

/* Tom kurv */
.empty-cart {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  color: #ddd;
  margin-bottom: 24px;
}

.empty-cart h2 {
  font-size: 24px;
  font-weight: 600;
  color: #111;
  margin-bottom: 12px;
}

.empty-cart p {
  color: #666;
  font-size: 15px;
  margin-bottom: 32px;
}

.shop-btn {
  display: inline-block;
  padding: 14px 32px;
  background: #000;
  color: white;
  text-decoration: none;
  border-radius: 2px;
  font-weight: 600;
  transition: background 0.2s;
}

.shop-btn:hover {
  background: #333;
}

/* Kurv content */
.cart-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}

/* Kurv items */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  display: flex;
  gap: 16px;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 2px;
  padding: 16px;
  transition: box-shadow 0.2s;
}

.cart-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Produkt billede */
.item-image {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border-radius: 2px;
  overflow: hidden;
  background: #f5f5f5;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s;
}

.item-image:hover img {
  transform: scale(1.05);
}

/* Produkt detaljer */
.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-main {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #111;
  text-decoration: none;
  display: block;
  margin-bottom: 4px;
}

.item-name:hover {
  color: #666;
}

.item-brand {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.item-variants {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: #666;
}

.variant-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #ddd;
}

/* Pris */
.item-price {
  text-align: right;
}

.price {
  font-size: 16px;
  font-weight: 600;
  color: #111;
}

/* Item actions */
.item-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Antal selector */
.quantity-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 2px;
  padding: 4px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: white;
  color: #111;
  cursor: pointer;
  border-radius: 2px;
  transition: background 0.2s;
}

.qty-btn:hover:not(:disabled) {
  background: #f5f5f5;
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-display {
  min-width: 32px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
}

/* Item total */
.item-total {
  font-size: 16px;
  font-weight: 600;
  color: #111;
  min-width: 100px;
  text-align: right;
}

/* Slet knap */
.remove-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e5e5;
  background: white;
  color: #999;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #fee;
  border-color: #fcc;
  color: #c41e3a;
}

/* Ordre oversigt */
.order-summary {
  position: sticky;
  top: 120px;
  height: fit-content;
}

.summary-box {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 2px;
  padding: 24px;
}

.summary-box h2 {
  font-size: 20px;
  font-weight: 600;
  color: #111;
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 15px;
  color: #666;
}

.summary-row.total {
  font-size: 18px;
  font-weight: 600;
  color: #111;
}

.summary-divider {
  height: 1px;
  background: #e5e5e5;
  margin: 16px 0;
}

.checkout-btn {
  width: 100%;
  padding: 16px;
  background: #000;
  color: white;
  border: none;
  border-radius: 2px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 20px;
}

.checkout-btn:hover {
  background: #333;
}

.continue-shopping {
  display: block;
  text-align: center;
  color: #666;
  text-decoration: none;
  font-size: 14px;
  margin-top: 16px;
  transition: color 0.2s;
}

.continue-shopping:hover {
  color: #111;
}

/* Tablet - 600px+ */
@media (min-width: 600px) {
  .item-image {
    width: 140px;
    height: 140px;
  }

  .item-name {
    font-size: 18px;
  }

  .price {
    font-size: 18px;
  }

  .item-total {
    font-size: 18px;
  }
}

/* Desktop - 930px+ */
@media (min-width: 930px) {
  .cart-content {
    grid-template-columns: 1fr 380px;
  }

  .header h1 {
    font-size: 32px;
  }

  .item-image {
    width: 160px;
    height: 160px;
  }

  .cart-item {
    padding: 20px;
  }
}

/* Mobile - under 600px */
@media (max-width: 600px) {
  .cart-item {
    flex-direction: column;
  }

  .item-image {
    width: 100%;
    height: 200px;
  }

  .item-main {
    flex-direction: column;
    gap: 12px;
  }

  .item-price {
    text-align: left;
  }

  .item-actions {
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .item-total {
    text-align: left;
    min-width: auto;
  }
}
</style>