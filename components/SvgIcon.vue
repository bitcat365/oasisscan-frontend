<template>
  <svg :class="svgClass" :style="style" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    },
    svgStyle: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`
    },
    // TODO
    svgClass() {
      if (this.className) {
        return `'svg-icon ' + ${this.className}`
      } else {
        return 'svg-icon'
      }
    },
    style() {
      const style = {
        width: '1em',
        height: '1em',
        color: '#175cd3',
        'vertical-align': '-0.15em',
        fill: 'currentColor',
        overflow: 'hidden'
      }
      if (this.svgStyle) {
        return Object.assign({}, style, this.svgStyle)
      } else {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  color: #175cd3;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
