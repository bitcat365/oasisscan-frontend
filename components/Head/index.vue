<template>
  <div class="Head-wrapper">
    <div class="Head-left">
      <span>{{ title }}</span>
      <slot name="HeadLeft"></slot>
    </div>
    <div class="Head-right">
      <slot name="HeadRight"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Head',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/utils';
.Head-wrapper {
  @extend .flexRow;
  height: rem(40);
  line-height: rem(40);
  margin-bottom: rem(20);
  .Head-left {
    font-size: rem(20);
    color: $gray800;
  }
  .Head-right {
    font-size: rem(16);
  }
}
</style>
