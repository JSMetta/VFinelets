import Vue from 'vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../finelets/components/global-components'

import AppLayout from '../finelets/components/AppLayout.vue'
import router from './router'
import store from './store'
import {
    sync
} from 'vuex-router-sync'

sync(store, router)

async function main() {
    new Vue({
        ...AppLayout,
        router,
        store
    }).$mount('#app')
}

main()