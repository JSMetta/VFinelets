import Home from './pages/home.vue'
import Photo from './pages/photo.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {public: true},
    component: Home
  },
  {
    path: '/demo/photo',
    name: 'photo',
    meta: {public: true},
    component: Photo
  }
]

const starts = {
}

export default {
  routes,
  starts
}
