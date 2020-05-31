import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './pages/Login.vue'
import Signup from './pages/Signup.vue'
import NotFound from './pages/NotFound.vue'
import Admin from './pages/Admin.vue'
import MasterUser from './pages/MasterUser.vue'
import UserProfile from './pages/UserProfile.vue'
import constDefs from './ConstantsDef'
import mergeStartPageOfRoles from './MergeStartPageOfRoles'

const __routes = [
  {
    path: '/master/admin',
    name: constDefs.PAGE_NAME_ADMIN,
    meta: {
      role: constDefs.ROLE_ADMIN
    },
    component: Admin
  },
  {
    path: '/master/user',
    name: 'masterUser',
    meta: {
      role: constDefs.ROLE_ADMIN
    },
    component: MasterUser
  },
  {
    path: '/login',
    name: constDefs.PAGE_NAME_LOGIN,
    meta: {
      guest: true
    },
    component: Login
  },
  {
    path: '/user/profile',
    name: 'userProfile',
    meta: {
      public: true
    },
    component: UserProfile
  },
  {
    path: '/signup',
    name: 'signup',
    meta: {
      public: true
    },
    component: Signup
  },
  {
    path: '*',
    meta: {public: true},
    component: NotFound
  }
]

Vue.use(VueRouter)

function __create (beforeEach, config) {
  const finalRoutes = [...config.routes, ...__routes]
  const router = new VueRouter({
    routes: finalRoutes,
    starts: mergeStartPageOfRoles(config.starts)
  })
  router.beforeEach(beforeEach)
  return router
}

export default __create



