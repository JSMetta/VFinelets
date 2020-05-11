import Vue from 'vue'
import {
    sync
} from 'vuex-router-sync'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../finelets/components/global-components'

import AppLayout from '../finelets/components/AppLayout.vue'
import store from './store'
import createBeforeEachRoute from '../finelets/BeforeEachRoute'
import createRouter from '../finelets/Router.js'
import routes from './routes.js'
import VueFetch from '../finelets/plugins/fetch'

async function main() {
    const BeforeEachRoute = createBeforeEachRoute(store, routes.starts)
    const router = createRouter(BeforeEachRoute, routes)
    sync(store, router)

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

main()