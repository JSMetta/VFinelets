<template>
  <master-details  :master="master">
    <tabpage class="col-9" :tabs="tabs" :activated="currentTab" slot="details" @changed="onPageChanged">
      <div slot="overview">
        <h1>Welcome to our support OPR center 1.0.1</h1>
        <p>
          We are here to help! Please read the <a>F.A.Q</a> first,
          and if you don't find the answer to your question, <a>send
            us a ticket!</a>
        </p>
      </div>
    </tabpage>
  </master-details>
</template>

<script>
// import {createQueryString} from '../../helpers/QueryHelper.js'
import MasterDetails from '../../../finelets/components/MasterDetails/MasterDetails.vue'
import FiltersForm from '../../../finelets/components/FiltersForm.vue'
import ItemList from '../../../finelets/components/ItemList.vue'
import state from '../../store'
const ROUTE_NAME = 'home'

export default {
  components: {
    MasterDetails,
    FiltersForm,
    ItemList
  },
  data () {
    return {
      currentTab: null,
      userAttrs: {
        userId: null,
        name: null,
        email: null
      }
    }
  },
  computed: {
    master () {
      const user = state.getters.user
      const data = {
        ...user
      }
      return {
        editable: true,
        logo: user.pic ? user.pic : '/static/img/clx.jpg',
        title: user.name,
        email: user.email,
        items: [
          {
            name: 'userId',
            icon: 'person'
          },
          {
            name: 'name',
            icon: 'note'
          },
          {
            name: 'email',
            icon: 'mail'
          }
        ],
        data,
        update: this.onSaveMaster
      }
    },
    tabs () {
      return [
        {
          id: 'overview',
          title: '概要'
        }
      ]
    }
  },
  async created () {
    let tab = state.getters.currentPage(ROUTE_NAME)
    tab = tab || 'overview'
    this.currentTab = tab
    await this.loadPageData(tab)
  },
  methods: {
    async loadPageData (page) {
      const loaders = {
        /* products: this.onSearchProducts,
        suppliers: this.onSearchSuppliers,
        customers: this.onSearchCustomers */
      }
      const func = loaders[page]
      if (!func) return
      await func({search: '', filters: []})
    },

    async onPageChanged (page) {
      state.commit('currentPage', {route: ROUTE_NAME, page})
      await this.loadPageData(page)
    },

    async onSaveMaster (data) {
      state.dispatch('saveUserProfile', data)
    }
  }
}
</script>

<style>
.selectable:hover {
  border-bottom: 2px solid #007bff;
  cursor: pointer;
}
</style>
