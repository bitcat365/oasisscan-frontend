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
  &.success {
    color: $success500;
    background-color: $success100;
  }
  &.warning {
    color: $warning500;
    background-color: $warning200;
  }
  &.error {
    color: $error500;
    background-color: $error200;
  }
}
</style>
