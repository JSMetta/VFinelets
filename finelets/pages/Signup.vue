<template>
  <div class="mx-auto w-25">
    <div class="d-flex flex-column">
        <div class="d-flex mt-4">
          <h3>欢迎加入 {{appName}}</h3>
        </div>
        <div class="d-flex mt-4">
            <p class="text-secondary" style="font-size:18px">创建您的个人账户</p>
        </div>
        <!-- <div class="d-flex">
            <p v-if="errors.length">
              <b>请纠正以下输入错误：</b>
              <ul>
                <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
              </ul>
            </p>
        </div> -->
        <div class="d-flex">
            <div class="form-group w-100">
              <octicon name="shield" class=""/>
              <label>用户编号：<validate-error :text="errors.userId"/></label>
              <input type="text" class="form-control form-control-sm" v-model="user.userId">
            </div>
        </div>
        <div class="d-flex">
            <div class="form-group w-100">
              <octicon name="shield" class=""/>
              <label>姓名：<validate-error :text="errors.name"/></label>
              <input type="text" class="form-control form-control-sm" v-model="user.name">
            </div>
        </div>
        <div class="d-flex">
            <div class="form-group w-100">
              <octicon name="shield" class=""/>
              <label>密码：<validate-error :text="errors.password"/></label>
              <input type="password" class="form-control form-control-sm" v-model="user.password">
            </div>
        </div>
        <div class="d-flex">
            <div class="form-group w-100">
              <octicon name="shield" class=""/>
              <label>验证密码：<validate-error :text="errors.password"/></label>
              <input type="password" class="form-control form-control-sm" v-model="user.checkpsw">
            </div>
        </div>
        <div class="d-flex">
            <div class="form-group w-100">
              <octicon name="shield" class=""/>
              <label>电子邮件：<validate-error :text="errors.email"/></label>
              <input type="text" class="form-control form-control-sm" v-model="user.email">
            </div>
        </div>
        <div class="d-flex justify-content-center mt-3">
          <icon-button class="ml-1" icon="database" text="保存" @click="save"/>
          <icon-button class="ml-1" icon="circle-slash" text="取消" @click="cancel"/>
        </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      appName: this.$store.getters.app.loginPageTitle,
      user: {
        userId: null,
        name: null,
        password: null,
        checkpsw: null,
        email: null
      },
      errors: {}
    }
  },
  methods: {
    cancel () {
      this.$router.back()
    },

    async save () {
      // TODO: 需要完善校验逻辑
      this.errors = {}
      if (!this.user.userId) this.errors.userId = '必须输入您的用户编号'
      if (!_.isEmpty(this.errors)) return

      try {
        await this.$store.dispatch('registerUser', this.user)
        this.$router.back()
      } catch (e) {
        alert('注册失败：\r\n' + e.message)
      }
    }
  }
}
</script>

<style>
</style>
