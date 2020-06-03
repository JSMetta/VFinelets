<template>
  <div class="full-width center-content">
    <h1>Welcome to JSM Rockstar 2.0.1</h1>
    <img :src="pic" height="260px" />
  </div>
</template>

<script>

export default {
  name: "home",
  data() {
    return {
      pic: null
    };
  },
  computed: {
  },
  async created() {
    this.pic = await this.$store.dispatch('userPic')
  },
  methods: {
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