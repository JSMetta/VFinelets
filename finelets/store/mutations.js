const mutations = {
  currentPage (state, data) {
    if (!data) {
      state.currentPage = {}
      return
    }
    const currentPage = state.currentPage
    currentPage[data.route] = data.page
  },
  selected (state, data) {
    if (!data) {
      state.selected = {}
      return
    }
    const {key, val} = data
    state.selected[key] = val
  }
}
export default mutations
