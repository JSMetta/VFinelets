import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import createStore from '../../finelets/CreateStore'
import actions from './actions'
import otherStates from './states'
import otherMutations from './mutations'
import otherGetters from './getters'
Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'vuex', // The key to store the state on in the storage provider.
  storage: window.localStorage // or window.sessionStorage or localForage
  // Function that passes the state and returns the state with only the objects you want to store.
  // reducer: state => state,
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  // filter: mutation => (true)
})

const items = ['entry', 'token', 'user', 'selectedProgram', 'selectedUser'
]

let {states, getters, mutations} = createStore(items)
states = {...states, ...otherStates}
getters = {...getters, ...otherGetters}
mutations = {...mutations, ...otherMutations}

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state () {
    return states
  },
  getters,
  mutations,
  actions,
  plugins: [vuexLocalStorage.plugin]
})

export default store
