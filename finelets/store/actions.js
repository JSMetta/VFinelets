import {
  $get, $post, $login, $put, $entry, $delete, $upload, $fetchAsset
} from '../plugins/fetch'
import {dealWithCollection, searchCollection, dealWithEntity, dealWithLinkages} from '../helpers/DealWithQueryCollection'

const actions = {
  async refreshUserAvatar ({getters, commit}) {
    const user = getters.user
    if(user && user.pic) {
      const avatar = await $fetchAsset(`/pictures/${user.pic}`)
      commit('avatar', avatar)
    }
  },

  async entry ({commit, dispatch}) {
    const entry = await $entry()
    const links = dealWithLinkages(entry)
    commit('entry', links)
    await dispatch('refreshUserAvatar')
  },

  async login ({commit, dispatch}, data) {
    try {
      const session = await $login(data)
      if (session) {
        commit('token', session.token)
        commit('user', session.user)
        await dispatch('refreshUserAvatar')
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
    user = await dealWithEntity(user, 'User')
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
    const data = await searchCollection(getters, 'users', condi, 'User')
    return data
  },

  async selectResource ({commit}, {url, key, ref}) {
    let val = await $get(url)
    val = await dealWithEntity(val, key, ref)
    commit('selected', {key, val})
    return val
  }
}

export default actions
