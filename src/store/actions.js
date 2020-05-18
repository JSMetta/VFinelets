import {
    $get, $post, $put, $delete
  } from '../../finelets/plugins/fetch'
import queryCollection from '../../finelets/helpers/DealWithQueryCollection'

const actions = {
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
