<template>
  <div class="cart-drawer-wrapper" v-if="isOpen">
    <div class="cart-backdrop" @click="closeCart"></div>
    
    <div class="cart-panel">
      <div class="cart-header">
        <h2>Shopping Cart</h2>
        <button class="close-btn" @click="closeCart" aria-label="Close cart">
          <span class="material-icons">close</span>
        </button>
      </div>

      <div v-if="cartItems.length === 0" class="cart-empty-state">
        <p>Your cart is empty.</p>
        <button @click="closeCart" class="continue-shopping-btn">Continue Shopping</button>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items-list">
          <div v-for="(item, index) in cartItems" :key="index" class="cart-item-card">
            <div class="item-image-container">
              <img 
                :src="item.product.image" 
                :alt="item.product.title" 
                class="item-image"
                :style="{ filter: getVariantFilter(item.color) }"
              />
            </div>
            <div class="item-details">
              <h3 class="item-title">{{ item.product.title }}</h3>
              <div class="item-variant">
                <span v-if="item.color">Color: {{ item.color }}</span>
                <span v-if="item.size">Size: {{ item.size }}</span>
              </div>
              <div class="item-price-info">
                <span class="unit-price">Unit Price: ${{ Number(item.product.price).toFixed(2) }}</span>
                <span class="total-price">Total: ${{ (item.product.price * item.quantity).toFixed(2) }}</span>
              </div>
              <div class="item-actions">
                <div class="quantity-picker">
                  <button @click="updateQty(item, -1)" :disabled="item.quantity <= 1">-</button>
                  <span class="quantity-value">{{ item.quantity }}</span>
                  <button @click="updateQty(item, 1)" :disabled="item.quantity >= getStockLimit(item)">+</button>
                </div>
                <button class="remove-btn" @click="removeItem(item)" aria-label="Remove item">
                  <span class="material-icons">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="cart-footer">
          <div class="bill-summary">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div class="summary-row total-row">
              <span>Total</span>
              <strong>${{ subtotal.toFixed(2) }}</strong>
            </div>
          </div>
          <button class="checkout-btn">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const isOpen = computed(() => store.state.isCartOpen)
const cartItems = computed(() => store.state.cart)

const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.product.price * item.quantity), 0)
})

const closeCart = () => {
  store.dispatch('setCartOpen', false)
}

const getStockLimit = (item) => {
  if (!item.size) return 10
  if (item.size === 'L') return 0
  if (item.size === 'M') return 2
  return 10
}

const getVariantFilter = (color) => {
  if (color === 'Gray') return 'grayscale(1) contrast(1.2)'
  if (color === 'White') return 'saturate(0.15) brightness(1.25) contrast(0.9)'
  return 'none'
}

const updateQty = (item, change) => {
  const nextQty = item.quantity + change
  if (nextQty >= 1 && nextQty <= getStockLimit(item)) {
    store.dispatch('updateCartQuantity', {
      productId: item.product.id,
      color: item.color,
      size: item.size,
      quantity: nextQty
    })
  }
}

const removeItem = (item) => {
  store.dispatch('removeFromCart', {
    productId: item.product.id,
    color: item.color,
    size: item.size
  })
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.cart-drawer-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.cart-backdrop {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.cart-panel {
  position: relative;
  width: 100%;
  max-width: 420px;
  height: 100%;
  background-color: $bg-color;
  border-left: $border-width solid $border-color;
  display: flex;
  flex-direction: column;
  z-index: 1001;

  @media (max-width: 767px) {
    max-width: 100%;
    border-left: none;
  }
}

.cart-header {
  padding: 20px 24px;
  border-bottom: $border-width solid $border-color;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 1.4rem;
    text-transform: uppercase;
    letter-spacing: -0.02em;
  }

  .close-btn {
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    color: $text-color;
    transition: transform 0.1s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    .material-icons {
      font-size: 24px;
    }

    &:hover {
      background: none;
      color: $text-color;
      transform: scale(1.15);
    }
  }
}

.cart-empty-state {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  text-align: center;

  p {
    font-size: 1.05rem;
    margin-bottom: 20px;
    color: $gray-dark;
  }

  .continue-shopping-btn {
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
  }
}

.cart-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cart-items-list {
  flex-grow: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item-card {
  display: flex;
  gap: 16px;
  border: $border-width solid $border-color;
  padding: 16px;
  background-color: #ffffff;

  .item-image-container {
    width: 80px;
    height: 80px;
    background-color: #ffffff;
    border: 1px solid $gray-light;
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    flex-shrink: 0;

    .item-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }

  .item-details {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .item-title {
    font-size: 0.95rem;
    line-height: 1.2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2
    ;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .item-variant {
    font-size: 0.75rem;
    color: $gray-dark;
    display: flex;
    gap: 8px;
    margin-top: 4px;
  }

  .item-price-info {
    margin-top: 6px;
    display: flex;
    flex-direction: column;
    gap: 2px;

    .unit-price {
      font-size: 0.75rem;
      color: $gray-dark;
    }

    .total-price {
      font-size: 0.95rem;
      color: $text-color;
    }
  }

  .item-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
  }

  .quantity-picker {
    display: flex;
    align-items: center;
    border: $border-width solid $border-color;
    height: 32px;

    button {
      border: none;
      padding: 0 8px;
      height: 100%;
      background: none;
      font-size: 1rem;
      cursor: pointer;
      &:hover {
        background-color: $gray-light;
        color: $text-color;
      }
      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
        background: none;
      }
    }

    .quantity-value {
      padding: 0 8px;
      min-width: 24px;
      text-align: center;
      font-size: 0.85rem;
    }
  }

  .remove-btn {
    border: none;
    background: none;
    padding: 6px;
    color: $gray-dark;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    .material-icons {
      font-size: 20px;
    }

    &:hover {
      background: none;
      color: #ef4444;
    }
  }
}

.cart-footer {
  padding: 24px;
  border-top: $border-width solid $border-color;
  background-color: $bg-color;

  .bill-summary {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
    font-size: 0.95rem;

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      span:first-child {
        text-transform: uppercase;
        color: $gray-dark;
        font-size: 0.8rem;
      }
    }

    .total-row {
      border-top: 1px dashed $gray-medium;
      padding-top: 12px;
      margin-top: 4px;
      font-size: 1.15rem;

      span:first-child {
        color: $text-color;
        font-size: 0.95rem;
      }
    }
  }

  .checkout-btn {
    width: 100%;
    height: 48px;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}
</style>
