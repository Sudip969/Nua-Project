<template>
  <div class="product-detail-view container">
    <router-link to="/" class="back-link">← Back to Catalog</router-link>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading product details...</p>
    </div>

    <div v-else-if="error || !product" class="error-state">
      <h2>Could not load product</h2>
      <p>{{ error || 'Product not found' }}</p>
      <router-link to="/" class="btn-link"><button>Back to Catalog</button></router-link>
    </div>


    <div v-else class="product-layout">
      <!-- Left Part -->
      <div class="gallery-column">
        <div class="main-image-container">
          <img 
            :src="product.image" 
            :alt="product.title" 
            class="main-image"
            :style="{ filter: activeFilter }"
          />
        </div>
        <div class="thumbnails-grid">
          <button 
            v-for="(thumb, index) in thumbnails" 
            :key="index"
            class="thumbnail-btn"
            :class="{ active: activeThumbnailIndex === index }"
            @click="selectThumbnail(index)"
          >
            <img 
              :src="thumb.url" 
              :alt="thumb.color" 
              class="thumbnail-image"
              :style="{ filter: thumb.filter }"
            />
            <span class="thumbnail-label">{{ thumb.color }}</span>
          </button>
        </div>
        <div class="alert-message">
          Fake Store API doesn't give the Color of the product 
          So I am using the filter to show different colors in the thumbnails 
          These are no real color May be seem different for different product         
       </div>
      </div>

      <!-- Right Part -->
      <div class="details-column">
        <div class="details-card">
          <span class="brand-label">{{ getBrand(product.category) }}</span>
          <h1 class="product-title">{{ product.title }}</h1>
          
          <div class="price-section">
            <span class="original-price">${{ originalPrice }}</span>
            <span class="sale-price">${{ Number(product.price).toFixed(2) }}</span>
          </div>

          <p class="description">{{ product.description }}</p>

          <div class="selector-group">
            <span class="group-label">Color: <strong>{{ selectedColor }}</strong></span>
          </div>


          <div class="selector-group">
            <label class="group-label">Size: <strong>{{ selectedSize }}</strong></label>
            <div class="size-buttons">
              <button 
                v-for="size in sizes" 
                :key="size"
                class="size-btn"
                :class="{ 
                  active: selectedSize === size,
                  'low-stock': getStock(selectedColor, size) > 0 && getStock(selectedColor, size) <= 3,
                  'sold-out': getStock(selectedColor, size) === 0
                }"
                @click="selectSize(size)"
              >
                {{ size }}
                <span class="stock-status-tag" v-if="getStock(selectedColor, size) === 0"> (Sold Out)</span>
                <span class="stock-status-tag low" v-else-if="getStock(selectedColor, size) <= 3"> (Low Stock)</span>
              </button>
            </div>
          </div>


          <div class="action-section">
            <div class="quantity-picker-wrapper">
              <label class="group-label">Quantity</label>
              <div class="quantity-picker">
                <button 
                  @click="adjustQuantity(-1)" 
                  :disabled="quantity <= 1 || currentStock === 0"
                >-</button>
                <span class="quantity-value">{{ currentStock === 0 ? 0 : quantity }}</span>
                <button 
                  @click="adjustQuantity(1)" 
                  :disabled="quantity >= currentStock || currentStock === 0"
                >+</button>
              </div>
            </div>

            <div class="add-to-cart-wrapper">
              <button 
                class="add-to-cart-btn" 
                :disabled="currentStock === 0 || isAdding"
                @click="handleAddToCart"
              >
                <span v-if="isAdding">Added to Cart!</span>
                <span v-else-if="currentStock === 0">Sold Out</span>
                <span v-else>Add to Cart</span>
              </button>
            </div>
          </div>

          <div class="alert-message" v-if="currentStock > 0 && currentStock <= 3">
            Only {{ currentStock }} items left in stock for this variant!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

const store = useStore()
const route = useRoute()
const router = useRouter()

const product = computed(() => store.state.currentProduct)
const loading = computed(() => store.state.loading)
const error = computed(() => store.state.error)

const colors = ['Black', 'Gray', 'White']
const sizes = ['S', 'M', 'L', 'XL']

const selectedColor = ref('Black')
const selectedSize = ref('S')
const quantity = ref(1)
const isAdding = ref(false)


const activeThumbnailIndex = ref(0)
const thumbnails = computed(() => {
  if (!product.value) return []
  /* Fake Store API doesnot give the Color of the product 
     so I am using the filter to show different colors in the thumbnails 
     These are no real color May be seem different for different product */
  return [
    { color: 'Black', url: product.value.image, filter: 'none' },
    { color: 'Gray', url: product.value.image, filter: 'grayscale(1) contrast(1.2)' },
    { color: 'White', url: product.value.image, filter: 'saturate(0.15) brightness(1.25) contrast(0.9)' }
  ]
})
const activeFilter = computed(() => {
  if (thumbnails.value.length === 0) return 'none'
  return thumbnails.value[activeThumbnailIndex.value]?.filter || 'none'
})

const selectThumbnail = (index) => {
  activeThumbnailIndex.value = index
  const color = thumbnails.value[index]?.color
  if (color) {
    selectedColor.value = color
    updateQueryParams()
  }
}


watch([selectedColor, product], () => {
  if (product.value && thumbnails.value.length > 0) {
    const index = thumbnails.value.findIndex(t => t.color === selectedColor.value)
    if (index !== -1) {
      activeThumbnailIndex.value = index
    }
  }
}, { immediate: true })


const getBrand = (category) => {
  if (!category) return 'NUA CLASSICS'
  const mapping = {
    "men's clothing": 'MENSWEAR CO.',
    "women's clothing": 'FEMME LABS',
    "jewelery": 'AURA JEWELRY',
    "electronics": 'VOLT TECH'
  }
  return mapping[category] || 'NUA CLASSICS'
}

const originalPrice = computed(() => {
  if (!product.value) return '0.00'
  return (product.value.price * 1.45).toFixed(2)
})

const getStock = (color, size) => {
  // mock stock levels
  if (size === 'L') return 0  // Sold Out
  if (size === 'M') return 2  // Low Stock
  return 10 // Available
}

const currentStock = computed(() => {
  return getStock(selectedColor.value, selectedSize.value)
})

watch(currentStock, (newStock) => {
  if (newStock === 0) {
    quantity.value = 0
  } else if (quantity.value > newStock) {
    quantity.value = newStock
  } else if (quantity.value === 0 && newStock > 0) {
    quantity.value = 1
  }
})


const selectSize = (size) => {
  selectedSize.value = size
  updateQueryParams()
}

const updateQueryParams = () => {
  router.replace({
    query: {
      color: selectedColor.value,
      size: selectedSize.value
    }
  })
}

const syncRouteParams = () => {
  if (route.query.color && colors.includes(route.query.color)) {
    selectedColor.value = route.query.color
  }
  if (route.query.size && sizes.includes(route.query.size)) {
    selectedSize.value = route.query.size
  }
}

const adjustQuantity = (amount) => {
  const nextQty = quantity.value + amount
  if (nextQty >= 1 && nextQty <= currentStock.value) {
    quantity.value = nextQty
  }
}

const handleAddToCart = () => {
  if (currentStock.value === 0) return
  
  isAdding.value = true
  store.dispatch('addToCart', {
    product: product.value,
    quantity: quantity.value,
    color: selectedColor.value,
    size: selectedSize.value
  })

  setTimeout(() => {
    isAdding.value = false
  }, 1500)
}

onMounted(async () => {
  await store.dispatch('fetchProductById', route.params.id)
  syncRouteParams()
})
</script>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.product-detail-view {
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


.product-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: 768px) {
    grid-template-columns: 1.1fr 0.9fr;
  }
}

.gallery-column {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .main-image-container {
    background-color: #ffffff;
    border: $border-width solid $border-color;
    padding: 32px;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    .main-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: filter 0.2s ease;
    }
  }

  .thumbnails-grid {
    display: flex;
    gap: 12px;

    .thumbnail-btn {
      flex: 1;
      height: 110px;
      padding: 8px;
      background-color: #ffffff;
      border: $border-width solid $border-color;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      overflow: hidden;
      transition: transform 0.15s ease, box-shadow 0.15s ease;

      &.active {
        background-color: $gray-light;
        box-shadow: 3px 3px 0px $border-color;
        transform: translate(-3px, -3px);
      }

      .thumbnail-image {
        max-width: 100%;
        max-height: 70px;
        object-fit: contain;
      }

      .thumbnail-label {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        margin-top: 4px;
        letter-spacing: 0.05em;
        color: $text-color;
      }
    }
  }
}

.details-column {
  .details-card {
    border: $border-width solid $border-color;
    padding: 32px;
    background-color: $bg-color;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .brand-label {
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: $gray-dark;
    text-transform: uppercase;
  }

  .product-title {
    font-size: 1.8rem;
    font-weight: 900;
    line-height: 1.2;
    text-transform: uppercase;
    letter-spacing: -0.02em;
  }

  .price-section {
    display: flex;
    align-items: baseline;
    gap: 12px;

    .original-price {
      color: $gray-medium;
      text-decoration: line-through;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .sale-price {
      font-size: 1.8rem;
      font-weight: 900;
    }
  }

  .description {
    line-height: 1.6;
    color: $gray-dark;
    font-size: 0.95rem;
    border-top: 1px solid $gray-light;
    border-bottom: 1px solid $gray-light;
    padding: 16px 0;
  }

  .group-label {
    display: block;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 8px;
    letter-spacing: 0.05em;
  }



  .size-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .size-btn {
      padding: 8px 12px;
      font-size: 0.9rem;
      font-weight: 700;
      border: $border-width solid $border-color;
      background-color: $bg-color;
      cursor: pointer;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;

      .stock-status-tag {
        font-size: 0.75rem;
        font-weight: 400;
        margin-left: 4px;
        opacity: 0.7;
      }

      &.active {
        background-color: $border-color;
        color: $bg-color;
      }

      &.low-stock {
        border-color: #f59e0b;
        color: #d97706;
        &.active {
          background-color: #f59e0b;
          color: #ffffff;
          border-color: #d97706;
        }
      }

      &.sold-out {
        border-color: $gray-medium;
        color: $gray-medium;
        text-decoration: line-through;
        cursor: not-allowed;
        background-color: $gray-light;
        &:hover {
          background-color: $gray-light;
          color: $gray-medium;
        }
      }
    }
  }

  .action-section {
    display: flex;
    gap: 16px;
    margin-top: 12px;
    align-items: flex-end;
  }

  .quantity-picker-wrapper {
    flex-shrink: 0;
  }

  .quantity-picker {
    display: flex;
    align-items: center;
    border: $border-width solid $border-color;
    height: 42px;

    button {
      border: none;
      padding: 0 12px;
      height: 100%;
      background: none;
      font-size: 1.2rem;
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
      font-weight: 700;
      padding: 0 12px;
      min-width: 32px;
      text-align: center;
    }
  }

  .add-to-cart-wrapper {
    flex-grow: 1;
  }

  .add-to-cart-btn {
    width: 100%;
    height: 42px;
    font-size: 0.95rem;
    text-transform: uppercase;
    font-weight: 800;
    letter-spacing: 0.05em;
  }

}

</style>
