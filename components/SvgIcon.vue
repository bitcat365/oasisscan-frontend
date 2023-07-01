<template>
  <svg :class="svgClass" v-on="$listeners">
    <use :xlink:href="svgName" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    iconName: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    svgName() {
      return `#icon-${this.iconName}`
    },
    svgClass() {
      if (this.className) {
        return `svg-icon ${this.className}`
      } else {
        return 'svg-icon'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-icon {
  // width: 1em;
  // height: 1em;
  color: $theme-color;
  fill: currentColor;
  overflow: hidden;
}
</style>
