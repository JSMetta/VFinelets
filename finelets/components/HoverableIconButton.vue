<template>
    <div  v-b-hover="handleHover" class="d-flex justify-content-end">
      <b-icon v-if="isHovered" :icon="icon" :scale="scale" :variant="variant" @click="onClick"></b-icon>
      <b-icon v-else :icon="unhoveredName" :scale="scale" :variant="variant"></b-icon>
    </div>
</template>

<script>
export default {
  data () {
    return {
      isHovered: false
    }
  },
  props: {
    icon: {
      type: String,
      required: true
    },
    scale: {
      type: String, default: '1'
    },
    variant: {type: String, default: 'success'}
  },
  computed: {
    unhoveredName () {
      return this.icon + '-fill'
    }
  },
  methods: {
    handleHover (hovered) {
      this.isHovered = hovered
    },
    onClick: function () {
      this.$emit('click')
    }
  }
}
</script>
