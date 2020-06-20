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
            <div class="form-row">
              <div class="col-8">
                <div class="form-group w-100">
                  <octicon
                    name="organization"
                    class=""
                  />
                  <label>客户：
                    <validate-error :text="errors.customer" />
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
              <div class="col ml-1">
                <div class="form-group">
                  <octicon
                    name="calendar"
                    class=""
                  />
                  <label>日期：<validate-error :text="errors.date" /></label>
                  <input
                    type="date"
                    class="form-control form-control-sm"
                    v-model="doc.date"
                  >
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="col ml-1">
                  <div class="form-group">
                    <octicon name="shield" class=""/>
                    <label>标题：<validate-error :text="errors.title"/></label>
                    <input type="text" class="form-control form-control-sm" v-model="doc.title">
                  </div>
              </div>
            </div>
            <div class="form-row mt-4">
              <div class="col ml-1">
                  <div class="form-group">
                    <label><validate-error :text="errors.requirement"/></label>
                    <b-tabs active-nav-item-class="font-weight-bold">
                      <b-tab title="需求" active>
                        <form-text-area rows="7" v-model="doc.requirement"/>
                      </b-tab>
                      <b-tab title="预览">
                        <div v-html="markdown" class="border" style="height:157px"></div>
                      </b-tab>
                    </b-tabs>
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
import marked from 'marked'
import util from '../../../finelets/helpers/util.js'
import _ from 'lodash'

export default {
  data () {
    return {
      doc: {
        date: null,
        title: null,
        requirement: '',
        customer: { name: null }
      },
      customers: [],
      docCustomer: null,
      errors: {}
    }
  },
  async created () {
    this.$route.query.mode == 'edit' ? this.editMode() : this.createMode()
  },

  computed: {
    markdown: function () {
      return this.doc.requirement ? marked(this.doc.requirement) : null
    }
  },
  methods: {
    createMode () {
      const customer = this.$store.getters.selected('Customer')
      if (customer) {
        this.docCustomer = customer
        this.doc.customer.name = customer.data.name
      }
      this.doc.date = util.dateFormat(new Date())
    },

    editMode () {
      const cr = this.$store.getters.selected('CustomerRequirement')
      this.doc = {
        ...cr.data,
        date: util.dateFormat(new Date(cr.data.date)),
        customer: {name: cr.customer.data.name}
      }
      this.docCustomer = cr.customer
    },

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
      const state = this.$storerequirement
      this.errors = {}
      if (!this.doc.customer.name || !this.docCustomer) this.errors.customer = '必须输入客户'
      if (!this.doc.date) this.errors.date = '必须输入需求日期'
      if (!this.doc.title) this.errors.title = '必须输入标题'
      if (!this.doc.requirement) this.errors.requirement = '必须输入客户需求'
      if (!_.isEqual(this.errors, {})) return

      try {
        if (this.$route.query.mode == 'edit') {
          await this.$store.dispatch('updateCustomerRequirement', 
            {
              url: this.$store.getters.selected('CustomerRequirement').links.self,
              data: { ...this.doc, customer: this.docCustomer.data.id, creator: this.$store.getters.user.id}
            })
        } else {
            await this.$store.dispatch('createResource', 
            {
              url: this.docCustomer.links.requirements,
              data: { ...this.doc, creator: this.$store.getters.user.id}
            })
        }
        
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
