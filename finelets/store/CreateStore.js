import _ from 'lodash/collection'
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import __actions from './actions'
import __getters from './getters'
import __mutations from './mutations'
import __states from './states'

Vue.use(Vuex)
// localStorage.clear()
const vuexLocalStorage = new VuexPersist({
  key: 'vuex', // The key to store the state on in the storage provider.
  storage: window.localStorage, // or window.sessionStorage or localForage
  reducer: (state) => ({ user: state.user, token: state.token }),
  // Function that passes the state and returns the state with only the objects you want to store.
  // reducer: state => state,
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  // filter: mutation => (true)
})
const __items = ['entry', 'token', 'user', 'selectedUser', 'avatar']

function createGetters (items) {
  const obj = {}
  _.forEach(items, (item) => {
    obj[item] = (state) => state[item]
  })
  return obj
}

function createMutations (mutations) {
  const obj = {}
  _.forEach(mutations, (m) => {
    obj[m] = (state, data) => {
      state[m] = data
    }
  })
  return obj
}

function createStates (states) {
  const obj = {}
  _.forEach(states, (m) => {
    obj[m] = null
  })
  return obj
}

export default (config) => {
  const items = [...__items, ...config.items]
  const states = {...createStates(items), ...__states, ...config.states}
  const getters = {...createGetters(items), ...__getters, ...config.getters}
  const mutations = {...createMutations(items), ...__mutations, ...config.mutations}

  const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state () {
      return states
    },
    getters,
    mutations,
    actions: {...__actions, ...config.actions},
    plugins: [vuexLocalStorage.plugin]
  })

  return store
}