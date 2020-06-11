import {
  $get, $post, $login, $put, $entry, $delete, $upload, $fetchAsset
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
      if (session) {
        commit('token', session.token)
        commit('user', session.user)
        if(session.user.pic) {
          const avatar = await $fetchAsset(`/pictures/${session.user.pic}`)
          commit('avatar', avatar)
        }
      }
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
    commit('avatar', null)
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
    await $put(url, undefined, data)
  },

  async uploadUserPic ({getters, commit, dispatch}, formData) {
    const id = getters.user.id
    const url = `/users/${id}/pic`
    const result = await $upload(url, formData)
    const avatar = await $fetchAsset(result.href);
    commit('avatar', avatar)
    return result
  },

  async removeUserPic ({getters, commit}) {
    const id = getters.user.id
    const url = `/users/${id}/pic`
    const res = await $delete(url)
    commit('avatar', null)
    return res
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
