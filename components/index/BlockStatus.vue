<template>
  <div :class="['root', border ? 'border' : '']">
    <div class="icon-con">
      <slot name="icon"></slot>
    </div>
    <div>
      <div class="name">{{ name }}</div>
      <div class="value">{{ value | readable }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    border: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ""
    },
    value: {
      type: [String, Number],
      default: ""
    }
  },
  name: "BlockStatus"
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/utils";
.root {
  display: flex;
  flex-direction: row;
  padding: rem(15) rem(30);
  &.border {
    border-bottom: 1px solid #d4d4d4;
  }
  .icon-con {
    background-color: $blueLight25;
    width: rem(60);
    height: rem(60);
    margin: 0 rem(20);
    padding: rem(15);
    border-radius: rem(30);
  }
  .name {
    font-size: rem(14);
    color: $gray400;
  }
  .value {
    font-size: rem(20);
  }
}
</style>
