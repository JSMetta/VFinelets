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
        <div class="d-flex align-items-baseline">
          <p class="" style="font-size:24px;font-weight:400;">采购单</p>
        </div>
        <form class="border-top" novalidate="true" @submit.prevent>
          <div class="mt-3">
            <p v-if="errors.length">
              <b>Please correct the following error(s):</b>
              <ul>
                <li
                  v-for="(error, index) in errors"
                  :key="index"
                >{{ error }}</li>
              </ul>
            </p>
            <div class="form-row">
              <div class="col-4 ml-1">
                <div class="form-group">
                  <octicon
                    name="shield"
                    class=""
                  />
                  <label>单号：<validate-error :text="errors.code" /></label>
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    v-model="po.code"
                  >
                </div>
              </div>
            </div>
            <div class="form-row ml-1">
              <div class="form-group w-100">
                <octicon name="rocket"/>
                <label>料品：
                  <validate-error :text="errors.part" /></label>
                <div class="d-flex align-items-baseline">
                  <div class="input-group mb-3 mr-5" style="width:50%">
                    <input type="text" class="form-control form-control-sm" v-model="po.part.name" @change="onPartInputed"/>
                    <div class="input-group-append">
                      <div class="dropdown">
                        <button type="button" class="btn btn-success dropdown-toggle border-0 btn-sm" data-toggle="dropdown" @click="onPartDropdown"/>
                        <div class="dropdown-menu">
                          <a
                            class="dropdown-item"
                            v-for="(part, index) in parts"
                            :key="index"
                            @click="onPartSelected(part)"
                          >
                            {{part.data.name}} - {{part.data.spec}} - {{part.data.brand}}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <octicon v-if="po.part.brand" name="bookmark" class="mr-1"/>
                  <input type="text" v-if="po.part.brand" readonly class="form-control-plaintext text-truncate" style="width:20%" :value="po.part.brand"/>
                  <octicon v-if="po.part.spec" name="eye" class="mr-1"/>
                  <input type="text" v-if="po.part.spec" readonly class="form-control-plaintext text-truncate" style="width:40%" :value="po.part.spec"/>
                </div>
              </div>
            </div>
            <validate-error v-if="errors.purDate" :text="errors.purDate" />
            <validate-error v-if="errors.qty" :text="errors.qty" />
            <validate-error v-if="errors.amount" :text="errors.amount" />
            <div class="form-row">
              <div class="col-4 ml-1">
                <div class="form-group">
                  <octicon
                    name="calendar"
                    class=""
                  />
                  <label>日期：</label>
                  <input
                    type="date"
                    class="form-control form-control-sm"
                    v-model="po.createDate"
                  >
                </div>
              </div>
              <div class="col-2 ml-1">
                <div class="form-group">
                  <octicon
                    name="pulse"
                    class=""
                  />
                  <label>数量：</label>
                  <input
                    type="number"
                    class="form-control form-control-sm"
                    v-model="po.qty"
                  >
                </div>
              </div>
              <div class="col-2 ml-1">
                <div class="form-group">
                  <octicon
                    name="pulse"
                    class=""
                  />
                  <label>单价：</label>
                  <input
                    type="number"
                    class="form-control form-control-sm"
                    v-model="po.price"
                  >
                </div>
              </div>
              <div class="col-2 ml-1">
                <div class="form-group">
                  <octicon
                    name="pulse"
                    class=""
                  />
                  <label>金额：</label>
                  <input
                    type="number"
                    class="form-control form-control-sm"
                    v-model="po.amount"
                  >
                </div>
              </div>
            </div>
            <div class="form-row ml-1">
              <div class="col-8">
                <div class="form-group w-100">
                  <octicon
                    name="organization"
                    class=""
                  />
                  <label>供应商：
                    <validate-error :text="errors.supplier" /></label>
                  <div class="d-flex align-items-baseline">
                    <div class="input-group mb-3 mr-auto">
                      <input
                        type="text"
                        class="form-control form-control-sm"
                        v-model="po.supplier.name"
                        @change="onSupplierInputed"
                      />
                      <div class="input-group-append">
                        <div class="dropdown">
                          <button
                            type="button"
                            class="btn btn-success dropdown-toggle border-0 btn-sm"
                            data-toggle="dropdown"
                            @click="onSupplierDropdown"
                          />
                          <div class="dropdown-menu">
                            <a
                              class="dropdown-item"
                              v-for="(supplier, index) in suppliers"
                              :key="index"
                              @click="onSupplierSelected(supplier)"
                            >
                              {{supplier.data.name}}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="form-group">
                  <octicon
                    name="info"
                    class=""
                  />
                  <label>参考单号：</label>
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    v-model="po.refNo"
                  >
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="col ml-1">
                <div class="form-group">
                  <octicon
                    name="tag"
                    class=""
                  />
                  <label>备注：</label>
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    v-model="po.remark"
                  >
                </div>
              </div>
            </div>
            <div class="d-flex">
              <icon-button
                class="ml-1"
                icon="circle-slash"
                text="取消"
                @click="cancel"
              />
              <icon-button
                class="ml-1"
                width="100px"
                icon="database"
                text="保存"
                @click="save"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { createQueryString } from '../../finelets/helpers/QueryHelper.js'
export default {
  data () {
    return {
      po: {
        code: null,
        part: { name: null },
        createDate: null,
        qty: null,
        price: null,
        amount: null,
        supplier: { name: null },
        refNo: null,
        remark: null
      },
      poPart: null,
      poSupplier: null,
      parts: [],
      suppliers: [],
      errors: {}
    }
  },
  async created () {
  },

  computed: {
  },
  methods: {
    async onPartDropdown () {
      const cond = { search: this.po.part.name, filters: [] }
      let r = createQueryString([], cond)
      let data = await this.$store.dispatch('searchParts', r)
      this.parts = data
    },
    onPartSelected (selected) {
      this.poPart = selected
      this.po.part = selected.data
    },

    async onPartInputed () {
      const cond = { search: this.po.part.name, filters: [] }
      let r = createQueryString([], cond)
      let data = await this.$store.dispatch('searchParts', r)
      if (data.length === 1) {
        this.po.part = data[0].data
      } else {
        this.po.part = { name: this.po.part.name }
      }
    },

    async onSupplierDropdown () {
      const cond = { search: this.po.supplier.name, filters: [] }
      let r = createQueryString([], cond)
      let data = await this.$store.dispatch('searchSuppliers', r)
      this.suppliers = data
    },

    onSupplierSelected (selected) {
      this.poSupplier = selected
      this.po.supplier = selected.data
    },

    async onSupplierInputed () {
      const cond = { search: this.po.supplier.name, filters: [] }
      let r = createQueryString([], cond)
      let data = await this.$store.dispatch('searchSuppliers', r)
      if (data.length === 1) {
        this.po.supplier = data[0].data
      } else {
        this.po.supplier = { name: this.po.supplier.name }
      }
    },

    cancel () {
      this.$router.back()
    },

    async save () {
      this.errors = {}
      if (!this.po.code) this.errors.code = '必须输入采购单号'
      if (!this.po.part.id) this.errors.part = '必须输入料品'
      if (!this.po.createDate) this.errors.createDate = '必须输入申请日期'
      if (!this.po.qty) this.errors.qty = '必须输入采购数量'
      else if (this.po.qty <= 0) this.errors.qty = '采购数量必须大于零'
      if (!this.po.amount) this.errors.amount = '必须输入采购金额'
      else if (this.po.amount <= 0) this.errors.amount = '采购金额必须大于零'
      if (!this.po.supplier.id) this.errors.supplier = '必须输入供应商'
      if (
        this.errors.part ||
        this.errors.supplier ||
        this.errors.createDate ||
        this.errors.qty ||
        this.errors.amount
      ) { return }

      let part = this.po.part.id
      this.$store.commit('selected', {key: 'Part', val: this.poPart})
      let supplier = this.po.supplier.id
      this.$store.commit('selected', {key: 'Supplier', val: this.poSupplier})
      
      let toCreate = {
        ...this.po,
        part,
        supplier,
        applier: this.$store.getters.user.id
      }
      try {
        await this.$store.dispatch('createPurchase', toCreate)
        this.$router.back()
      } catch (e) {}
    }
  }
}
</script>

<style>
.Subhead-heading {
  flex: 1 1 auto;
  font-size: 24px;
  font-weight: 400;
}
</style>
