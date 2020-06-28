<template>
  <div class="mx-auto w-75">
    <div class="row mt-4 justify-content-center">
      <div class="col-3">
        <img
          class="bg-dark"
          src="/static/img/JSM2-2.jpg"
          style="width:100%"
        />
      </div>
      <div class="col-9">
        <div class="d-flex border-bottom">
          <p class="" style="font-size:24px;font-weight:400;">采购单 - 处理到货</p>
        </div>
        <div class="d-flex flex-column mt-2 p-2">
            <div class="d-flex mt-2 w-100">
              <p class="" style="">单号：{{po.data.code}}</p>
              <p class="ml-auto" style="">参考单号：{{po.data.refNo}}</p>
            </div>
            <div class="d-flex flex-column border px-2 pt-2" style="">
                <div class="d-flex w-100 align-items-baseline">
                  <p class="mr-auto">料品：{{po.part.data.code}}</p>
                  <p class="">{{po.part.data.name}}</p>
                </div>
                <div class="d-flex w-100 align-items-baseline mt-2">
                    <p class="mr-auto">{{po.part.data.brand}}</p>
                    <p class="">{{po.part.data.spec}}</p>
                </div>
            </div>
            <div class="d-flex w-100 mt-2 border px-2 pt-2 align-items-baseline" style="">
                <p class="mr-auto">供应商：{{po.supplier.data.code}}</p>
                <p class="mb-2">{{po.supplier.data.name}}</p>
            </div>
            <div class="d-flex w-100 mt-2 px-2 pt-2 align-items-baseline" style="">
                <div class="d-flex align-items-baseline w-50" style="">
                    <p>单价：{{po.data.price}}</p>
                    <p class="ml-auto">数量：{{po.data.qty}} {{po.data.unit}}</p>
                </div>
                <p class="ml-auto">金额：{{po.data.amount}}</p>
            </div>
            <validate-error :text="errors.date" />
            <validate-error :text="errors.qty" />
            <div class="d-flex flex-column border">
              <div class="d-flex w-100  px-2 justify-content-between" style="">
                <div class="form-group mt-3" style="width: 150px">
                  <octicon name="calendar"/>
                  <label>到货日期：</label>
                  <input type="date" class="form-control form-control-sm" v-model="inv.date"/>
                </div>
                <div class="form-group mt-3" style="width: 150px">
                  <octicon name="pulse"/>
                  <label>数量：</label>
                  <input type="number" class="form-control form-control-sm" v-model="inv.qty"/>
                </div>
                <div class="form-group mt-3" style="width: 300px">
                  <octicon name="location"/>
                  <label>库位：</label>
                  <div class="input-group mb-3">
                      <input type="text" class="form-control form-control-sm" v-model="inv.loc"
                            @change="onLocInputed"/>
                      <div class="input-group-append">
                        <div class="dropdown">
                          <button type="button" class="btn btn-success dropdown-toggle border-0 btn-sm"
                            data-toggle="dropdown" @click="onLocDropdown"/>
                          <div class="dropdown-menu">
                            <a class="dropdown-item" v-for="(loc, index) in locs.items" :key="index"
                              @click="onLocSelected(loc)">
                              {{loc}}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
              <div class="d-flex w-100 px-2 mb-3">
                <octicon class="mt-1" name="info"/>
                <label class="ml-1">到货单号：</label>
                <input type="text" class="form-control form-control-sm w-50" v-model="inv.refNo"/>
              </div>
              <div class="d-flex w-100 px-2">
                <div class="form-group w-100">
                  <octicon name="shield"/>
                  <label>备注：</label>
                  <textarea class="form-control" v-model="remark"></textarea>
                </div>
              </div>
            </div>
            <div class="d-flex mt-3">
              <icon-button class="ml-1" icon="circle-slash" text="取消" @click="cancel"/>
              <icon-button class="ml-1" width="100px" icon="database" text="保存" @click="save"/>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { createQueryString } from '../../../finelets/helpers/QueryHelper.js'
import enums from '../../helpers/Enums'

export default {
  props: {
    width: String
  },
  data () {
    return {
      inv: {
        date: null,
        qty: null,
        refNo: null,
        loc: null
      },
      remark: null,
      locs: [],
      errors: {}
    }
  },
  computed: {
    po () {
      const data = {...this.$store.getters.selected('Purchase')}
      const partType = _.find(enums.part, item => {
        return item.value === data.part.data.type
      })
      data.part.data.typeName = partType.name
      /* const postate = find(enums.purchaseState, item => {
        return item.value === data.data.state
      })
      data.data.stateName = postate.name */
      return data
    }
  },
  methods: {
    async onLocDropdown () {
      const cond = { search: this.inv.loc, filters: [] }
      let r = createQueryString([], cond)
      let data = await this.$store.dispatch('searchLocs', r)
      this.locs = data
    },
    onLocSelected (selected) {
      this.inv.loc = selected
    },
    onLocInputed () {
    },
    cancel () {
      this.$router.back()
    },
    async save () {
      this.errors = {}
      if (!this.inv.date) this.errors.date = '必须输入到货日期'
      if (!this.inv.qty) this.errors.qty = '必须输入到货数量'
      if (_.keys(this.errors).length > 0) {
        return
      }
      const pur = this.$store.getters.selected('Purchase')
      const transactionsUrl = pur.links.transactions
      const {id, __v} = pur.data
      const data = {id, __v, remark: this.remark, data: this.inv}
      await this.$store.dispatch('poTransaction', {url: transactionsUrl, type: 'inv', data})
      this.$router.back()
    }
  }
}
</script>
