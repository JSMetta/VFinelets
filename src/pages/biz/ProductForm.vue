<template>
  <div class="mx-auto w-75">
    <div class="row mt-4 justify-content-center">
      <div class="col-3">
          <img class="bg-dark" src="/static/img/JSM2-2.jpg" style="width:100%"/>
      </div>
      <div class="col-9">
        <div class="d-flex align-items-baseline">
           <h2 class="Subhead-heading">产品规格</h2>
        </div>
        <form class="border-top" novalidate="true" @submit.prevent>
          <div class="mt-3">
            <p v-if="errors.length">
              <b>Please correct the following error(s):</b>
              <ul>
                <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
              </ul>
            </p>
            <div class="form-row">
              <div class="col-6 ml-1">
                  <div class="form-group">
                    <div>
                      <octicon name="shield" class="" style="color:green"/>
                      <label>编号：</label>
                      <validate-error :text="errors.code"></validate-error>
                    </div>
                    <input type="text" class="form-control form-control-sm" v-model="product.code">
                  </div>
              </div>
            </div>
            <div class="form-row">
              <div class="col-8 ml-1">
                  <div class="form-group">
                    <octicon name="note" class="" style="color:green"/>
                    <label>描述：</label>
                    <input type="text" class="form-control form-control-sm" v-model="product.desc">
                  </div>
              </div>
            </div>
            <div class="form-row">
              <div class="col ml-1">
                  <div class="form-group">
                    <octicon name="gear" class="" style="color:green"/>
                    <label>成分：</label>
                    <input type="text" class="form-control form-control-sm" v-model="product.content">
                  </div>
              </div>
              <div class="col ml-1">
                  <div class="form-group">
                    <octicon name="ruby" class="" style="color:green"/>
                    <label>组织：</label>
                    <input type="text" class="form-control form-control-sm" v-model="product.constructure">
                  </div>
              </div>
              <div class="col-5 ml-1">
                  <div class="form-group">
                    <octicon name="server" class="" style="color:green"/>
                    <label>纱支：</label>
                    <input type="text" class="form-control form-control-sm" v-model="product.yarn">
                  </div>
              </div>
            </div>
            <div class="form-row">
              <div class="col-6 ml-1">
                  <div class="form-group">
                    <octicon name="fold" class="" style="color:green"/>
                    <label>密度：</label>
                    <input type="text" class="form-control form-control-sm" v-model="product.spec.dnsty">
                  </div>
              </div>
              <div class="col ml-1">
                  <div class="form-group">
                    <octicon name="ellipsis" class="" style="color:green"/>
                    <label>门幅：</label>
                    <input type="text" class="form-control form-control-sm" v-model="product.spec.width">
                  </div>
              </div>
              <div class="col ml-1">
                  <div class="form-group">
                    <octicon name="hubot" class="" style="color:green"/>
                    <label>克重：</label>
                    <input type="text" class="form-control form-control-sm" v-model="product.spec.GSM">
                  </div>
              </div>
            </div>
            <div class="form-row">
              <div class="col-6 ml-1">
                  <div class="form-group">
                    <octicon name="fold" class="" style="color:green"/>
                    <label>坯布密度：</label>
                    <input type="text" class="form-control form-control-sm" v-model="product.grey.dnsty">
                  </div>
              </div>
              <div class="col ml-1">
                  <div class="form-group">
                    <octicon name="ellipsis" class="" style="color:green"/>
                    <label>坯布门幅：</label>
                    <input type="text" class="form-control form-control-sm" v-model="product.grey.width">
                  </div>
              </div>
              <div class="col ml-1">
                  <div class="form-group">
                    <octicon name="hubot" class="" style="color:green"/>
                    <label>坯布克重：</label>
                    <input type="text" class="form-control form-control-sm" v-model="product.grey.GSM">
                  </div>
              </div>
            </div>
            <div class="form-row">
              <div class="col ml-1">
                  <div class="form-group">
                    <octicon name="light-bulb" class="" style="color:green"/>
                    <label>标签：</label>
                    <input type="text" class="form-control form-control-sm" v-model="product.tags">
                  </div>
              </div>
            </div>
            <div class="form-row">
              <div class="col ml-1">
                  <div class="form-group">
                    <octicon name="tag" class="" style="color:green"/>
                    <label>备注：</label>
                    <input type="text" class="form-control form-control-sm" v-model="product.remark">
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
import state from '../../store'
export default {
  data () {
    return {
      product: {
        code: null,
        desc: null,
        content: null,
        constructure: null,
        yarn: null,
        spec: {width: null, dnsty: null, GSM: null},
        grey: {width: null, dnsty: null, GSM: null},
        remark: null,
        tags: null
      },
      errors: {}
    }
  },
  async created () {
  },
  methods: {
    async cancel () {
      setTimeout(() => {
        this.$router.back()
      })
    },

    async save () {
      this.errors = {}
      if (!this.product.code) this.errors.code = '必须输入编号，且编号必须唯一'
      // if (!this.part.name) this.errors.name = '必须输入物料名称'
      if (this.errors.code) return

      let toCreate = {
        ...this.product,
        creator: state.getters.user.id
      }
      try {
        await state.dispatch('createProduct', toCreate)
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
