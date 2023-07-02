<template>
  <div :class="['root', border ? 'border': '']">
    <div class="icon-con">
      <slot name="icon"></slot>
    </div>
    <div>
      <div class="name">{{name}}</div>
      <div class="value">{{value | readable}}</div>
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
      background-color: $blueLight25;
      width: rem(60);
      height: rem(60);
      padding: rem(15);
      border-radius: rem(30);
    }
    .name {
      font-size: rem(14);
    }
    .value {
      font-size: rem(16);
      color: #F86E49;
    }
  }
</style>
