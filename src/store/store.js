import { createStore } from 'vuex'
import mutations from './mutation'
import actions from './action'
import getters from './getters'

export default createStore({
  state() {
    return {
      products: [],
      cart: [],
      loading: false,
      error: null
    }
  },
  mutations,
  actions,
  getters
})
