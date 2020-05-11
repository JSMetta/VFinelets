import routes from './routes'
import store from './store'
import router from '../finelets/Router.js'

function role () {
  const user = store.getters.user
  if (!user) return undefined
  if (user.isAdmin) return 'ADMIN'
  return user.roles
}

const config = {
  routes,
  isSignIn: () => {
    return store.getters.user
  },
  isAdmin: () => {
    return store.getters.user.isAdmin
  },
  role,
  startRouteName: () => {
    const r = role()
    return routes.starts[r]
  }
}

export default router(config)
