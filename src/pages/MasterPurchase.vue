<template>
  <master-details :master="master">
      <tabpage class="col-9" :tabs="tabs" activated="details" slot="details" @changed="onPageChanged">
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
import MasterDetails from '../../finelets/components/MasterDetails/MasterDetails.vue'
import PoTransactions from '../components/PoTransactions.vue'
export default {
  components: {
    MasterDetails,
    PoTransactions
  },
  data () {
    return {
    }
  },
  computed: {
    selectedPurchase () {
      return this.$store.getters.selected('Purchase')
    },
    master () {
      const master = {
        editable: false,
        logo: this.selectedPurchase.part.data.img || '/static/img/suixi.jpg',
        subtitle: this.selectedPurchase.data.code,
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
      const state = this.selectedPurchase.data.state
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
      return actions[state]
    }
  },
  async created () {
  },
  methods: {
    act (type) {
      alert('act: ' + type)
    },
    onPageChanged (page) {
    }
  }
}
</script>
