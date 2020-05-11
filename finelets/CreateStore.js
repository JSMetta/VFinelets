import _ from 'lodash/collection'

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

export default (items) => {
  return {
    states: createStates(items),
    getters: createGetters(items),
    mutations: createMutations(items)
  }
}
