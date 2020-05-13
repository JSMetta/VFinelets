import Home from './pages/home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {public: true},
    component: Home
  }
]

const starts = {
}

export default {
  routes,
  starts
}
