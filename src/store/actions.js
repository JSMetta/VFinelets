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
    }, data) {
        await $put(data.links.self, data.data.__v, data.data)
        let updated = await $get(data.links.self)
        updated = await dealWithEntity(updated, 'Product', productRefs)
        commit('selectedProduct', updated)
    },

    async updateSupplier({
        commit
    }, data) {
        await $put(data.links.self, data.data.__v, data.data)
        let updated = await $get(data.links.self)
        updated = await dealWithEntity(updated, 'Supplier', supplierRefs)
        commit('selectedSupplier', updated)
    },

    async updateCustomer({
        commit
    }, data) {
        await $put(data.links.self, data.data.__v, data.data)
        const updated = await $get(data.links.self)
        const entity = await dealWithEntity(updated, 'Customer', customerRefs)
        commit('selectedCustomer', entity)
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