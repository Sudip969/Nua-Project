<template>
  <div class="home-view container">
    <header class="page-header">
      <h1>CATALOG</h1>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading products...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <h2>Something went wrong</h2>
      <p>{{ error }}</p>
      <button @click="retryFetch">Try Again</button>
    </div>

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
@use '../styles/variables' as *;

.home-view {
  padding-top: 40px;
  padding-bottom: 60px;
}

.page-header {
  margin-bottom: 16px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}
</style>
