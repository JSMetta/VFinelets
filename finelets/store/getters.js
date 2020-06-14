import constDef from '../ConstantsDef'

const getters = {
  currentPage: (state) => (route) => {
    const finalRoute = route // || state.route.name
    const currentPage = state.currentPage
    return currentPage[finalRoute]
  },
  selected: (state) => (key) => {
    return state.selected[key]
  },
  avatar: (state) => {
    const avatar = state.avatar ? state.avatar : constDef.DEFAULT_IMG_AVATAR
    return avatar
  }
}
export default getters
