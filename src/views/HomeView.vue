<template>
  <div class="home-view container">
    <header class="page-header">
      <h1 class="page-title">Catalog</h1>
      <div class="cart-indicator">
        Cart ({{ cartCount }})
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading products...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <h2>Something went wrong</h2>
      <p>{{ error }}</p>
      <button @click="retryFetch" class="retry-btn">Try Again</button>
    </div>

    <!-- Product Grid -->
    <div v-else class="product-grid">
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product" 
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import ProductCard from '../components/ProductCard.vue'

const store = useStore()

const products = computed(() => store.state.products)
const loading = computed(() => store.state.loading)
const error = computed(() => store.state.error)
const cartCount = computed(() => store.getters.cartCount)

const retryFetch = () => {
  store.dispatch('fetchProducts')
}

onMounted(() => {
  if (products.value.length === 0) {
    store.dispatch('fetchProducts')
  }
})
</script>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.home-view {
  padding-top: 40px;
  padding-bottom: 60px;
}

.page-header {
  margin-bottom: 32px;
  border-bottom: $border-width solid $border-color;
  padding-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .page-title {
    font-size: 2rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -0.03em;
  }

  .cart-indicator {
    font-weight: 600;
    border: $border-width solid $border-color;
    padding: 6px 12px;
    background-color: $bg-color;
  }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}
</style>
