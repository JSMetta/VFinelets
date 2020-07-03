<template>
  <master-details :master="master">
      <tabpage class="col-9" :tabs="tabs" :activated="currentTab" slot="details" @changed="onPageChanged">
        <div slot="details">
          <router-view />
        </div>
        <div slot="transactions">
          <po-transactions :actions="actions" @act="act"/>
        </div>
      </tabpage>
  </master-details>
</template>

<script>
import MasterDetails from '../../../finelets/components/MasterDetails/MasterDetails.vue'
import PoTransactions from '../../components/PoTransactions.vue'

const ROUTE_NAME = 'masterPurchase'

export default {
  components: {
    MasterDetails,
    PoTransactions
  },
  data () {
    return {
      currentTab: null
    }
  },
  computed: {
    master () {
      const selectedPurchase = this.$store.getters.selected('Purchase')
      const master = {
        editable: false,
        avatar: '/src/static/img/suixi.jpg',
        subtitle: selectedPurchase.data.code,
        title: '采购单'
      }
      return master
    },
    tabs () {
      return [
        {
          id: 'details',
          title: '内容'
        },
        {
          id: 'transactions',
          title: '交易'
        }
      ]
    },
    actions () {
      const postate = this.$store.getters.selected('Purchase').data.state
      const actions = {
        Draft: {
          value: 'commit',
          options: [
            { name: '提交评审', value: 'commit' }
          ]
        },
        Review: {options: []},
        Unapproved: {
          value: 'commit',
          options: [
            { name: '提交评审', value: 'commit' }
          ]
        },
        Open: {
          value: 'inv',
          options: [
            { name: '入库', value: 'inv' },
            { name: '结案', value: 'close' },
            { name: '中止', value: 'cancel' }
          ]
        },
        Closed: {options: []},
        Canceled: {options: []}
      }
      return actions[postate]
    }
  },
  async created () {
    let tab = this.$store.getters.currentPage(ROUTE_NAME)
    tab = tab || 'details'
    this.currentTab = tab
  },
  methods: {
    async act (type) {
      const actions = {
        commit: this.onCommit,
        inv: this.onInv,
        close: this.onClose,
        cancel: this.onCancel
      }
      const func = actions[type]
      if (!func) return
      await func()
    },

    onPageChanged (page) {
      this.$store.commit('currentPage', {route: ROUTE_NAME, page})
    },

    onInv () {
      let path = {
        name: 'POInvTransaction'
      }
      this.$router.push(path)
    },

    async onCommit () {
      const state = this.$store
      const pur = state.getters.selected('Purchase')
      const transactionsUrl = pur.links.transactions
      const {id, __v} = pur.data
      await state.dispatch('poTransaction', {url: transactionsUrl, type: 'commit', data: {id, __v}})
      await state.dispatch('refreshSelectedPurchase')
      this.$router.go()
    }
  }
}
</script>
