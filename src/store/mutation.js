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
  ADD_TO_CART(state, product) {
    const existingItem = state.cart.find(item => item.product.id === product.id)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      state.cart.push({ product, quantity: 1 })
    }
    localStorage.setItem('cart', JSON.stringify(state.cart))
  }
}
