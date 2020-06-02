<template>
  <div :class="['root', border ? 'border': '']">
    <div class="icon-con">
      <slot name="icon"></slot>
    </div>
    <div>
      <div class="name">{{name}}</div>
      <div class="value">{{value}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      border: {
        type: Boolean,
        default: true
      },
      name: {
        type: String,
        default: ''
      },
      value: {
        type: [String, Number],
        default: ''
      }
    },
    name: 'BlockStatus'
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/common";
  .root {
    display: flex;
    flex-direction: row;
    width: rem(203);
    padding-bottom: rem(15);
    padding-top: rem(20);
    &.border {
      border-bottom: 1px solid #D4D4D4;
    }
    .icon-con{
      width: rem(80);
      text-align: center;
    }
    .name {
      font-size: rem(14);
    }
    .value {
      font-size: rem(18);
      color: #F86E49;
    }
  }
</style>
