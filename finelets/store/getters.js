import constDef from '../ConstantsDef'

const getters = {
  currentPage: (state) => (route) => {
    const finalRoute = route // || state.route.name
    const currentPage = state.currentPage
    return currentPage[finalRoute]
  },
  avatar: (state) => {
    const avatar = state.avatar ? state.avatar : constDef.DEFAULT_IMG_AVATAR
    return avatar
  }
}
export default getters
