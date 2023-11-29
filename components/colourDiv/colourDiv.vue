<template>
  <div :class="['colourDiv',color]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'error'
    }
  }
}
</script>

<style lang="scss" scoped>
.colourDiv {
  display: inline-block;
  text-align: center;
  width: rem(100);
  height: rem(30);
  line-height: rem(30);
  border-radius: rem(4);
  color: #ffffff !important;
  &.success {
    background-color: $success400;
  }
  &.warning {
    background-color: $warning400;
  }
  &.error {
    background-color: $error400;
  }
}
</style>
