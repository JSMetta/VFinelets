<template>
  <master-details :master="master">
    <tabpage
      class="col-9"
      :tabs="tabs"
      :activated="currentTab"
      slot="details"
      @changed="onPageChanged"
    >
      <div slot="part">
        <b-list-group v-if="productChain" class="mt-4">
          <b-list-group-item>
            <div class="d-flex align-items-center justify-content-between">
              <b-avatar src="/src/static/img/suixi.jpg"></b-avatar>
              <div class="text-primary selectable" style="text-align:center" @click="navTo('Part', master.entity)">
                {{master.subtitle}}
              </div>
              <p class="w-75 mt-3">{{master.title}}</p>
            </div>
          </b-list-group-item>
          <b-list-group-item>
            <div class="d-flex align-items-center justify-content-between">
              <b-avatar src="/src/static/img/suixi.jpg"></b-avatar>
              <div class="text-primary selectable" style="text-align:center" @click="navTo('ProductChain', productChain)">方案</div>
              <div class="d-flex flex-column w-75 mt-2">
                <p>{{productChain.data.desc}}</p>
                <p>{{productChain.data.date | date}}</p>
              </div>
            </div>
          </b-list-group-item>
          <b-list-group-item>
            <div class="d-flex align-items-center justify-content-between">
              <b-avatar src="/src/static/img/suixi.jpg"></b-avatar>
              <div class="text-primary selectable" style="text-align:center" @click="navTo('Product', productChain.product)">产品</div>
              <div class="d-flex flex-column w-75 mt-2">
                <p>{{productChain.product.data.code}}</p>
                <p>{{productChain.product.data.desc}}</p>
              </div>
            </div>
          </b-list-group-item>
          <b-list-group-item>
            <div class="d-flex align-items-center justify-content-between">
              <b-avatar src="/src/static/img/suixi.jpg"></b-avatar>
              <div class="text-primary selectable" style="text-align:center" @click="navTo('Customer', productChain.customerRequirement.customer)">客户</div>
              <div class="d-flex flex-column w-75 mt-2">
                <p>{{productChain.customerRequirement.customer.data.code}}</p>
                <p>{{productChain.customerRequirement.customer.data.name}}</p>
              </div>
            </div>
          </b-list-group-item>
          <b-list-group-item>
            <div class="d-flex align-items-center justify-content-between">
              <b-avatar src="/src/static/img/suixi.jpg"></b-avatar>
              <div class="text-primary selectable" style="text-align:center" @click="navTo('CustomerRequirement', productChain.customerRequirement)">需求</div>
              <p class="w-75 mt-3">{{productChain.customerRequirement.data.requirement}}</p>
            </div>
          </b-list-group-item>
        </b-list-group>
      </div>
      <div slot="quots">
        <filters-form
          :config="filters"
          class="my-2"
          @search="onSearchProductChainPartQuots"
          @action="onCreateQuot"
        />
        <item-list :items="quots">
          <template slot-scope="data">
            <div class="row border-0 p-2">
              <div class="col">
                <div class="d-flex">
                  <b-icon icon="gear" class="mt-1" size="16" style="color:green" />
                  <h6
                    class="text-primary ml-2 selectable"
                    @click="navToSupplier(data.item.quot.supplier)"
                  >{{data.item.quot.supplier.data.name}}</h6>

                  <octicon name="note" class="mt-1 ml-auto" size="16" style="color:green" />
                  <h6 class="ml-2" @click="navToQuot(data.item)">{{data.item.quot.data.type}}</h6>
                </div>
                <div class="d-flex">
                  <b-icon
                    v-if="data.item.quot.data.price"
                    icon="file-post"
                    class="mt-1"
                    size="16"
                    style="color:green"
                  />
                  <h6 class="text-primary ml-2">{{data.item.quot.data.price}}</h6>
                  <h6
                    class="text-secondary ml-auto"
                    style="font-size:10px"
                  >更新于 {{data.item.quot.data.date | date}}</h6>
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

const ROUTE_NAME = "masterProductChainPart"

export default {
  components: {
    MasterDetails,
    FiltersForm,
    ItemList
  },
  data() {
    
    return {
      currentTab: null,
      quots: [],
      productChain: null
    };
  },
  computed: {
    master() {
      const entity = this.$store.getters.selected("ProductChainPart");
      return {
        editable: false,
        avatar: "/src/static/img/suixi.jpg",
        title: entity.part.data.name,
        subtitle: this.typeOfPart(entity.part.data.type),
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
          id: "part",
          title: "原料/工序"
        },
        {
          id: "quots",
          title: "报价"
        }
      ];
    }
  },
  async created() {
    let tab = this.$store.getters.currentPage(ROUTE_NAME)
    tab = tab || "part"
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

    async onSearchProductChainPartQuots(cond) {
      const url = this.master.entity.links.quots;
      const quots = await this.$store.dispatch(
        "searchProductChainPartQuots",
        url
      );
      for (let i = 0; i < quots.length; i++) {
        const supplier = await this.$store.dispatch(
          "getSupplier",
          quots[i].quot.links.supplier
        );
        quots[i].quot.supplier = supplier;
      }
      this.quots = quots;
    },

    async loadPartContent() {
      // if (this.productChain) return
      const productChain = await this.$store.dispatch(
        "getProductChain",
        this.master.entity.links.productChain
      )
      const customer = await this.$store.dispatch(
        "getCustomer",
        productChain.customerRequirement.links.customer
      )
      productChain.customerRequirement.customer = customer;
      this.productChain = productChain;
    },

    async onSaveMaster(data) {},

    async loadPageData(page) {
      const loaders = {
        part: this.loadPartContent,
        quots: this.onSearchProductChainPartQuots
      };
      const func = loaders[page];
      if (!func) return;
      await func({ search: "", filters: [] });
    },

    async onPageChanged(page) {
      this.$store.commit("currentPage", { route: ROUTE_NAME, page });
      await this.loadPageData(page);
    },

    onCreateQuot() {
      this.$store.commit("selected", { key: "Quot" });
      let path = {
        name: "quotForm"
      };
      this.$router.push(path);
    },

    navToSupplier(data) {
      this.navTo('Supplier', data)
    },

    navTo (type, val) {
      const key = type
      const pathName = `master${key}`
      this.$store.commit("selected", { key, val })
      let path = {
        name: pathName
      }
      this.$router.push(path)
    }
  }
};
</script>
