import {$get, $post, $login, $put, $entry, $delete, $upload, $fetchAsset } from '../../finelets/plugins/fetch'
import {dealWithCollection, searchCollection, dealWithEntity} from '../../finelets/helpers/DealWithQueryCollection'
const productRefs = {
    User: 'creator'
}
const supplierRefs = productRefs
const customerRefs = productRefs

const actions = {
    async searchRequirements({}, url, condi) {
        if (condi) url = `${url}?${condi}`
        const coll = await $get(url)
        const data = await dealWithCollection(coll, 'CustomerRequirement', {Customer: 'customer'})
        return data
    },

    async searchProducts({
        getters
    }, condi) {
        const data = await searchCollection(getters, 'products', condi, 'Product', productRefs)
        return data
    },

    async searchSuppliers({
        getters
    }, condi) {
        const data = await searchCollection(getters, 'suppliers', condi, 'Supplier', supplierRefs)
        return data
    },

    async searchCustomers({
        getters
    }, condi) {
        const data = await searchCollection(getters, 'customers', condi, 'Customer', customerRefs)
        return data
    },

    async updateProduct({
        commit
    }, {data, url}) {
        await $put(url, data.__v, data)
        let val = await $get(url)
        val = await dealWithEntity(val, 'Product', productRefs)
        commit('selected', {key: 'Product', val})
        return val
    },

    async updateSupplier({
        commit
    }, {data, url}) {
        await $put(url, data.__v, data)
        let val = await $get(url)
        val = await dealWithEntity(val, 'Supplier', supplierRefs)
        commit('selected', {key: 'Supplier', val})
        return val
    },

    async updateCustomer({
        commit
    }, {data, url}) {
        await $put(url, data.__v, data)
        let val = await $get(url)
        val = await dealWithEntity(val, 'Customer', customerRefs)
        commit('selected', {key: 'Customer', val})
        return val
    },

    async getSupplier(ctx, url) {
        const data = await $get(url)
        return data
    },

    async getCustomer(ctx, url) {
        const data = await $get(url)
        return data
    },

    async getProduct(ctx, url) {
        const data = await $get(url)
        return data
    },

    async createProduct({
        getters
    }, data) {
        const entry = getters.entry
        const url = entry.products
        await $post(url, data)
    },

    async createSupplier({
        getters
    }, data) {
        const entry = getters.entry
        const url = entry.suppliers
        await $post(url, data)
    },

    async createCustomer({
        getters
    }, data) {
        const entry = getters.entry
        const url = entry.customers
        await $post(url, data)
    }
}

export default actions