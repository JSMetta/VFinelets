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
      <!-- <div slot="requirements">
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
                <div class="d-flex">
                  <octicon name="note" class="mt-1" size="16" style="color:green" />
                  <h6
                    class="text-primary ml-2 selectable"
                    @click="navToRequirement(data.item)"
                  >{{data.item.data.date | date}}</h6>
                </div>
                <div class="d-flex">
                  <octicon
                    v-if="data.item.data.requirement"
                    name="milestone"
                    class="mt-1"
                    size="16"
                    style="color:green"
                  />
                  <h6 class="ml-2">{{data.item.data.requirement}}</h6>
                </div>
                <div class="d-flex">
                  <octicon
                    v-if="data.item.creator"
                    name="person"
                    class
                    size="16"
                    style="color:green"
                  />
                  <h6
                    v-if="data.item.creator"
                    class="ml-1"
                    style="font-size:10px"
                  >{{data.item.creator.data.name}}</h6>
                  <h6
                    class="text-secondary ml-auto"
                    style="font-size:10px"
                  >更新于 {{data.item.data.updatedAt | date}}</h6>
                </div>
              </div>
            </div>
          </template>
        </item-list>
      </div> -->
    </tabpage>
  </master-details>
</template>

<script>
import MasterDetails from "../../../finelets/components/MasterDetails/MasterDetails.vue"
import FiltersForm from "../../../finelets/components/FiltersForm.vue"
import ItemList from "../../../finelets/components/ItemList.vue"

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
      const entity = this.$store.getters.selectedCustomerRequirement
      const date = new Date(entity.data.date)
      entity.data.dateStr = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`
      return {
        editable: true,
        avatar: "/src/static/img/suixi.jpg",
        title: "客户需求",
        subtitle: entity.customer.data.name,
        items: [
          {
            name: "dateStr",
            editable: false,
            icon: "shield"
          },
          {
            name: "requirement",
            editable: false,
            icon: "note"
          }
        ],
        data: entity.data,
        update: this.onSaveMaster
      };
    },
    requirementFilters() {
      return {
        search: { width: 400 },
        cmdButton: { text: "新增" }
      };
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
      ];
    }
  },
  async created() {
    let tab = this.$store.getters.currentPage(ROUTE_NAME);
    tab = tab || "overview";
    this.currentTab = tab;
    await this.loadPageData(tab);
  },

  methods: {
    async onSearchRequirements(cond) {
      const url = this.$store.getters.selectedCustomer.links.requirements
      this.requirements = await this.$store.dispatch("searchRequirements", url);
    },

    async onSaveMaster(data) {
      if (data) {
        data.creator = this.$store.getters.user.id;
        await this.$store.dispatch("updateCustomer", {
          data,
          links: this.$store.getters.selectedCustomer.links
        });
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
      this.$store.commit('selectedRequirement')
      let path = {
        name: 'requirementForm'
      }
      this.$router.push(path)
    },

    navToRequirement (data) {
      this.$store.commit('selectedCustomerRequirement', data)
      let path = {
        name: 'masterCustomerRequirement'
      }
      this.$router.push(path)
    },
  }
}
</script>
