<template>
  <svg :class="svgClass" :style="svgStyle" v-on="$listeners">
    <use :xlink:href="svgName" />
  </svg>
</template>

<script>
export default {
  name: "SvgIcon",
  props: {
    iconName: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ""
    },
    iconStyle: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    svgName() {
      return `#icon-${this.iconName}`;
    },
    svgClass() {
      if (this.className) {
        return `svg-icon ${this.className}`;
      } else {
        return "svg-icon";
      }
    },
    svgStyle() {
      const style = {
        width: "1em",
        height: "1em",
        color: "#175cd3",
        fill: "currentColor",
        overflow: "hidden"
      };
      if (this.iconStyle) {
        return Object.assign({}, style, this.iconStyle);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  color: #175cd3;
  fill: currentColor;
  overflow: hidden;
}
</style>
