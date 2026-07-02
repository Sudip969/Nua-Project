export default {
  cartCount(state) {
    return state.cart.reduce((total, item) => total + item.quantity, 0)
  }
}
