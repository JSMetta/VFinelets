const mutations = {
  currentPage (state, data) {
    if (!data) {
      state.currentPage = {}
      return
    }
    const currentPage = state.currentPage
    currentPage[data.route] = data.page
  }
}
export default mutations
