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
        <b-tabs v-if="solution">
          <b-tab title="产品方案" active>
            <div class="d-flex flex-column border p-3">
              <div class="row">
                <div class="col-4">
                  <div class="d-inline-flex">
                    <p class>日期：</p>
                    <p class="font-weight-light font-italic">{{solution.data.date | onlyDate}}</p>
                  </div>
                </div>
                <div class="col">
                  <div class="d-inline-flex">
                    <p class>名称：</p>
                    <p class="font-weight-light font-italic">{{solution.data.title}}</p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-4">
                  <div class="d-inline-flex">
                    <p class>数量：</p>
                    <p class="font-weight-light font-italic">{{solution.data.qty}}</p>
                  </div>
                </div>
                <div class="col-4">
                  <div class="d-inline-flex">
                    <p class>标签：</p>
                    <p class="font-weight-light font-italic">{{solution.data.tags}}</p>
                  </div>
                </div>
                <div class="col">
                  <div class="d-inline-flex">
                    <p class>创建人：</p>
                    <p class="font-weight-light font-italic">{{solution.creator.data.name}}</p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="d-flex flex-column">
                    <p>描述：</p>
                    <div
                      v-html="markdown(solution.data.desc)"
                      class="border"
                      style="height:300px;overflow: scroll;"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </b-tab>
          <b-tab title="客户需求">
            <div class="d-flex flex-column border p-3">
              <div class="row">
                <div class="col-4">
                  <div class="d-inline-flex">
                    <p class>编号：</p>
                    <p
                      class="font-weight-light font-italic"
                    >{{solution.customerRequirement.customer.data.code}}</p>
                  </div>
                </div>
                <div class="col">
                  <div class="d-inline-flex">
                    <p class>名称：</p>
                    <p
                      class="font-weight-light font-italic"
                    >{{solution.customerRequirement.customer.data.name}}</p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-4">
                  <div class="d-inline-flex">
                    <p class>需求日期：</p>
                    <p
                      class="font-weight-light font-italic"
                    >{{solution.customerRequirement.data.date | onlyDate}}</p>
                  </div>
                </div>
                <div class="col">
                  <div class="d-inline-flex">
                    <p class>创建人：</p>
                    <p
                      class="font-weight-light font-italic"
                    >{{solution.customerRequirement.creator.data.name}}</p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="d-inline-flex">
                    <p class>标题：</p>
                    <p
                      class="font-weight-light font-italic"
                    >{{solution.customerRequirement.data.title}}</p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="d-flex flex-column">
                    <p>描述：</p>
                    <div
                      v-html="markdown(solution.customerRequirement.data.requirement)"
                      class="border"
                      style="height:300px;overflow: scroll;"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </b-tab>
          <b-tab title="目标产品">
            <div class="d-flex flex-column border p-3">
              <div class="row">
                <div class="col-4">
                  <div class="d-inline-flex">
                    <p class>编号：</p>
                    <p class="font-weight-light font-italic">{{solution.product.data.code}}</p>
                  </div>
                </div>
                <div class="col">
                  <div class="d-inline-flex">
                    <p class>名称：</p>
                    <p class="font-weight-light font-italic">{{solution.product.data.desc}}</p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="d-inline-flex">
                    <p class>成分：</p>
                    <p class="font-weight-light font-italic">{{solution.product.data.content}}</p>
                  </div>
                </div>
                <div class="col">
                  <div class="d-inline-flex">
                    <p class>组织：</p>
                    <p class="font-weight-light font-italic">{{solution.product.data.constructure}}</p>
                  </div>
                </div>
                <div class="col-5">
                  <div class="d-inline-flex">
                    <p class>纱支：</p>
                    <p class="font-weight-light font-italic">{{solution.product.data.yarn}}</p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <div class="d-inline-flex">
                    <p class>密度：</p>
                    <p class="font-weight-light font-italic">{{solution.product.data.spec.dnsty}}</p>
                  </div>
                </div>
                <div class="col">
                  <div class="d-inline-flex">
                    <p class>门幅：</p>
                    <p class="font-weight-light font-italic">{{solution.product.data.spec.width}}</p>
                  </div>
                </div>
                <div class="col">
                  <div class="d-inline-flex">
                    <p class>克重：</p>
                    <p class="font-weight-light font-italic">{{solution.product.data.spec.GSM}}</p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <div class="d-inline-flex">
                    <p class>坯布密度：</p>
                    <p class="font-weight-light font-italic">{{solution.product.data.grey.dnsty}}</p>
                  </div>
                </div>
                <div class="col">
                  <div class="d-inline-flex">
                    <p class>坯布门幅：</p>
                    <p class="font-weight-light font-italic">{{solution.product.data.grey.width}}</p>
                  </div>
                </div>
                <div class="col">
                  <div class="d-inline-flex">
                    <p class>坯布克重：</p>
                    <p class="font-weight-light font-italic">{{solution.product.data.grey.GSM}}</p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="d-inline-flex">
                    <p class>标签：</p>
                    <p class="font-weight-light font-italic">{{solution.product.data.tags}}</p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="d-inline-flex">
                    <p class>备注：</p>
                    <p class="font-weight-light font-italic">{{solution.product.data.remark}}</p>
                  </div>
                </div>
              </div>
            </div>
          </b-tab>
        </b-tabs>
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
                  <h6 class="ml-2">{{typeOfPart(data.item.part.data.type)}}</h6>

                  <octicon name="note" class="mt-1 ml-auto" size="16" style="color:green" />
                  <h6
                    class="text-primary ml-2 selectable"
                    @click="navToProductChainPart(data.item)"
                  >{{data.item.part.data.name}}</h6>
                </div>
                <div class="d-flex">
                  <b-icon
                    v-if="data.item.data.price"
                    icon="plus-circle"
                    class="mt-1"
                    size="16"
                    style="color:green"
                  />
                  <h6 class="ml-2">{{data.item.data.price}}</h6>
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
import MasterDetails from "../../../finelets/components/MasterDetails/MasterDetails.vue";
import FiltersForm from "../../../finelets/components/FiltersForm.vue";
import ItemList from "../../../finelets/components/ItemList.vue";
import marked from "marked";

const ROUTE_NAME = "masterProductChain";

export default {
  components: {
    MasterDetails,
    FiltersForm,
    ItemList
  },
  data() {
    return {
      currentTab: null,
      master: {},
      solution: null,
      parts: []
    };
  },
  computed: {
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
          title: "详情"
        },
        {
          id: "parts",
          title: "原料/工序"
        }
      ];
    }
  },
  async created() {
    await this.loadMaster()
    let tab = this.$store.getters.currentPage(ROUTE_NAME)
    tab = tab || "overview"
    this.currentTab = tab
    await this.loadPageData(tab)
  },

  methods: {
    typeOfPart(type) {
      const typeMap = {
        material: "原料",
        process: "工序"
      };
      return typeMap[type];
    },

    markdown(data = "") {
      return marked(data);
    },

    async loadMaster() {
      const store = this.$store;
      let entity = store.getters.selected("ProductChain");
      entity = await store.dispatch("getProductChain", entity.links.self);
      store.commit("selected", { key: "ProductChain", val: entity });
      this.master = {
        editable: false,
        avatar: "/src/static/img/suixi.jpg",
        title: entity.data.title,
        subtitle: entity.product.data.desc
      };
      this.solution = entity;
    },

    async onSearchParts(cond) {
      const url = this.$store.getters.selected("ProductChain").links.parts;
      this.parts = await this.$store.dispatch("searchProductChainParts", url);
    },

    async loadPageData(page) {
      const loaders = {
        parts: this.onSearchParts
      };
      const func = loaders[page];
      if (!func) return;
      await func({ search: "", filters: [] });
    },

    async onPageChanged(page) {
      this.$store.commit("currentPage", { route: ROUTE_NAME, page });
      await this.loadPageData(page);
    },

    onCreatePart() {
      this.$store.commit("selected", { key: "ProductChainPart" });
      let path = {
        name: "productChainPartForm"
      };
      this.$router.push(path);
    },

    navToProductChainPart(data) {
      this.$store.commit("selected", { key: "ProductChainPart", val: data });
      let path = {
        name: "masterProductChainPart"
      };
      this.$router.push(path);
    }
  }
};
</script>
