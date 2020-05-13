import Home from './pages/home.vue'
import DevHome from './pages/dev/Home.vue'
import Instructions from './pages/dev/Instructions.vue'
import RunProgram from './pages/dev/RunProgram.vue'

import OprHome from './pages/opr/Home.vue'

const ROLE_DEV = 'DEV'
const ROLE_OPR = 'OPR'

const routes = [
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
  },
  {
    path: '/dev/instructions',
    name: 'Instructions',
    meta: {
      role: ROLE_DEV
    },
    component: Instructions
  },
  {
    path: '/opr/home',
    name: 'oprHome',
    meta: {
      role: ROLE_OPR
    },
    component: OprHome
  },
  {
    path: '/',
    name: 'home',
    meta: {public: true},
    component: Home
  }
]

const starts = {
  OPR: 'oprHome',
  DEV: 'devHome'
}

export default {
  routes,
  starts
}
