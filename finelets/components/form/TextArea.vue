<template>
  <div class="form-group">
    <!-- <octicon v-if="icon" :name="icon" class="mt-2"/> -->
    <label class="field-label">{{label}}</label>
    <!-- <textarea class="form-control form-control-sm" rows="6"></textarea> -->
    <textarea :rows="rows" class="form-control form-control-sm"
          :value="value" @input="onInput($event.target.value)"
          :style="readOnlyBg"
          :readonly = "readonly" />
  </div>
</template>

<script>
export default {
  props: {
    icon: String,
    label: String,
    rows: {Number, default: 4},
    readonly: {type: Boolean},
    value: String
  },
  computed: {
    readOnlyBg () {
      let bg = ''
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
