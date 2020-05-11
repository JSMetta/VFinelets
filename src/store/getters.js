const getters = {
  currentPage: (state) => (route) => {
    const finalRoute = route // || state.route.name
    const currentPage = state.currentPage
    return currentPage[finalRoute]
  }
}
export default getters
