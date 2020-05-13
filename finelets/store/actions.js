import {
  $get, $post, $login, $put, $entry, $delete
} from '../plugins/fetch'
import queryCollection from '../helpers/DealWithQueryCollection'

const actions = {
  async entry ({commit}) {
    const entry = await $entry()
    const links = queryCollection.dealWithLinkages(entry)
    commit('entry', links)
  },

  async login ({commit}, data) {
    try {
      const session = await $login(data)
      return session
    } catch (e) {
      // do nothing
    }
  },

  async logout ({
    commit
  }) {
    commit('token', null)
    commit('user', null)
  },

  async registerUser ({getters}, data) {
    const entry = getters.entry
    await $post(entry.register, data)
  },

  async authToUser ({commit}, {selfUrl, url, data}) {
    await $put(url, undefined, data)
    let user = await $get(selfUrl)
    user = await queryCollection.dealWithEntity(user, 'User')
    commit('selectedUser', user)
  },

  async updatePwd (ctx, {id, data}) {
    const url = `/auth/users/${id}/password`
    console.log('url:' + url)
    await $put(url, undefined, data)
  },

  async saveUserProfile ({getters, commit}, data) {
    const url = getters.entry.currentUser + '?scope=info'
    let toUpdate = {...data}
    await $put(url, undefined, toUpdate)
    commit('user', {...getters.user, ...data})
  },

  async searchUsers ({getters}, condi) {
    const data = await queryCollection.searchCollection(getters, 'users', condi, 'User')
    return data
  }
}

export default actions
