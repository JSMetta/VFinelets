<template>
  <div>
    <div class="form-inline mb-2">
      <div class="btn-group ml-auto">
        <dropdown class="ml-1" :options="actions.options" label="请选择需执行的操作" :value="actionVal"
                  @changed="filterChanged"/>
      </div>
      <icon-button class="ml-3" icon="repo" text="执行" @click="triggerAction"/>
    </div>
    <item-list :items="transactions">
      <template slot-scope="transaction">
        <div class="row border-0 p-2">
          <div class="col">
            <h6 class="font-weight-bold">{{transaction.item.type}}</h6>
            <div v-if="transaction.item.content" class="d-flex">
              <octicon name="note" class="mt-1 mr-1" size="16" style="color:green"/>
              <h6 class="text-primary mb-1 mr-auto">
                {{transaction.item.content}}
              </h6>
            </div>
            <div class="d-flex">
              <octicon name="primitive-dot" scale="1.1" style="color:yellow"/>
              <h6 class="ml-1" style="font-size:10px">{{transaction.item.actor}}</h6>
              <octicon v-if="transaction.item.remark" name="tag" class="ml-3" size="16" style="color:green"/>
              <h6 class="ml-1 mr-auto" style="font-size:10px;width:450px;overflow:hidden;text-overflow:ellipsis">{{transaction.item.remark}}</h6>
              <h6 class="text-secondary" style="font-size:10px">
                {{transaction.item.dateName}} {{transaction.item.date | date }}
              </h6>
            </div>
          </div>
        </div>
      </template>
    </item-list>
  </div>
</template>

<script>
import _ from 'lodash'
import ItemList from '../../finelets/components/ItemList.vue'
import {getPoTransactions} from '../helpers/PurchaseHelper.js'

const transactionNames = {
  commit: '提交审核',
  review: '审核',
  inv: '采购入库'
}
const transactionDateNames = {
  commit: '申请日期：',
  review: '审核日期：',
  inv: '入库日期：'
}
const transactionContents = {
  commit: () => undefined,
  review: data => {
    return data.pass ? '审核通过' : '未通过审核'
  },
  inv: (data) => '数量：' + data.qty
}

export default {
  components: {
    ItemList
  },
  props: {
    actions: {
      type: Object,
      required: true
    }
  },
  data () {
    const val = this.actions.value
    return {
      actionVal: val,
      transactions: []
    }
  },
  computed: {
    selectedPurchase () {
      return this.$store.getters.selected('Purchase')
    }
  },
  async created () {
    const selectedPurchase = this.$store.getters.selected('Purchase')
    this.remark = selectedPurchase.data.remark
    const data = await getPoTransactions(selectedPurchase.links.transactions)
    this.transactions = _.map(data, item => {
      return {
        type: transactionNames[item.data.type],
        actor: item.actor.data.name,
        date: item.data.date,
        dateName: transactionDateNames[item.data.type],
        remark: item.data.remark,
        content: transactionContents[item.data.type](item.data.data)
      }
    })
  },
  methods: {
    triggerAction () {
      this.$emit('act', this.actionVal)
    },
    filterChanged (val) {
      this.actionVal = val
    }
  }
}
</script>
