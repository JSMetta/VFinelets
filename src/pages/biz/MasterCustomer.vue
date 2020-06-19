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
        <h1>Welcome to our support center 1.0.1</h1>
        <p>Here we will list all indexed about current part!</p>
      </div>
      <div slot="requirements">
        <filters-form
          :config="requirementFilters"
          class="my-2"
          @search="onSearchRequirements"
          @action="onCreateRequirement"
        />
        <item-list :items="requirements">
          <template slot-scope="data">
            <div class="row border-0 p-2">
              <div class="col">
                <div class="d-flex align-self-center">
                  <octicon name="note" class="mt-1" size="16" style="color:green" />
                  <h6
                    class="text-primary ml-2 selectable"
                    @click="navToRequirement(data.item)"
                  >{{data.item.data.date | onlyDate}}</h6>
                  <b-avatar button icon="pencil-square" variant="success" class="ml-auto" size="1.5em" 
                      @click="onEditRequirement(data.item)"></b-avatar>
                </div>
                <div class="d-flex">
                  <octicon
                    name="milestone"
                    class="mt-1"
                    size="16"
                    style="color:green"
                  />
                  <h6 class="ml-2" style="overflow: hidden; text-overflow: ellipsis;">
                    {{data.item.data.title || data.item.data.requirement}}
                  </h6>
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
import marked from "marked"

const ROUTE_NAME = "masterCustomer"

export default {
  components: {
    MasterDetails,
    FiltersForm,
    ItemList
  },
  data() {
    return {
      currentTab: null,
      requirements: []
    };
  },
  computed: {
    master() {
      const customer = this.$store.getters.selected('Customer')
      return {
        editable: true,
        avatar: "/src/static/img/suixi.jpg",
        title: customer.data.code,
        subtitle: customer.data.name,
        items: [
          {
            name: "code",
            icon: "shield"
          },
          {
            name: "name",
            icon: "note"
          },
          {
            name: "address",
            icon: "milestone"
          },
          {
            name: "link",
            icon: "primitive-dot"
          },
          {
            name: "tags",
            icon: "tag"
          }
        ],
        data: customer.data,
        update: this.onSaveMaster
      }
    },
    requirementFilters() {
      return {
        search: { width: 400 },
        cmdButton: { text: "新增" }
      }
    },
    tabs() {
      return [
        {
          id: "overview",
          title: "概要"
        },
        {
          id: "requirements",
          title: "客户需求"
        }
      ]
    },
  },

  async created() {
    let tab = this.$store.getters.currentPage(ROUTE_NAME)
    tab = tab || "overview"
    this.currentTab = tab
    await this.loadPageData(tab)
  },

  methods: {
    async onSearchRequirements(cond) {
      const customer = this.$store.getters.selected('Customer')
      const url = customer.links.requirements
      this.requirements = await this.$store.dispatch("searchRequirements", url)
      for (let i=0; i<this.requirements.length; i++) {
        this.requirements[i].data.md = marked(this.requirements[i].data.requirement)
      }
    },

    async onSaveMaster(data) {
      if (data) {
        data.creator = this.$store.getters.user.id;
        await this.$store.dispatch("updateCustomer", {
          data,
          url: this.$store.getters.selected('Customer').links.self
        })
      }
    },
    async loadPageData(page) {
      const loaders = {
        requirements: this.onSearchRequirements
      }
      const func = loaders[page];
      if (!func) return;
      await func({ search: "", filters: [] });
    },

    async onPageChanged(page) {
      this.$store.commit("currentPage", { route: ROUTE_NAME, page });
      await this.loadPageData(page);
    },

    onCreateRequirement () {
      this.$store.commit('selected', {key: 'CustomerRequirement'})
      let path = {
        name: 'customerRequirementForm'
      }
      this.$router.push(path)
    },

    onEditRequirement (val) {
      this.$store.commit('selected', {key: 'CustomerRequirement', val})
      let path = {
        name: 'customerRequirementForm',
        query: {mode: 'edit'}
      }
      this.$router.push(path)
    },

    navToRequirement (data) {
      this.$store.commit("selected", { key: "CustomerRequirement", val: data })
      let path = {
        name: 'masterCustomerRequirement'
      }
      this.$router.push(path)
    },
  }
}
</script>
