<template>
  <div class="product-detail-stub container">
    <router-link to="/" class="back-link">← Back to Catalog</router-link>
    <div class="stub-card">
      <h1>Product Detail</h1>
      <p class="id-display">Product ID: <strong>{{ id }}</strong></p>
      <p class="placeholder-text">Product Details.{{ id }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true
  }
})
</script>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.product-detail-stub {
  padding-top: 40px;
  padding-bottom: 60px;
}

.back-link {
  display: inline-block;
  margin-bottom: 24px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

.stub-card {
  background-color: $bg-color;
  border: $border-width solid $border-color;
  padding: 40px;

  h1 {
    font-size: 2rem;
    font-weight: 900;
    margin-bottom: 16px;
    text-transform: uppercase;
  }

  .id-display {
    font-size: 1.1rem;
    margin-bottom: 24px;
  }

  .placeholder-text {
    line-height: 1.6;
    color: $gray-dark;
    max-width: 600px;
  }
}
</style>
