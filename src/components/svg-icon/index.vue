<template>
  <svg :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  props: {
    iconId: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: null
    }
  },
  computed: {
    iconName() {
      return `#icon-${this.iconId}`
    },
    svgClass() {
      if (this.className) {
        return `svg-icon icon-${this.className}`
      } else {
        return 'svg-icon'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
svg {
  fill: currentColor;
  width: 0.8rem;
}
</style>

