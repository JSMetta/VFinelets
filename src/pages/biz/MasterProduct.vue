<template>
  <master-details :master="master">
      <tabpage class="col-9" :tabs="tabs" :activated="currentTab" slot="details" @changed="onPageChanged">
        <div slot="overview">
          <h1>Welcome to our support center 1.0.1</h1>
          <p>
            Here we will list all indexed about current part!
          </p>
        </div>
      </tabpage>
  </master-details>
</template>

<script>
import MasterDetails from '../../components/MasterDetails/MasterDetails'
import FiltersForm from '../../components/FiltersForm'
import ItemList from '../../components/ItemList'
import state from '../../store'
const ROUTE_NAME = 'masterProduct'
export default {
  components: {
    MasterDetails,
    FiltersForm,
    ItemList
  },
  data () {
    return {
      currentTab: null,
      orders: []
    }
  },
  computed: {
    master () {
      const product = state.getters.selectedProduct.data
      product.specDnsty = product.spec.dnsty
      product.specWidth = product.spec.width
      product.specGSM = product.spec.GSM
      product.greyDnsty = product.grey.dnsty
      product.greyWidth = product.grey.width
      product.greyGSM = product.grey.GSM
      delete product.spec
      delete product.grey
      let img = '/static/img/suixi.jpg'
      let subtitle
      subtitle = product.desc
      if (product.yarn) {
        subtitle = subtitle + ' -- ' + product.yarn
      }
      let editable = !product.state || product.state === 'draft'
      return {
        editable,
        logo: img,
        title: product.code,
        subtitle,
        items: [
          {
            name: 'code',
            icon: 'shield'
          },
          {
            name: 'desc',
            icon: 'note'
          },
          {
            name: 'content',
            icon: 'gear'
          },
          {
            name: 'constructure',
            icon: 'ruby'
          },
          {
            name: 'yarn',
            icon: 'server'
          },
          {
            name: 'specDnsty',
            icon: 'fold'
          },
          {
            name: 'specWidth',
            icon: 'ellipsis'
          },
          {
            name: 'specGSM',
            type: 'number',
            icon: 'hubot'
          },
          {
            name: 'greyDnsty',
            icon: 'fold'
          },
          {
            name: 'greyWidth',
            icon: 'ellipsis'
          },
          {
            name: 'greyGSM',
            type: 'number',
            icon: 'hubot'
          },
          {
            name: 'tags',
            icon: 'light-bulb'
          },
          {
            name: 'remark',
            icon: 'tag'
          }
        ],
        data: product,
        update: this.onSaveMaster
      }
    },
    orderFilters () {
      return {
        search: {width: 400},
        cmdButton: {text: '新增'}
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
    async onSaveMaster (data) {
      if (data) {
        data.spec = data.spec || {}
        data.spec.dnsty = data.specDnsty
        data.spec.width = data.specWidth
        data.spec.GSM = data.specGSM
        data.grey = data.grey || {}
        data.grey.dnsty = data.greyDnsty
        data.grey.width = data.greyWidth
        data.grey.GSM = data.greyGSM
        data.creator = state.getters.user.id
        await state.dispatch('updateProduct', {data, links: state.getters.selectedProduct.links})
      }
    },
    async loadPageData (page) {
      const loaders = {
      }
      const func = loaders[page]
      if (!func) return
      await func({search: '', filters: []})
    },
    async onPageChanged (page) {
      state.commit('currentPage', {route: ROUTE_NAME, page})
      await this.loadPageData(page)
    }
  }
}
</script>
