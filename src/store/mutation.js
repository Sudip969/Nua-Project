export default {
  SET_PRODUCTS(state, products) {
    state.products = products
  },
  SET_LOADING(state, status) {
    state.loading = status
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_CURRENT_PRODUCT(state, product) {
    state.currentProduct = product
  },
  INITIALIZE_CART(state) {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        state.cart = JSON.parse(savedCart)
      } catch (e) {
        state.cart = []
      }
    }
  },
  ADD_TO_CART(state, payload) {
    let product, quantity = 1, color = null, size = null;
    if (payload.product) {
      product = payload.product;
      quantity = payload.quantity || 1;
      color = payload.color || null;
      size = payload.size || null;
    } else {
      product = payload;
    }

    const existingItem = state.cart.find(item => 
      item.product.id === product.id && 
      item.color === color && 
      item.size === size
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      state.cart.push({ product, quantity, color, size })
    }
    localStorage.setItem('cart', JSON.stringify(state.cart))
  },
  TOGGLE_CART_OPEN(state) {
    state.isCartOpen = !state.isCartOpen
  },
  SET_CART_OPEN(state, isOpen) {
    state.isCartOpen = isOpen
  },
  REMOVE_FROM_CART(state, { productId, color, size }) {
    state.cart = state.cart.filter(item => 
      !(item.product.id === productId && item.color === color && item.size === size)
    )
    localStorage.setItem('cart', JSON.stringify(state.cart))
  },
  UPDATE_CART_QUANTITY(state, { productId, color, size, quantity }) {
    const item = state.cart.find(item => 
      item.product.id === productId && item.color === color && item.size === size
    )
    if (item) {
      item.quantity = quantity
    }
    localStorage.setItem('cart', JSON.stringify(state.cart))
  }
}
