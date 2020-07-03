<template>
  <div class="d-flex flex-column mt-2 shadow border p-2">
      <div class="d-flex w-100 mt-2 px-2 pt-2 align-items-baseline" style="">
          <p class="mr-auto">状态：{{state.name}}</p>
          <div v-if="editable" class="d-flex" style="">
            <button type="button" class="btn btn-success btn-sm border-1" style="width:70px" @click="onEdit">编辑</button>
            <button type="button" class="btn btn-success btn-sm border-1 ml-2" style="width:70px" @click="onCommit">送审</button>
        </div>
      </div>
      <div class="d-flex flex-column border px-2 pt-2" style="">
          <div class="d-flex w-100 align-items-baseline">
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
          <p v-if="selectedPurchase.data.refNo" class="ml-auto">参考单号：{{selectedPurchase.data.refNo}}</p>
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
          <p class="" style="width:60px" >备注：</p>
          <textarea class="form-control bg-white" rows="4" v-model="this.selectedPurchase.data.remark" readonly></textarea>
      </div>
  </div>
</template>

<script>
import _ from 'lodash'
import typeEnums from '../helpers/Enums.js'

export default {
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
    selectedPurchase () {
      return this.$store.getters.selected('Purchase')
    },
    editable () {
      const state = this.selectedPurchase.data.state
      return state === 'Draft' || state === 'Unapproved'
    },
    state () {
      const state = this.selectedPurchase.data.state
      const s = _.find(typeEnums.purchaseState, item => {
        return item.value === state
      })
      return s
    }
  },
  created () {
  },
  methods: {
    onEdit () {
      let path = {
        name: 'masterEditPO'
      }
      this.$router.push(path)
    },
    async onCommit () {
      const transactionsUrl = this.selectedPurchase.links.transactions
      const {id, __v} = this.selectedPurchase.data
      await this.$store.dispatch('poTransaction', {url: transactionsUrl, type: 'commit', data: {id, __v}})
      this.$router.go(-1)
    },

    onPageChanged (page) {
      /* const loaders = {purchases: this.onSearchPurchases}
      loaders[page]({search: '', filters: [this.master.id]}) */
    }
  }
}
</script>
