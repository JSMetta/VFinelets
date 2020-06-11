import Vue from 'vue'
import {
    sync
} from 'vuex-router-sync'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import './components/global-components'

import AppLayout from './components/AppLayout.vue'
import createStore from './store/CreateStore'
import createBeforeEachRoute from './BeforeEachRoute'
import createRouter from './Router.js'
import VueFetch from './plugins/fetch'
import * as filters from './filters'
import util from './helpers/util.js'

function addAppStateConfig(store, app) {
    store.getters.app = (state) => {
        return state.app
    }
    store.states.app = app
}

async function createVueApp(config) {
    config = config || {}
    util.assert(config.app, 'You should config app when createVueApp !')
    const storeConfig = config.store ? config.store : require('../src/store').default
    addAppStateConfig(storeConfig, config.app)
    const routesConfig = config.routes ? config.routes :  require('../src/routes').default
    const store = createStore(storeConfig)
    const BeforeEachRoute = createBeforeEachRoute(store, routesConfig.starts)
    const router = createRouter(BeforeEachRoute, routesConfig)
    sync(store, router)

    for (const key in filters) {
        Vue.filter(key, filters[key])
    }

    // Install BootstrapVue
    Vue.use(BootstrapVue)
    // Optionally install the BootstrapVue icon components plugin
    Vue.use(IconsPlugin)

    const baseUrl = process.env.BASE_URL + '/' + process.env.APP_NAME
    Vue.use(VueFetch, {
        loginUrl: baseUrl + '/auth/login',
        entryUrl: baseUrl + '/index.html',
        baseUrl: baseUrl + '/api',
        logout: () => {
            store.dispatch('logout')
        },
        getToken: () => {
            return store.getters.token
        }
    })

    await store.dispatch('entry')
    new Vue({
        ...AppLayout,
        router,
        store
    }).$mount('#app')
}

export default createVueApp