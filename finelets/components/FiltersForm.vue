<template>
  <form class="form-inline" @submit.prevent>
    <input class="form-control mr-auto" placeholder="Search" :style="search.style" v-model="searchValue"
      @change="searchChanged"/>
    <div class="btn-group">
      <dropdown v-if="config.filter" class="ml-1" :options="config.filter.options" :label="config.filter.label" :value="filterval"
                @changed="filterChanged"/>
    </div>
    <icon-button v-if="config.cmdButton" class="ml-3" icon="repo" :text="config.cmdButton.text || 'New'" @click="triggerAction"/>
  </form>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data () {
    let obj = {}
    if (this.config.search) {
      obj.searchValue = this.config.search.value
    }
    if (this.config.filter) {
      obj.filterval = this.config.filter.value
    }

    return obj
  },
  computed: {
    search () {
      let width = this.config.search ? (this.config.search.width || 400) : 400
      return {
        style: {
          width: '' + width + 'px'
        }
      }
    }
  },
  methods: {
    triggerAction () {
      this.$emit('action')
    },
    filterChanged (val) {
      this.filterval = val
      this.$emit('search', { search: this.searchValue, filters: [val] })
    },
    searchChanged () {
      this.$emit('search', {search: this.searchValue, filters: [this.filterval]})
    }
  }
}
</script>
