<template>
  <div class="jumbotron-fluid">
    <div class="row justify-content-center">
      <img
        src="../static/img/jsmetta.jpg"
        class="logo rounded-circle"
      />
    </div>
    <div class="row justify-content-center mt-3">
      <h4>JSMetta RockStar</h4>
    </div>
    <div class="row justify-content-center mt-3">
      <div class="col-4 loginform pt-3 pb-3">
        <form @submit.prevent="handleLogin">

          <div class="form-row">
            <div class="form-group col-12">
              <label for="userName">用户名：</label>
              <input
                type="text"
                id="userName"
                class="form-control"
                placeholder="User name"
                v-model="username"
                required
                autofocus
              >
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-12">
              <label for="password">密码：</label>
              <input
                type="password"
                id="password"
                class="form-control"
                v-model="password"
                placeholder="Password"
                required
              >
            </div>
          </div>
          <div class="checkbox">
            <label>
              <input
                type="checkbox"
                value="remember-me"
              > 记住我
            </label>
          </div>
          <button
            class="btn btn-success active btn-block"
            type="submit"
          >登录</button>
        </form>
      </div>
    </div>
    <div class="row justify-content-center mt-3">
      <div class="col-4 loginform" style="height:50px">
          <p class="mx-auto mt-2" style="width:60%">
            New to Cross?
            <router-link :to="{name: 'signup'}">
              Create an account.
            </router-link>
          </p>
      </div>
    </div>
  </div>

</template>

<script>
// import { mapActions } from 'vuex'
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async handleLogin () {
      const store = this.$store
      const session = await store.dispatch('login', {username: this.username, password: this.password})
      if (session) {
        let path = this.$router.currentRoute.params.wantedRoute || { name: 'home' }
        if (session.user.isAdmin) path = {name: 'admin'}
        this.$router.replace(path)
      }
    },
    async handleLogout () {
      this.logout()
    },
    async isLoggedIn () {
      // return isLoggedIn();
    }
  }
}
</script>

<style>
.logo {
  height: 70px;
  width: 70px;
}
.loginform {
  border: 1px solid;
  border-color: rgb(231, 231, 231);
  background-color: white;
}
</style>
