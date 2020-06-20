import {
    $get,
    $post,
    $login,
    $put,
    $entry,
    $delete,
    $upload,
    $fetchAsset
} from '../../finelets/plugins/fetch'
import {
    dealWithCollection,
    searchCollection,
    dealWithEntity
} from '../../finelets/helpers/DealWithQueryCollection'
import _ from 'lodash'

const productRefs = {
    User: 'creator'
}
const supplierRefs = productRefs
const customerRefs = productRefs

const actions = {
    async searchProductChainPartQuots({}, url, condi) {
        if (condi) url = `${url}?${condi}`
        const coll = await $get(url)
        const data = await dealWithCollection(coll, 'ProductChainPartQuot', {
            Product: 'product',
            ProductChain: 'productChain',
            Part: 'productChainPart',
            PartQuot: 'quot'
        })
        return data
    },

    async searchProductChainParts({}, url, condi) {
        if (condi) url = `${url}?${condi}`
        const coll = await $get(url)
        const data = await dealWithCollection(coll, 'ProductChainPart', {
            Part: 'part'
        })
        return data
    },

    async searchProductChains({}, url, condi) {
        if (condi) url = `${url}?${condi}`
        const coll = await $get(url)
        const data = await dealWithCollection(coll, 'ProductChain', {
            Product: 'product'
        })
        return data
    },

    async searchRequirements({}, url, condi) {
        if (condi) url = `${url}?${condi}`
        const coll = await $get(url)
        const data = await dealWithCollection(coll, 'CustomerRequirement', {
            Customer: 'customer'
        })
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
    }, {
        data,
        url
    }) {
        await $put(url, data.__v, data)
        let val = await $get(url)
        val = await dealWithEntity(val, 'Product', productRefs)
        commit('selected', {
            key: 'Product',
            val
        })
        return val
    },

    async updateSupplier({
        commit
    }, {
        data,
        url
    }) {
        await $put(url, data.__v, data)
        let val = await $get(url)
        val = await dealWithEntity(val, 'Supplier', supplierRefs)
        commit('selected', {
            key: 'Supplier',
            val
        })
        return val
    },

    async updateCustomer({
        commit
    }, {
        data,
        url
    }) {
        await $put(url, data.__v, data)
        let val = await $get(url)
        val = await dealWithEntity(val, 'Customer', customerRefs)
        commit('selected', {
            key: 'Customer',
            val
        })
        return val
    },

    async updateCustomerRequirement({
        commit
    }, {
        data,
        url
    }) {
        await $put(url, data.__v, data)
        let val = await $get(url)
        val = await dealWithEntity(val, 'CustomerRequirement', {Customer: 'customer'})
        commit('selected', {
            key: 'CustomerRequirement',
            val
        })
        return val
    },

    async getSupplier(ctx, url) {
        let data = await $get(url)
        data = await dealWithEntity(data, 'Supplier', supplierRefs)
        return data
    },

    async getCustomer(ctx, url) {
        let data = await $get(url)
        data = await dealWithEntity(data, 'Customer', customerRefs)
        return data
    },

    async getProduct(ctx, url) {
        const data = await $get(url)
        data = await dealWithEntity(data, 'Product', productRefs)
        return data
    },

    async getCustomerRequirement(ctx, url) {
        let data = await $get(url)
        data = await dealWithEntity(data, 'CustomerRequirement', {Customer: 'customer'})
        return data
    },

    async getProductChain(ctx, url) {
        let data = await $get(url)
        data = await dealWithEntity(data, 'ProductChain', {Product: 'product', CustomerRequirement: 'customerRequirement'})
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
    },

    async createResource(ctx, {url, data}) {
        await $post(url, data)
    },

    async removeResource(ctx, url) {
        await $delete(url)
    }
}

export default actions