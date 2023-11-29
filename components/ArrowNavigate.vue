<template>
  <span class="arrow-nav-con">
    <SvgIcon
      className="arrow"
      iconName="arrows-pre"
      @click.prevent.stop="$emit('pre')"
    />
    <SvgIcon
      :className="isLast ? 'arrow disabled' : 'arrow'"
      iconName="arrows-next"
      @click.prevent.stop="isLast ? '' : $emit('next')"
    />
  </span>
</template>

<script>
export default {
  name: "ArrowNavigate",
  props: {
    isLast: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.arrow-nav-con {
  display: flex;
  gap: rem(20);
  .arrow {
    width: rem(24);
    height: rem(24);
    cursor: pointer;
    color: #fff;
  }
  .arrow:hover{
    color: $gray200;
  }
  .disabled {
    color: $gray200;
    cursor: auto;
  }
}
</style>
