import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

let __config

function __beforeEach (to, from, next) {
  // 尚未登录时，只能去public或guest页面，对任何访问其它页面的企图，均重定向到login页面(guest)
  if (!__config.isSignIn() && !to.meta.public && !to.meta.guest) {
    next({
      name: __config.routes.login,
      params: {
        wantedRoute: to.fullPath
      }
    })
    return
  }

  // 登录后
  if (__config.isSignIn()) {
    // 拒绝转到guest页面, 如login页面
    if (to.meta.guest) return

    // 拒绝转到与角色不相符的页面：
    if (!to.meta.public && !to.meta.guest && to.meta.role !== __config.role()) {
      // 如果来自与角色相符的页面，则直接拒绝，保持原页面不变；
      if (from.meta.role === __config.role()) return

      // 否则，转到角色相应的起始页面
      const toPage = __config.startRouteName()
      next({
        name: toPage
      })
    }
  }

  next()
}

function __createRouter () {
  const router = new VueRouter({
    routes: __config.routes.items
  })
  router.beforeEach(__beforeEach)
  return router
}

function __create (config) {
  __config = config
  return __createRouter()
}

export default __create
