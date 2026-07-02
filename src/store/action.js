export default {
  async fetchProducts({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await fetch('https://fakestoreapi.com/products')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      commit('SET_PRODUCTS', data)
    } catch (err) {
      commit('SET_ERROR', err.message || 'Something went wrong')
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async fetchProductById({ commit }, id) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    commit('SET_CURRENT_PRODUCT', null)
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch product details')
      }
      const data = await response.json()
      commit('SET_CURRENT_PRODUCT', data)
    } catch (err) {
      commit('SET_ERROR', err.message || 'Something went wrong')
    } finally {
      commit('SET_LOADING', false)
    }
  },
  addToCart({ commit }, payload) {
    commit('ADD_TO_CART', payload)
  },
  initializeCart({ commit }) {
    commit('INITIALIZE_CART')
  },
  toggleCart({ commit }) {
    commit('TOGGLE_CART_OPEN')
  },
  setCartOpen({ commit }, isOpen) {
    commit('SET_CART_OPEN', isOpen)
  },
  removeFromCart({ commit }, payload) {
    commit('REMOVE_FROM_CART', payload)
  },
  updateCartQuantity({ commit }, payload) {
    commit('UPDATE_CART_QUANTITY', payload)
  }
}
