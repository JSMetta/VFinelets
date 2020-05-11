import {
  $get, $post, $login, $put, $entry, $delete
} from '../../finelets/plugins/fetch'
import router from '../router'
import queryCollection from '../../finelets/helpers/DealWithQueryCollection'

const actions = {
  async entry (ctx) {
    let entry = await $entry()
    let links = queryCollection.dealWithLinkages(entry)
    ctx.commit('entry', links)
  },

  async login ({
    commit
  }, data) {
    try {
      const session = await $login(data)
      if (session) {
        commit('token', session.token)
        commit('user', session.user)
        let path = router.currentRoute.params.wantedRoute || {
          name: 'home'
        }
        if (session.user.isAdmin) path = {name: 'admin'}

        router.replace(path)
      }
    } catch (e) {
      // do nothing
    }
  },

  async logout ({
    commit
  }) {
    commit('token', null)
    commit('user', null)
    if (router.currentRoute.matched.some(r => !r.meta.public)) {
      router.replace({
        name: 'login',
        params: {
          wantedRoute: router.currentRoute.fullPath
        }
      })
    }
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
  },

  async searchPrograms ({getters}, condi) {
    const data = await queryCollection.searchCollection(getters, 'programs', condi, 'Program')
    return data
  },

  async getProgram (ctx, url) {
    let data = await $get(url)
    data = await queryCollection.dealWithEntity(data, 'Program')
    return data
  },

  async createProgram ({getters}, data) {
    const entry = getters.entry
    const url = entry.programs
    const result = await $post(url, data)
    return result
  },

  async updateProgram ({commit}, data) {
    await $put(data.links.self, data.data.__v, data.data)
  },

  async removeProgram ({commit}, url) {
    const res = await $delete(url)
    return res
  },

  async loadProgramLogs ({commit}, url) {
    const res = await $get(url)
    return res
  },

  async runSerialPortProgram ({commit}, url) {
    let res = await $post(url)
    res = await $get(res.href)
    return res
  }
}

export default actions
