<template>
  <nav class="navbar">
    <div class="navbar-container">
      <h1>
        <router-link to="/" class="home-link">MINI STORE</router-link>
      </h1>
      <button class="cart-btn" @click="toggleCart" aria-label="Open cart">
        <span class="material-icons cart-icon">shopping_cart</span>
        <span class="cart-badge" v-if="cartCount > 0">{{ cartCount }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const cartCount = computed(() => store.getters.cartCount)

const toggleCart = () => {
  store.dispatch('toggleCart')
}
</script>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.navbar {
  background-color: $bg-color;
  border-bottom: $border-width solid $border-color;
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 12px 0;

  .navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .home-link{
    text-decoration: none;
  }

  .cart-btn {
    position: relative;
    padding: 8px 12px;
    cursor: pointer;

    &:hover {
      background-color: $border-color;
      color: $bg-color;
    }

    .cart-icon {
      font-size: 20px;
    }

    .cart-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background-color: $border-color;
      color: $bg-color;
      font-size: 0.7rem;
      font-weight: 800;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid $bg-color;
    }
  }
}
</style>
