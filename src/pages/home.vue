<template>
  <div class="full-width center-content">
    <h1>Welcome to JSM Rockstar 2.0.1</h1>
    <!-- <img :src="userImgUrl" height="260px"/> -->
    <img :src="pic" height="260px" />
  </div>
</template>

<script>
import { $get } from "../../finelets/plugins/fetch";

export default {
  name: "home",
  data() {
    return {
      pic: null
    };
  },
  computed: {
    userImgUrl() {
      const user = this.$store.getters.user;
      return `http://localhost:9505/rockstar/api/pictures/${user.pic}`;
    }
  },
  async created() {
    const url = await this.$store.dispatch("fetchUserImg", this.userImgUrl);
    this.pic = url;
  },
  methods: {
    search() {
      console.log("Searching for: ", this.tag);
    }
  }
};
</script>

<style lang="stylus" scoped>
.full-width {
  width: 100%;
}

.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>