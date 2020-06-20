<template>
  <div class="mx-auto w-75">
    <div class="row mt-4 justify-content-center">
      <div class="col-3">
        <img class="bg-dark" src="/src/static/img/JSM2-2.jpg" style="width:100%" />
      </div>
      <div class="col-9">
        <div class="d-flex align-items-baseline">
          <h2 class="Subhead-heading">产品方案</h2>
        </div>
        <form class="border-top" novalidate="true" @submit.prevent>
          <div class="mt-3">
            <div
              v-if="docCustomerRequirement && docCustomerRequirement.customer"
              class="d-flex flex-column border p-3 bg-light"
            >
              <p class="font-weight-bold font-italic">本方案将用以满足以下客户需求：</p>
              <div class="d-inline-flex">
                <div class="d-inline-flex">
                  <p class>客户：</p>
                  <p
                    class="font-weight-light font-italic"
                  >{{docCustomerRequirement.customer.data.name}}</p>
                </div>
                <div class="d-inline-flex ml-auto">
                  <p class>日期：</p>
                  <p
                    class="font-weight-light font-italic"
                  >{{docCustomerRequirement.data.date | onlyDate}}</p>
                </div>
              </div>
              <div class="d-inline-flex">
                <p class>需求：</p>
                <p class="font-weight-light font-italic">{{docCustomerRequirement.data.title}}</p>
              </div>
            </div>
            <div class="form-row mt-3">
              <div class="col-4 ml-1">
                <div class="form-group">
                  <octicon name="calendar" />
                  <label>
                    方案日期：
                    <validate-error :text="errors.date" />
                  </label>
                  <input type="date" class="form-control form-control-sm" v-model="doc.date" />
                </div>
              </div>
              <div class="col">
                <div class="form-group w-100">
                  <octicon name="organization" />
                  <label>
                    目标产品：
                    <validate-error :text="errors.product" />
                  </label>
                  <div class="d-flex align-items-baseline">
                    <div v-if="isCreateMode" class="input-group mb-3 mr-auto">
                      <input
                        type="text"
                        class="form-control form-control-sm"
                        v-model="doc.product.desc"
                        @change="onProductInputed"
                      />
                      <div class="input-group-append">
                        <div class="dropdown">
                          <button
                            type="button"
                            class="btn btn-success dropdown-toggle border-0 btn-sm"
                            data-toggle="dropdown"
                            @click="onProductDropdown"
                          />
                          <div class="dropdown-menu">
                            <a
                              class="dropdown-item"
                              v-for="(product, index) in products"
                              :key="index"
                              @click="onProductSelected(product)"
                            >{{product.data.desc}}</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="docProduct" class="input-group mb-3 mr-auto">
                      <input
                        type="text"
                        class="form-control form-control-sm"
                        readonly
                        v-model="docProduct.data.desc"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="col-6 ml-1">
                <div class="form-group">
                  <octicon name="shield" />
                  <label>
                    方案名称：
                    <validate-error :text="errors.title" />
                  </label>
                  <input type="text" class="form-control form-control-sm" v-model="doc.title" />
                </div>
              </div>
              <div class="col-2 ml-1">
                <div class="form-group">
                  <octicon name="shield" />
                  <label>
                    数量：
                    <validate-error :text="errors.qty" />
                  </label>
                  <input type="text" class="form-control form-control-sm" v-model="doc.qty" />
                </div>
              </div>
              <div class="col ml-1">
                <div class="form-group">
                  <octicon name="shield" />
                  <label>
                    标签：
                    <validate-error :text="errors.tags" />
                  </label>
                  <input type="text" class="form-control form-control-sm" v-model="doc.tags" />
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="col ml-1">
                <div class="form-group">
                  <label>
                    <validate-error :text="errors.desc" />
                  </label>
                  <b-tabs active-nav-item-class="font-weight-bold">
                    <b-tab title="详情" active>
                      <form-text-area rows="7" v-model="doc.desc" />
                    </b-tab>
                    <b-tab title="预览">
                      <div v-html="markdown" class="border" style="height:157px"></div>
                    </b-tab>
                  </b-tabs>
                </div>
              </div>
            </div>
            <div class="d-flex mt-3">
              <icon-button class="ml-1" icon="circle-slash" text="取消" @click="cancel" />
              <icon-button class="ml-1" width="100px" icon="database" text="保存" @click="save" />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { createQueryString } from "../../../finelets/helpers/QueryHelper.js";
import marked from "marked";
import util from "../../../finelets/helpers/util.js";
import _ from "lodash";

export default {
  data() {
    return {
      doc: {
        date: null,
        title: null,
        desc: null,
        product: { desc: null },
        qty: null,
        tags: null
      },
      products: [],
      docProduct: null,
      docCustomerRequirement: null,
      errors: {}
    };
  },
  async created() {
    this.$route.query.mode == "edit" ? this.editMode() : this.createMode();
  },

  computed: {
    markdown() {
      let md;
      if (this.doc.desc) md = marked(this.doc.desc);
      return md;
    },
    isCreateMode() {
      return this.$route.query.mode != "edit";
    }
  },
  methods: {
    createMode() {
      const requirement = this.$store.getters.selected("CustomerRequirement");
      this.docCustomerRequirement = requirement;
      this.doc.date = util.dateFormat(new Date());
    },

    async editMode() {
      const pc = this.$store.getters.selected("ProductChain");
      this.docCustomerRequirement = await this.$store.dispatch(
        "getCustomerRequirement",
        pc.customerRequirement.links.self
      );
      this.doc = {
        ...pc.data,
        date: util.dateFormat(new Date(pc.data.date))
      };
      this.docProduct = pc.product;
    },

    async onProductDropdown() {
      const cond = { search: this.doc.product.desc, filters: [] };
      let r = createQueryString([], cond);
      const data = await this.$store.dispatch("searchProducts", r);
      this.products = data;
    },

    onProductSelected(selected) {
      this.docProduct = selected;
      this.doc.product = selected.data;
    },

    async onProductInputed() {
      const cond = { search: this.doc.product.desc, filters: [] };
      let r = createQueryString([], cond);
      let data = await this.$store.dispatch("searchProducts", r);
      if (data.length === 1) {
        this.doc.product = data[0].data;
      } else {
        this.doc.product = { desc: this.doc.product.desc };
      }
    },

    async cancel() {
      setTimeout(() => {
        this.$router.back();
      });
    },

    async save() {
      const state = this.$store;
      this.errors = {};
      if (!this.docProduct) this.errors.product = "必须输入目标产品";
      if (!this.doc.date) this.errors.date = "必须输入方案日期";
      if (!this.doc.title) this.errors.title = "必须输入标题";
      if (!_.isEqual(this.errors, {})) return;

      try {
        if (this.$route.query.mode == "edit") {
          const url = this.$store.getters.selected("ProductChain").links.self;
          const toUpdate = {
            url,
            data: { ...this.doc }
          };
          if (!toUpdate.data.creator) {
            toUpdate.data.creator = this.$store.getters.user.id
          }
          await this.$store.dispatch("updateResource", toUpdate);
          const val = await this.$store.dispatch("getProductChain", url);
          this.$store.commit("selected", { key: "ProductChain", val });
        } else {
          await this.$store.dispatch("createResource", {
            url: this.docProduct.links.chains,
            data: {
              ...this.doc,
              customerRequirement: this.docCustomerRequirement.data.id,
              creator: this.$store.getters.user.id
            }
          });
        }

        this.$router.back();
      } catch (e) {}
    }
  }
};
</script>

<style>
.Subhead-heading {
  flex: 1 1 auto;
  font-size: 24px;
  font-weight: 400;
}
</style>
