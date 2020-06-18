<template>
  <div class="mx-auto w-75">
    <div class="row mt-4 justify-content-center">
      <div class="col-3">
          <img class="bg-dark" src="/src/static/img/JSM2-2.jpg" style="width:100%"/>
      </div>
      <div class="col-9">
        <div class="d-flex align-items-baseline">
           <h2 class="Subhead-heading">客户需求</h2>
        </div>
        <form class="border-top" novalidate="true" @submit.prevent>
          <div class="mt-3">
            <p v-if="errors.length">
              <b>Please correct the following error(s):</b>
              <ul>
                <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
              </ul>
            </p>
            <div class="form-row">
              <div class="col-8">
                <div class="form-group w-100">
                  <octicon
                    name="organization"
                    class=""
                  />
                  <label>客户：
                    <validate-error :text="errors.supplier" />
                  </label>
                  <div class="d-flex align-items-baseline">
                    <div class="input-group mb-3 mr-auto">
                      <input
                        type="text"
                        class="form-control form-control-sm"
                        v-model="doc.customer.name"
                        @change="onCustomerInputed"
                      />
                      <div class="input-group-append">
                        <div class="dropdown">
                          <button
                            type="button"
                            class="btn btn-success dropdown-toggle border-0 btn-sm"
                            data-toggle="dropdown"
                            @click="onCustomerDropdown"
                          />
                          <div class="dropdown-menu">
                            <a
                              class="dropdown-item"
                              v-for="(customer, index) in customers"
                              :key="index"
                              @click="onCustomerSelected(customer)"
                            >
                              {{customer.data.name}}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                    v-model="doc.date"
                  >
                </div>
              </div>
            </div>
            <div class="form-row mt-4">
              <div class="col ml-1">
                  <div class="form-group">
                    <octicon name="location" class=""/>
                    <label>需求：</label>
                    <form-text-area rows="7" v-model="doc.requirement"/>
                  </div>
              </div>
            </div>
            <div class="d-flex mt-3">
              <icon-button class="ml-1" icon="circle-slash" text="取消" @click="cancel"/>
              <icon-button class="ml-1" width="100px" icon="database" text="保存" @click="save"/>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {createQueryString} from '../../../finelets/helpers/QueryHelper.js'

export default {
  data () {
    return {
      doc: {
        date: null,
        requirement: null,
        customer: { name: null }
      },
      customers: [],
      errors: {}
    }
  },
  methods: {
    async onCustomerDropdown () {
      const cond = { search: this.doc.customer.name, filters: [] }
      let r = createQueryString([], cond)
      const data = await this.$store.dispatch('searchCustomers', r)
      this.customers = data
    },

    onCustomerSelected (selected) {
      this.docCustomer = selected
      this.doc.customer = selected.data
    },

    async onCustomerInputed () {
      const cond = { search: this.doc.customer.name, filters: [] }
      let r = createQueryString([], cond)
      let data = await this.$store.dispatch('searchCustomers', r)
      if (data.length === 1) {
        this.doc.customer = data[0].data
      } else {
        this.doc.customer = { name: this.doc.customer.name }
      }
    },

    async cancel () {
      setTimeout(() => {
        this.$router.back()
      })
    },

    async save () {
      const state = this.$store
      this.errors = {}
      if (!this.doc.code) this.errors.code = '必须输入编号，且编号必须唯一'
      if (!this.doc.name) this.errors.name = '必须输入工厂名称'
      if (this.errors.code || this.errors.name) return

      let toCreate = {
        ...this.doc,
        creator: state.getters.user.id
      }
      try {
        await state.dispatch('createSupplier', toCreate)
        this.$router.back()
      } catch (e) {
      }
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
