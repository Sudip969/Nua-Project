<template>
  <div class="product-card">
    <router-link :to="`/product/${product.id}`" class="image-wrapper">
      <img :src="product.image" :alt="product.title" class="product-image" />
    </router-link>
    <div class="product-info">
      <router-link :to="`/product/${product.id}`">
        <h3 class="product-title">{{ product.title }}</h3>
      </router-link>
      <span class="product-price">${{ Number(product.price).toFixed(2) }}</span>
      <button @click="addToCart" class="add-to-cart-btn" :disabled="isAdding">
        <span v-if="isAdding">Adding...</span>
        <span v-else-if="justAdded">Added!</span>
        <span v-else>Add to Cart</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const store = useStore()
const isAdding = ref(false)
const justAdded = ref(false)

const addToCart = async () => {
  if (isAdding.value) return
  isAdding.value = true
  justAdded.value = false
  try {
    await store.dispatch('addToCart', props.product)
    justAdded.value = true
    setTimeout(() => {
      justAdded.value = false
    }, 1500)
  } catch (err) {
    alert(err.message || 'Failed to add item to cart')
  } finally {
    isAdding.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.product-card {
  border: $border-width solid $border-color;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    box-shadow: 4px 4px 0px $border-color;
  }

  .image-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    height: 200px;
    background-color: #ffffff;
    border-bottom: $border-width solid $border-color;
    overflow: hidden;

    .product-image {
      max-width: 100%;
      max-height: 100%;
    }
  }

  .product-info {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
  }

  .product-title {
    margin-bottom: 12px;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.3;
    color: $text-color;

    /* Limit to 2 lines (works on most browsers) If the product name is too large */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }


  .product-price {
    font-size: 1.2rem;
    font-weight: 800;
    margin-bottom: 16px;

  }

  .add-to-cart-btn {
    width: 100%;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
  }
}
</style>
