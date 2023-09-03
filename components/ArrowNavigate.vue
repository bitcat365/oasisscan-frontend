<template>
  <span class="arrow-nav-con">
    <img class="arrow pre" src="../assets/arrows-pre.svg" @click.prevent.stop="$emit('pre')">
    <img v-if="!isLast" class="arrow next" src="../assets/arrows-next.svg" @click.prevent.stop="$emit('next')">
    <img v-else class="arrow next" src="../assets/next-disable.svg">
  </span>
</template>

<script>
  export default {
    name: 'ArrowNavigate',
    props: {
      isLast: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .arrow-nav-con {
    display: flex;
    .arrow {
      width: rem(24);
      height: rem(24);
      cursor: pointer;
    }
    .pre {
      margin-left: rem(8);
    }
    .next {
      margin-left: rem(8);
    }
  }
</style>
