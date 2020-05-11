<template>
    <div class="dropdown" :id="id">
        <button class="btn btn-light border dropdown-toggle btn-sm" type="button" :data-toggle="readonly ? '':'dropdown'">
          {{this.text}}
        </button>
        <div class="dropdown-menu">
          <a class="dropdown-item" v-for="option in options" :key="option.value"
              @click="selected(option.value)">{{option.name}}</a>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
  props: {
    id: {
      type: String
    },
    label: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    readonly: {type: Boolean},
    value: {
      required: true
    }
  },
  computed: {
    text: function () {
      let op = _.find(this.options, o => {
        return this.value === o.value
      })
      return op ? this.label + ': ' + op.name : this.label + ': 未选'
    }
  },
  methods: {
    selected (val) {
      this.$emit('changed', val)
    },
    onDropdown (arg) {
      alert(JSON.stringify(arg, null, 2))
    }
  }
}
</script>
