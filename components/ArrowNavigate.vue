<template>
  <span class="arrow-nav-con">
    <img class="arrow pre" src="../assets/arrows-pre.png" @click.prevent.stop="$emit('pre')">
    <img v-if="!isLast" class="arrow next" src="../assets/arrows-next.png" @click.prevent.stop="$emit('next')">
    <img v-else class="arrow next" src="../assets/next-disable.png">
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
  @import "../assets/css/common";
  .arrow-nav-con {
    display: flex;
    .arrow {
      width: rem(16);
      height: rem(16);
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
