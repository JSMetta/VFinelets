<template>
  <div>
    <master-details :master="master">
      <tabpage
        class="col-9"
        :tabs="tabs"
        :activated="activatedTab"
        slot="details"
        @changed="onPageChanged"
      >
        <div slot="details">
          <div class="d-flex flex-column mt-2 shadow border p-2">
            <div class="d-flex w-100 mt-2 px-2 pt-2 align-items-baseline" style="">
                <p class="mr-auto">状态：{{state.name}}</p>
            </div>
            <div class="d-flex flex-column border px-2 pt-2" style="">
                <div class="d-flex  w-100 align-items-baseline">
                  <p class="mr-auto">物品：{{selectedPurchase.part.data.code}}</p>
                  <p class="">{{selectedPurchase.part.data.name}}</p>
                </div>
                <div class="d-flex w-100 align-items-baseline mt-2">
                    <p class="mr-auto">{{selectedPurchase.part.data.brand}}</p>
                    <p class="">{{selectedPurchase.part.data.spec}}</p>
                </div>
            </div>
            <div class="d-flex w-100 mt-2 border px-2 pt-2 align-items-baseline" style="">
                <p class="mr-auto">供应商：{{selectedPurchase.supplier.data.code}}</p>
                <p class="mb-2">{{selectedPurchase.supplier.data.name}}</p>
            </div>
            <div class="d-flex w-100 mt-2 px-2 pt-2 align-items-baseline" style="">
                <div class="d-flex align-items-baseline w-50" style="">
                    <p>单价：{{selectedPurchase.data.price}}</p>
                    <p class="ml-auto">数量：{{selectedPurchase.data.qty}} {{selectedPurchase.data.unit}}</p>
                </div>
                <p class="ml-auto">金额：{{selectedPurchase.data.amount}}</p>
            </div>
            <div class="d-flex w-100 px-2 align-items-baseline" style="">
                <p class="">到货日期：{{selectedPurchase.data.createDate | LLDate}}</p>
                <p class="ml-auto">参考单号：{{selectedPurchase.data.refNo}}</p>
            </div>
            <div v-if="selectedPurchase.data.appDate || selectedPurchase.applier" class="d-flex w-100 px-2 align-items-baseline" style="">
                <p v-if="selectedPurchase.applier" class="">申请人：{{selectedPurchase.applier.data.name}}</p>
                <p v-if="selectedPurchase.data.appDate" class="ml-auto">申请日期：{{selectedPurchase.data.appDate | LLDate}}</p>
            </div>
            <div v-if="selectedPurchase.data.reviewDate || selectedPurchase.reviewer" class="d-flex w-100 px-2 align-items-baseline" style="">
                <p v-if="selectedPurchase.reviewer" class="">审核人：{{selectedPurchase.reviewer.data.name}}</p>
                <p v-if="selectedPurchase.data.reviewDate" class="ml-auto">审核日期：{{selectedPurchase.data.reviewDate | LLDate}}</p>
            </div>
            <div class="d-flex w-100 px-2 flex-column" style="">
              <div class="d-flex w-100 px-2 align-items-center">
                  <p class="mr-auto" style="width:55px" >备注：</p>
              </div>
              <textarea class="form-control bg-white" rows="5" v-model="remark" readonly></textarea>
            </div>
          </div>
          <div v-if="mayReview" class="d-flex flex-column mt-2 shadow border p-2">
              <div class="d-flex w-100 mt-2 align-items-baseline">
                <p class="mr-auto">审核意见：</p>
                <button type="button" class="btn btn-success btn-sm border-1 ml-2" style="width:100px" @click="onSave(true)">同意</button>
                <button type="button" class="btn btn-light btn-cancel btn-sm border-1 ml-2" style="width:100px" @click="onSave(false)">退回</button>
              </div>
              <textarea class="form-control" v-model="opinion"></textarea>
          </div>
        </div>
        <div slot="transactions">
          <po-transactions :actions="actions" @act="act"/>
        </div>
      </tabpage>
    </master-details>
    <modal v-if="showModal" width="600px">
      <div slot="content">
          <div class="d-flex flex-column">
            <div class="d-flex mt-4 mb-4 mx-auto">
              <h3>采购单审核</h3>
            </div>
            <div class="d-flex">
                <div class="form-group w-100">
                  <octicon name="shield" class=""/>
                  <label>审核意见：</label>
                  <textarea class="form-control" v-model="opinion"></textarea>
                </div>
            </div>
            <div class="d-flex justify-content-center mt-3">
              <icon-button class="ml-1" icon="database" text="通过" @click="onSave(true)"/>
              <icon-button class="ml-1" icon="database" text="退回" @click="onSave(false)"/>
              <icon-button class="ml-1" icon="circle-slash" text="取消" @click="onSave"/>
            </div>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import _ from 'lodash'
import typeEnums from '../../helpers/Enums.js'
import MasterDetails from '../../../finelets/components/MasterDetails/MasterDetails.vue'
import PoTransactions from '../../components/PoTransactions.vue'
import masterImg from '../../static/img/suixi.jpg'

const ROUTE_NAME = 'ceoMasterPurchase'

export default {
  components: {
    MasterDetails,
    PoTransactions
  },
  data () {
    return {
      remark: null,
      opinion: null,
      transactions: [],
      showModal: false,
      activatedTab: null
    }
  },
  computed: {
    master () {
      const selectedPurchase = this.$store.getters.selected('Purchase')
      const master = {
        editable: false,
        avatar: selectedPurchase.part.data.img || masterImg,
        subtitle: selectedPurchase.data.code,
        title: '采购单'
      }
      return master
    },
    state () {
      const state = this.$store.getters.selected('Purchase').data.state
      const s = _.find(typeEnums.purchaseState, item => {
        return item.value === state
      })
      return s
    },
    mayReview () {
      return this.$store.getters.selected('Purchase').data.state === 'Review'
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
      const state = this.$store.getters.selected('Purchase').data.state
      return state === 'Review' ? {
        value: 'review',
        options: [
          { name: '审核', value: 'review' }
        ]
      } : {options: []}
    }
  },
  async created () {
    const tab = this.$store.getters.currentPage(ROUTE_NAME)
    this.activatedTab = tab || 'details'
  },
  methods: {
    async onSave (pass) {
      this.showModal = false
      if (pass === undefined) {
        return
      }
      const selectedPurchase = this.$store.getters.selected('Purchase')
      const transactionsUrl = selectedPurchase.links.transactions
      const {id, __v} = selectedPurchase.data
      const data = {url: transactionsUrl, type: 'review', data: {id, __v, pass}}
      if (this.opinion) data.data.remark = this.opinion
      await this.$store.dispatch('poTransaction', data)
      await this.$store.dispatch('refreshSelectedPurchase')
      this.$router.go()
    },
    async act (type) {
      if (!type) return
      this.showModal = true
    },
    onPageChanged (page) {
      this.$store.commit('currentPage', {route: ROUTE_NAME, page})
    }
  }
}
</script>

<style>
 .Subhead
 {
  border-bottom: 1px solid #e1e4e8;
  display: flex;
  flex-flow: row wrap;
  margin-bottom: 16px;
  padding-bottom: 8px;
}
.Subhead-heading {
    flex: 1 1 auto;
    font-size: 24px;
    font-weight: 400;
}
</style>
