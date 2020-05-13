<template>
  <div>
    <header class="navbar navbar-expand-lg fixed-top Header">
      <router-link class="navbar-brand" :to="toHome">
            <img src="../static/img/jsmetta.jpg" width="30" height="30" class="rounded-circle"/>
      </router-link>
      <div class="navbar-collapse position-relative">
        <form class="form-inline mr-auto">
          <label class="header-search-wrapper">
                <input class="form-control form-control-sm mr-2 header-search"
                  type="search" placeholder="Search or jump to" style="width:300px">
                <img src="../static/img/search-key-slash.svg" alt="" class="mr-2">
          </label>
        </form>
        <div v-if="user" class="navbar-nav">
          <dropdown-menu direction="left" :items="menu" 
          :img="require('../static/img/clx.jpg')"
          @exit="logout" @updatePwd="showModal = true">
          </dropdown-menu>
        </div>
      </div>
    </header>
    <main style="padding-top:4rem">
      <div class="container-fluid jumbotron-fluid">
        <div class="row">
          <div class="col">
            <router-view />
            <modal v-if="showModal">
              <div slot="content">
                  <div class="d-flex flex-column">
                    <div class="d-flex mt-4">
                      <h3>请修改密码</h3>
                    </div>
                    <div class="d-flex">
                        <div class="form-group w-100">
                          <octicon name="shield" class=""/>
                          <label>原密码：<validate-error :text="errors.oldPassword"/></label>
                          <input type="password" class="form-control form-control-sm" v-model="oldPassword">
                        </div>
                    </div>
                    <div class="d-flex">
                        <div class="form-group w-100">
                          <octicon name="shield" class=""/>
                          <label>新密码：<validate-error :text="errors.password"/></label>
                          <input type="password" class="form-control form-control-sm" v-model="password">
                        </div>
                    </div>
                    <div class="d-flex">
                        <p v-if="errors.result" class="text-danger">{{ errors.result }}</p>
                    </div>
                    <div class="d-flex justify-content-center mt-3">
                      <icon-button class="ml-1" icon="database" text="保存" @click="save"/>
                      <icon-button class="ml-1" icon="circle-slash" text="取消" @click="cancel"/>
                    </div>
                </div>
              </div>
            </modal>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>

export default {
  data () {
    let obj = {
      showModal: false,
      oldPassword: null,
      password: null,
      errors: {}
    }
    return obj
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    toHome () {
      let role = 'ADMIN'
      const user = this.$store.getters.user
      if (user && !user.isAdmin) role = user.roles
      return this.getStartRoute(role)
    },
    menu () {
      const user = this.$store.getters.user
      return [
        {
          action: 'profile',
          name: user ? 'Signed in as ' + user.name : ''
        },
        {},
        {
          action: 'updatePwd',
          name: '更改密码'
        },
        {},
        {
          action: 'exit',
          name: '退出'
        }
      ]
    }
  },
  components: {
  },
  methods: {
    getStartRoute (role) {
      return {name: this.$router.options.starts[role]}
    },
    async logout () {
      await this.$store.dispatch('logout')
      if (this.$router.currentRoute.matched.some(r => !r.meta.public)) {
        this.$router.replace({
          name: 'login',
          params: {
            wantedRoute: this.$router.currentRoute.fullPath
          }
        })
      }
    },
    async save () {
      this.errors = {}
      if (!this.oldPassword) this.errors.oldPassword = '必须输入原密码'
      if (!this.password) this.errors.password = '必须输入新密码'
      if (this.errors.oldPassword || this.errors.password) return

      try {
        await this.$store.dispatch('updatePwd', {id: state.getters.user.id, data: {oldPassword: this.oldPassword, password: this.password}})
        this.oldPassword = null
        this.password = null
        this.showModal = false
      } catch (e) {
        this.errors.result = '密码修改未成功'
      }
    },

    cancel () {
      this.errors = {}
      this.oldPassword = null
      this.password = null
      this.showModal = false
    }
  }
}
</script>

<style>
.Header {
    background-color: #24292e;
    color: hsla(0,0%,100%,.75);
    z-index: 32;
}
.header-search {
    background: none;
    border: 0;
    box-shadow: none;
    display: table-cell;
    min-height: 26px;
    padding-bottom: 0;
    padding-top: 0;
    width: 100%;
}

.header-search-wrapper {
    background-color: hsla(0,0%,100%,.125);
    border: 0;
    box-shadow: none;
    color: #fff;
    font-size: inherit;
    min-height: 30px;
}
</style>
