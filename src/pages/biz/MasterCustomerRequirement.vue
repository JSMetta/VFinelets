<template>
  <master-details :master="master">
    <tabpage
      class="col-9"
      :tabs="tabs"
      :activated="currentTab"
      slot="details"
      @changed="onPageChanged"
    >
      <div slot="overview">
        <div class="d-flex flex-column" style="font-size:15px">
          <div class="d-flex flex-column mt-3">
            <div class="d-flex">
              <p>客户：</p>
              <p>{{master.entity.customer.data.code}}</p>
              <p class="ml-auto">{{master.entity.customer.data.name}}</p>
            </div>
            <div class="d-flex">
              <p>地址：</p>
              <p>{{master.entity.customer.data.address}}</p>
            </div>
            <div class="d-flex">
              <p>需求：</p>
            </div>
            <div class="d-flex">
              <div v-html="markdown" class="border  w-100" style="height:300px;overflow: scroll;"></div>
            </div>
            <div class="d-flex justify-content-end">
              <p>需求日期：</p>
              <p>{{master.data.requirementDate}}</p>
            </div>
          </div>
          <!-- <div class="w-100">
            <form-text-area rows="15" label="描述：" readonly  v-model="markdown"/>
            <div v-html="markdown" class="border" style="height:157px"></div>
          </div>-->
        </div>
      </div>
      <div slot="productChains">
        <filters-form
          :config="filters"
          class="my-2"
          @search="onSearchProductChains"
          @action="onCreateProductChain"
        />
        <item-list :items="productChains">
          <template slot-scope="data">
            <div class="row border-0 p-2">
              <div class="col">
                <div class="d-flex">
                  <octicon name="note" class="mt-1" size="16" style="color:green" />
                  <h6
                    class="text-primary ml-2 selectable"
                    @click="navToProductChain(data.item)"
                  >{{data.item.data.desc}}</h6>
                  <b-icon icon="puzzle" class="mt-1 ml-auto" size="16" style="color:green"></b-icon>
                  <h6
                    class="text-primary ml-2 selectable"
                    @click="navToProduct(data.item.product)"
                  >{{data.item.product.data.desc}}</h6>
                </div>
                <div class="d-flex">
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
import util from "../../../finelets/helpers/util.js"
import marked from "marked"

const ROUTE_NAME = "masterCustomerRequirement"

export default {
  components: {
    MasterDetails,
    FiltersForm,
    ItemList
  },
  data() {
    return {
      currentTab: null,
      productChains: []
    };
  },
  computed: {
    master() {
      const entity = this.$store.getters.selected("CustomerRequirement");
      entity.data.requirementDate = util.dateFormat(entity.data.date);
      return {
        editable: false,
        avatar: "/src/static/img/suixi.jpg",
        title: "客户需求",
        items: [],
        data: entity.data,
        entity,
        update: this.onSaveMaster
      };
    },
    filters() {
      return {
        search: { width: 400 },
        cmdButton: { text: "新增" }
      };
    },
    tabs() {
      return [
        {
          id: "overview",
          title: "内容"
        },
        {
          id: "productChains",
          title: "方案"
        }
      ];
    },
    markdown() {
      const entity = this.$store.getters.selected("CustomerRequirement");
      return marked(entity.data.requirement);
    }
  },
  async created() {
    let tab = this.$store.getters.currentPage(ROUTE_NAME);
    tab = tab || "overview";
    this.currentTab = tab;
    await this.loadPageData(tab);
  },

  methods: {
    async onSearchProductChains(cond) {
      const url = this.$store.getters.selected("CustomerRequirement").links
        .productChains;
      this.productChains = await this.$store.dispatch(
        "searchProductChains",
        url
      );
    },

    async onSaveMaster(data) {},
    async loadPageData(page) {
      const loaders = {
        productChains: this.onSearchProductChains
      };
      const func = loaders[page];
      if (!func) return;
      await func({ search: "", filters: [] });
    },

    async onPageChanged(page) {
      this.$store.commit("currentPage", { route: ROUTE_NAME, page });
      await this.loadPageData(page);
    },

    onCreateProductChain() {
      this.$store.commit("selected", { key: "ProductChain" });
      let path = {
        name: "productChainForm"
      };
      this.$router.push(path);
    },

    navToProductChain(data) {
      this.$store.commit("selected", { key: "ProductChain", val: data });
      let path = {
        name: "masterProductChain"
      };
      this.$router.push(path);
    },

    navToProduct(data) {
      this.$store.commit("selected", { key: "Product", val: data });
      let path = {
        name: "masterProduct"
      };
      this.$router.push(path);
    }
  }
};
</script>
