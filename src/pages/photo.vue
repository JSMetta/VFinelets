<template>
  <div class="home">
    <form>
      <label>
        Search:
        <input v-model="tag" type="text" />
      </label>
      <button type="submit" class="go-button" @click.prevent="search">Search</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      tag: ""
    };
  },
  methods: {
    search() {
      console.log("Searching for: ", this.tag);
    }
  }
};
</script>