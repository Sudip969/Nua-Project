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
  addToCart({ commit }, product) {
    commit('ADD_TO_CART', product)
  },
  initializeCart({ commit }) {
    commit('INITIALIZE_CART')
  }
}
