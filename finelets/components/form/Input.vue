<template>
  <div class="form-group">
    <octicon v-if="icon" :name="icon" class="mt-2"/>
    <label class="field-label">{{label}}</label>
    <input :type="type" class="form-control form-control-sm"
          :value="value" @input="onInput($event.target.value)"
          :placeholder="placeholder"
          :style="readOnlyBg"
          :readonly = "readonly" />
  </div>
</template>

<script>
export default {
  props: {
    icon: String,
    label: String,
    type: {
      type: String,
      default: 'text'
    },
    readonly: {type: Boolean},
    value: [String, Number],
    placeholder: String
  },
  computed: {
    readOnlyBg () {
      let bg
      if (this.readonly) bg = 'background-color: #fff;'
      return bg
    }
  },
  methods: {
    onInput (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style>

.field-label {
  font-size: 14px
}

</style>
