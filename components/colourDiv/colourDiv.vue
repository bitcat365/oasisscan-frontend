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
  text-align: center;
  width: rem(100);
  height: rem(30);
  border-radius: rem(4);
  display: flex;
  align-items: center;
  justify-content: center;
  &.success {
    color: $success500;
    background-color: $success200;
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
