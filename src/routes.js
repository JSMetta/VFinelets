import Home from './pages/home.vue'
import RunProgram from './pages/dev/RunProgram.vue'
import DevHome from './pages/dev/Home.vue'

const ROLE_DEV = 'DEV'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {public: true},
    component: Home
  },
  {
    path: '/dev/runprogram',
    name: 'runProgram',
    meta: {
      role: ROLE_DEV
    },
    component: RunProgram
  },
  {
    path: '/dev/home',
    name: 'devHome',
    meta: {
      role: ROLE_DEV
    },
    component: DevHome
  }
]

const starts = {
  DEV: 'devHome'
}

export default {
  routes,
  starts
}
