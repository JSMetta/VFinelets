import {
  $get,
  $post,
  $put,
  $delete
} from '../../finelets/plugins/fetch'
import {
  searchCollection, dealWithCollection, dealWithEntity
} from '../../finelets/helpers/DealWithQueryCollection'

const purchaseRefs = {
  Part: 'part',
  Supplier: 'supplier',
  User: ['applier', 'reviewer', 'creator']
}

const withdrawRefs = {
  Part: 'part',
  User: 'actor'
}

const actions = {
  async searchPrograms({
    getters
  }, condi) {
    const data = await searchCollection(getters, 'programs', condi, 'Program')
    return data
  },

  async getProgram(ctx, url) {
    let data = await $get(url)
    data = await dealWithEntity(data, 'Program')
    return data
  },

  async createProgram({
    getters
  }, data) {
    const entry = getters.entry
    const url = entry.programs
    const result = await $post(url, data)
    return result
  },

  async updateProgram({
    commit
  }, data) {
    await $put(data.links.self, data.data.__v, data.data)
  },

  async removeProgram({
    commit
  }, url) {
    const res = await $delete(url)
    return res
  },

  async loadProgramLogs({
    commit
  }, url) {
    const res = await $get(url)
    return res
  },

  async runSerialPortProgram({
    commit
  }, url) {
    let res = await $post(url)
    return res
  },

  async searchParts({
    getters
  }, condi) {
    const data = await searchCollection(getters, 'parts', condi, 'Part')
    return data
  },

  async searchSuppliers({
    getters
  }, condi) {
    const data = await searchCollection(getters, 'suppliers', condi, 'Supplier')
    return data
  },

  async searchPurchases({
    getters
  }, condi) {
    const data = await searchCollection(getters, 'purchases', condi, 'Purchase', purchaseRefs)
    return data
  },

  async searchWithdraws({
    getters
  }, condi) {
    const data = await searchCollection(getters, 'withdraws', condi, 'Withdraw', withdrawRefs)
    return data
  },

  async updatePart({
    commit
  }, data) {
    await $put(data.links.self, data.data.__v, data.data)
    let updated = await $get(data.links.self)
    updated = await dealWithEntity(updated, 'Part')
    commit('selected', {key: 'Part', val: updated})
  },

  async updateSupplier({
    commit
  }, data) {
    await $put(data.links.self, data.data.__v, data.data)
    let updated = await $get(data.links.self)
    updated = await dealWithEntity(updated, 'Supplier')
    commit('selected', {key: 'Supplier', val: updated})
  },

  async updatePurchase({
    commit
  }, data) {
    await $put(data.links.self, data.data.__v, data.data)
    const updated = await $get(data.links.self)
    const entity = await dealWithEntity(updated, 'Purchase', purchaseRefs)
    commit('selected', {key: 'Purchase', val: entity})
  },

  async getSupplier(ctx, url) {
    const data = await $get(url)
    return data
  },

  async getPart(ctx, url) {
    const data = await $get(url)
    return data
  },

  async createPart({
    getters
  }, data) {
    const entry = getters.entry
    const url = entry.parts
    await $post(url, data)
  },

  async createSupplier({
    getters
  }, data) {
    const entry = getters.entry
    const url = entry.suppliers
    await $post(url, data)
  },

  async createPurchase({
    getters
  }, data) {
    const entry = getters.entry
    const url = entry.purchases
    await $post(url, data)
  },

  async createWithdraw({
    getters
  }, data) {
    const entry = getters.entry
    const url = entry.withdraws
    await $post(url, data)
  },

  async getPoTransactions (ctx, url) {
    const coll = await $get(url)
    let data = await dealWithCollection(coll, 'PoTransaction', { User: 'actor' })
    return data
  },

  async poTransaction({
    getters
  }, {
    url,
    type,
    data
  }) {
    const finalUrl = `${url}?type=${type}`
    const actor = getters.user.id
    await $post(finalUrl, {
      ...data,
      actor
    })
  },

  async refreshSelectedPurchase({
    getters,
    commit
  }) {
    let data = getters.selected('Purchase')
    const po = await $get(data.links.self)
    const entity = await dealWithEntity(po, 'Purchase', purchaseRefs)
    commit('selected', {key: 'Purchase', val: entity})
  },
}

export default actions