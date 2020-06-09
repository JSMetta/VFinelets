import Home from './pages/biz/Home.vue'

const ROLE_BIZ = 'BIZ'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      role: ROLE_BIZ
    },
    component: Home
  },
]

const starts = {
  BIZ: 'home'
}

export default {
  routes,
  starts
}
