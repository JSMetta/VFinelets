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
    </tabpage>
  </master-details>
</template>

<script>
import MasterDetails from "../../../finelets/components/MasterDetails/MasterDetails.vue";
import FiltersForm from "../../../finelets/components/FiltersForm.vue";
import ItemList from "../../../finelets/components/ItemList.vue";
const ROUTE_NAME = "masterCustomer";
export default {
  components: {
    MasterDetails,
    FiltersForm,
    ItemList
  },
  data() {
    return {
      currentTab: null,
      orders: []
    };
  },
  computed: {
    master() {
      const data = this.$store.getters.selectedCustomer.data;
      return {
        editable: true,
        avatar: "/src/static/img/suixi.jpg",
        title: data.code,
        subtitle: data.name,
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
        data,
        update: this.onSaveMaster
      }
    },
    orderFilters() {
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
      const loaders = {};
      const func = loaders[page];
      if (!func) return;
      await func({ search: "", filters: [] });
    },
    async onPageChanged(page) {
      this.$store.commit("currentPage", { route: ROUTE_NAME, page });
      await this.loadPageData(page);
    }
  }
};
</script>
