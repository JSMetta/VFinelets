import Login from '../../finelets/pages/Login.vue'
import Signup from '../../finelets/pages/Signup.vue'
import NotFound from '../../finelets/pages/NotFound.vue'
import Admin from '../../finelets/pages/Admin.vue'
import MasterUser from '../../finelets/pages/MasterUser.vue'

/* import DevHome from '../pages/dev/Home.vue'
import Instructions from '../pages/dev/Instructions.vue'
import RunProgram from '../pages/dev/RunProgram.vue'

import OprHome from '../pages/opr/Home.vue'
 */
const ROLE_ADMIN = 'ADMIN'
// const ROLE_DEV = 'DEV'
// const ROLE_OPR = 'OPR'

const routes = [
  /* {
    path: '/dev/runprogram',
    name: 'runProgram',
    meta: {
      role: ROLE_DEV
    },
    component: RunProgram
  },
  {
    path: '/dev/home',
    name: 'home',
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
  },*/
  {
    path: '/master/admin',
    name: 'admin',
    meta: {
      role: ROLE_ADMIN
    },
    component: Admin
  },
  {
    path: '/master/user',
    name: 'masterUser',
    meta: {
      role: ROLE_ADMIN
    },
    component: MasterUser
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      guest: true
    },
    component: Login
  },
  {
    path: '/signup',
    name: 'signup',
    meta: {
      public: true
    },
    component: Signup
  },
  /* {
    path: '/opr/home',
    name: 'oprHome',
    meta: {
      role: ROLE_OPR
    },
    component: OprHome
  }, */
  {
    path: '*',
    meta: {public: true},
    component: NotFound
  }
]

const starts = {
  ADMIN: 'admin',
  OPR: 'oprHome',
  DEV: 'home'
}

export default {
  items: routes,
  login: 'login',
  starts
}
