<template>
  <div class="app-layout">
    <Navbar />
    <main class="main-layout">
      <router-view />
    </main>
    <CartDrawer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import Navbar from './components/Navbar.vue'
import CartDrawer from './components/CartDrawer.vue'

const store = useStore()

onMounted(() => {
  store.dispatch('initializeCart')
})
</script>

<style lang="scss">
@use './styles/global';

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-layout {
  flex-grow: 1;
}
</style>
