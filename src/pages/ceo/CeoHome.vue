<template>
  <master-details  :master="master">
    <tabpage class="col-9" :tabs="tabs" :activated="currentTab" slot="details" @changed="onPageChanged">
      <div slot="parts">
        <filters-form :config="partFilters" class="my-2" @search="onSearchParts"/>
        <item-list :items="parts">
          <template slot-scope="part">
            <div class="row border-0 p-2">
              <div class="col">
                <h6 class="font-weight-bold">{{part.item.data.code}}</h6>
                <div class="d-flex">
                  <octicon name="note" class="mt-1 mr-1" size="16" style="color:green"/>
                  <h6 class="text-primary mb-1 selectable" @click="navToPart(part.item)">
                    {{part.item.data.name}}
                  </h6>
                  <octicon v-if="part.item.data.qty" name="database" class="mt-1 ml-5" size="16" style="color:green"/>
                  <h6 class="text-primary mb-1 ml-1 mr-auto">
                    {{part.item.data.qty}}
                  </h6>
                  <octicon v-if="part.item.data.brand" name="bookmark" class="mt-1 mr-1" size="16" style="color:green"/>
                  <h6 class="font-weight-bolder">{{part.item.data.brand}}</h6>
                  <octicon v-if="part.item.data.spec" name="eye" class="mt-1 mr-1 ml-3" size="16" style="color:green"/>
                  <h6 class="font-weight-bolder">{{part.item.data.spec}}</h6>
                </div>
                <div class="d-flex">
                  <octicon name="primitive-dot" scale="1.1" style="color:yellow"/>
                  <h6 class="ml-1" style="font-size:10px">{{partTypes(part.item.data.type)}}</h6>
                  <octicon v-if="part.item.data.tags" name="tag" class="ml-3" size="16" style="color:green"/>
                  <h6 class="ml-1 mr-auto" style="font-size:10px">{{part.item.data.tags}}</h6>
                  <h6 class="text-secondary" style="font-size:10px">
                    更新于 {{part.item.data.modifiedDate | date }}
                  </h6>
                </div>
              </div>
            </div>
          </template>
        </item-list>
      </div>
      <div slot="suppliers">
        <filters-form :config="supplierFilters" class="my-2" @search="onSearchSuppliers"/>
        <item-list :items="suppliers">
          <template slot-scope="data">
            <div class="row border-0 p-2">
              <div class="col">
                <h6 class="font-weight-bold">{{data.item.data.code}}</h6>
                <div class="d-flex">
                  <h6
                    class="text-primary mb-1 selectable"
                    @click="navToSupplier(data.item)"
                  >{{data.item.data.name}}</h6>
                </div>
                <div class="d-flex">
                  <h6 class="mb-1">{{data.item.data.address}}</h6>
                </div>
                <div class="d-flex">
                  <octicon
                    name="primitive-dot"
                    scale="1.1"
                    style="color:yellow"
                  ></octicon>
                  <h6
                    class="ml-1"
                    style="font-size:10px"
                  >{{supplierTypes(data.item.data.type)}}</h6>
                  <octicon
                    v-if="data.item.data.tags"
                    name="tag"
                    class="ml-3"
                    size="16"
                    style="color:green"
                  />
                  <h6
                    class="ml-1 mr-auto"
                    style="font-size:10px"
                  >{{data.item.data.tags}}</h6>
                  <h6
                    class="text-secondary"
                    style="font-size:10px"
                  >更新于 {{data.item.data.modifiedDate | relativeDate}}</h6>
                </div>
              </div>
            </div>
          </template>
        </item-list>
      </div>
      <div slot="purchases">
        <filters-form :config="purchaseFilters" class="my-2" @search="onSearchPurchases"/>
        <item-list :items="purchases">
          <template slot-scope="po">
            <div class="row border-0 p-2">
              <div class="col">
                <div class="d-flex">
                  <h6
                    class="text-primary mb-1 mr-auto selectable"
                    @click="navToPurchase(po.item)"
                  >
                    <octicon
                      :name="findIcon(po.item.data.state)"
                      scale="1"
                      style="color:green"
                    />
                    {{po.item.data.code}}
                  </h6>
                  <h6
                    class="text-primary font-weight-bolder selectable"
                    @click="navToSupplier(po.item.supplier)"
                  >{{po.item.supplier.data.name}}</h6>
                </div>
                <div class="d-flex mt-1">
                  <h6
                    class="text-primary mb-1 mr-auto selectable"
                    @click="navToPart(po.item.part)"
                  >{{po.item.part.data.name}}</h6>
                  <octicon
                    v-if="po.item.part.data.brand"
                    name="bookmark"
                    class="mt-1 mr-1"
                    size="16"
                    style="color:green"
                  />
                  <h6 class="font-weight-bolder">{{po.item.part.data.brand}}</h6>
                  <octicon
                    v-if="po.item.part.data.spec"
                    name="eye"
                    class="mt-1 mr-1 ml-3"
                    size="16"
                    style="color:green"
                  />
                  <h6 class="font-weight-bolder">{{po.item.part.data.spec}}</h6>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="ml-1">单价：{{po.item.data.price}}</span>
                  <span class="ml-1">数量：{{po.item.data.qty}}</span>
                  <span class="ml-1">金额: {{po.item.data.amount}}</span>
                  <span
                    class=""
                    style="width:100px"
                  >
                    <div
                      class="progress mt-2"
                      style="height:10px"
                    >
                      <div
                        class="progress-bar bg-success"
                        :class="poProgress(po.item.data).color"
                        :style="poProgress(po.item.data).progress"
                      ></div>
                    </div>
                  </span>
                </div>
                <div class="d-flex mt-3">
                  <span
                    v-if="po.item.data.refNo"
                    class=""
                    style="font-size:10px"
                  >
                    <octicon
                      name="pin"
                      scale="1"
                      style="color:yellow"
                    />{{po.item.data.refNo}}</span>
                  <octicon
                    v-if="po.item.data.remark"
                    name="tag"
                    class="ml-3 mt-1"
                    size="16"
                    style="color:green"
                  />
                  <h6
                    class="ml-1 mt-1 mr-auto"
                    style="font-size:10px"
                  >{{po.item.data.remark}}</h6>
                  <octicon
                    name="primitive-dot"
                    scale="1.1"
                    style="color:yellow"
                  />
                  <span
                    class="ml-1"
                    style="font-size:10px"
                  >更新于 {{po.item.data.modifiedDate | date}}</span>
                </div>
              </div>
            </div>
          </template>
        </item-list>
      </div>
    </tabpage>
  </master-details>
</template>

<script>
import {createQueryString, findEnumIcon} from '../../../finelets/helpers/QueryHelper.js'
import typeEnums from '../../helpers/Enums.js'
import partTypes from '../../helpers/PartTypes.js'
import supplierTypes from '../../helpers/SupplierTypes.js'
import MasterDetails from '../../../finelets/components/MasterDetails/MasterDetails.vue'
import FiltersForm from '../../../finelets/components/FiltersForm.vue'
import ItemList from '../../../finelets/components/ItemList.vue'
import {poProgress} from '../../helpers/PurchaseHelper'

const ROUTE_NAME = 'ceoHome'

export default {
  components: {
    MasterDetails,
    FiltersForm,
    ItemList
  },
  data () {
    return {
      currentTab: null,
      parts: [],
      suppliers: [],
      purchases: []
    }
  },
  computed: {
    master () {
      const user = this.$store.getters.user
      const data = {
        editable: true,
        avatar: this.$store.getters.avatar,
        title: null,
        email: null,
        items: [
          {
            name: 'userId',
            icon: 'person'
          },
          {
            name: 'name',
            icon: 'note'
          },
          {
            name: 'email',
            icon: 'mail'
          }
        ],
        data: null,
        update: this.onSaveMaster
      }
      if(user) {
        data.title = user.name
        data.email = user.email
        data.data = { ...user }
      }
      return data
    },
    partFilters () {
      return {
        search: {width: 400},
        filter: {
          label: '类型',
          value: 0,
          options: [
            { name: '未选', value: 0 },
            ...typeEnums.part
          ]
        }
      }
    },
    supplierFilters () {
      return {
        search: {width: 400},
        filter: {
          label: '类型',
          value: 0,
          options: [
            { name: '未选', value: 0 },
            ...typeEnums.supplier
          ]
        }
      }
    },
    purchaseFilters () {
      return {
        search: {width: 400},
        filter: {
          label: '状态',
          value: 0,
          options: [
            { name: '未选', value: 0 },
            ...typeEnums.purchaseState
          ]
        }
      }
    },
    tabs () {
      return [
        {
          id: 'overview',
          title: '概要'
        },
        {
          id: 'parts',
          title: '料品'
        },
        {
          id: 'suppliers',
          title: '供应商'
        },
        {
          id: 'purchases',
          title: '采购单'
        }
      ]
    }
  },
  async created () {
    let tab = this.$store.getters.currentPage(ROUTE_NAME)
    tab = tab || 'parts'
    this.currentTab = tab
    await this.loadPageData(tab)
  },
  methods: {
    partTypes,
    supplierTypes,
    findIcon (state) {
      return findEnumIcon(typeEnums.purchaseState, state)
    },
    poProgress,
    async onSearchParts (cond) {
      let r = createQueryString(['type'], cond)
      this.parts = await this.$store.dispatch('searchParts', r)
    },
    async onSearchSuppliers (cond) {
      let r = createQueryString(['type'], cond)
      this.suppliers = await this.$store.dispatch('searchSuppliers', r)
    },

    async onSearchPurchases (cond) {
      let r = createQueryString(['state'], cond)
      this.purchases = await this.$store.dispatch('searchPurchases', r)
    },

    async loadPageData (page) {
      const loaders = {
        parts: this.onSearchParts,
        suppliers: this.onSearchSuppliers,
        purchases: this.onSearchPurchases
      }
      const func = loaders[page]
      if (!func) return
      await func({search: '', filters: []})
    },

    async onPageChanged (page) {
      this.$store.commit('currentPage', {route: ROUTE_NAME, page})
      await this.loadPageData(page)
    },

    async onSaveMaster (data) {
      this.$store.dispatch('saveUserProfile', data)
    },

    navToPart (part) {
      this.$store.commit('selected', {key: 'Part', val: part})
      let path = {
        name: 'ceoMasterPart'
      }
      this.$router.push(path)
    },

    navToSupplier (data) {
      this.$store.commit('selected', {key: 'Supplier', val: data})
      let path = {
        name: 'ceoMasterSupplier'
      }
      this.$router.push(path)
    },

    navToPurchase (data) {
      this.$store.commit('selected', {key: 'Purchase', val: data})
      let path = {
        name: 'ceoMasterPurchase'
      }
      this.$router.push(path)
    }
  }
}
</script>

<style>
.selectable:hover {
  border-bottom: 2px solid #007bff;
  cursor: pointer;
}
</style>
