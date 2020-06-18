<template>
  <master-details :master="master">
    <tabpage
      class="col-9"
      :tabs="tabs"
      :activated="currentTab"
      slot="details"
      @changed="onPageChanged"
    >
      <div slot="product">
        <div class="d-flex  flex-column" style="font-size:15px">
          <!-- <div class="d-flex flex-column mt-3">
            <div class="d-flex">
              <p>客户：</p>
              <p>{{master.entity.customer.data.code}}</p>
              <p class="ml-auto">{{master.entity.customer.data.name}}</p>
            </div>
            <div class="d-flex">
              <p>地址：</p>
              <p>{{master.entity.customer.data.address}}</p>
            </div>
          </div> 
          <div class="w-100">
            <form-text-area rows="15" label="描述：" readonly v-model="master.data.requirement"/>
          </div> 
          <div class="d-flex justify-content-end">
            <p>需求日期：</p>
            <p>{{this.dateFormat(master.data.date)}}</p>
          </div>  -->
        </div>
      </div>
      <div slot="parts">
        <filters-form
          :config="filters"
          class="my-2"
          @search="onSearchParts"
          @action="onCreatePart"
        />
        <item-list :items="parts">
          <template slot-scope="data">
            <div class="row border-0 p-2">
              <div class="col">
                <div class="d-flex">
                  <b-icon icon="gear" class="mt-1" size="16" style="color:green" />
                  <h6
                    class="ml-2"
                  >{{typeOfPart(data.item.part.data.type)}}</h6>

                  <octicon name="note" class="mt-1 ml-auto" size="16" style="color:green" />
                  <h6
                    class="text-primary ml-2 selectable"
                    @click="navToProductChainPart(data.item)"
                  >{{data.item.part.data.name}}</h6>
                </div>
                <div class="d-flex">
                  <b-icon v-if="data.item.data.price" icon="plus-circle" class="mt-1" size="16" style="color:green" />
                  <h6
                    class="ml-2"
                  >{{data.item.data.price}}</h6>
                  <h6
                    class="text-secondary ml-auto"
                    style="font-size:10px"
                  >更新于 {{data.item.data.updatedAt | date}}</h6>
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
import MasterDetails from "../../../finelets/components/MasterDetails/MasterDetails.vue"
import FiltersForm from "../../../finelets/components/FiltersForm.vue"
import ItemList from "../../../finelets/components/ItemList.vue"

const ROUTE_NAME = "masterProductChain"

export default {
  components: {
    MasterDetails,
    FiltersForm,
    ItemList
  },
  data() {
    return {
      currentTab: null,
      parts: []
    }
  },
  computed: {
    master() {
      const entity = this.$store.getters.selected('ProductChain')
      return {
        editable: false,
        avatar: "/src/static/img/suixi.jpg",
        title: entity.data.desc,
        subtitle: entity.product.data.desc,
        items: [
        ],
        data: entity.data,
        entity,
        update: this.onSaveMaster
      }
    },
    filters() {
      return {
        search: { width: 400 },
        cmdButton: { text: "新增" }
      }
    },
    tabs() {
      return [
        {
          id: "product",
          title: "产品"
        },
        {
          id: "parts",
          title: "原料/工序"
        }
      ]
    }
  },
  async created() {
    let tab = this.$store.getters.currentPage(ROUTE_NAME)
    tab = tab || "product"
    this.currentTab = tab
    await this.loadPageData(tab)
  },

  methods: {
    typeOfPart (type) {
       const typeMap = {
         material: '原料',
         process: '工序'
       }
       return typeMap[type] 
    },
    
    async onSearchParts(cond) {
      const url = this.$store.getters.selected('ProductChain').links.parts
      this.parts = await this.$store.dispatch("searchProductChainParts", url)
    },

    async onSaveMaster(data) {
    },

    async loadPageData(page) {
      const loaders = {
        parts: this.onSearchParts
      }
      const func = loaders[page]
      if (!func) return
      await func({ search: "", filters: [] })
    },

    async onPageChanged(page) {
      this.$store.commit("currentPage", { route: ROUTE_NAME, page });
      await this.loadPageData(page);
    },

    onCreatePart () {
      this.$store.commit('selected', {key: 'ProductChainPart'})
      let path = {
        name: 'productChainPartForm'
      }
      this.$router.push(path)
    },

    navToProductChainPart (data) {
      this.$store.commit("selected", { key: "ProductChainPart", val: data })
      let path = {
        name: 'masterProductChainPart'
      }
      this.$router.push(path)
    }
  }
}
</script>
