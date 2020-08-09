<template>
  <span class="address-emoji" v-if="amount <= 1000">🦐</span>
  <span class="address-emoji" v-else-if="amount <= 10000">🦞</span>
  <span class="address-emoji" v-else-if="amount <= 100000">🦀️</span>
  <span class="address-emoji" v-else-if="amount <= 1000000">🐟</span>
  <span class="address-emoji" v-else-if="amount <= 10000000">🐬</span>
  <span class="address-emoji" v-else-if="amount <= 100000000">🐋</span>
  <span class="address-emoji" v-else-if="amount <= 1000000000">🐳</span>
</template>

<script>
  export default {
    name: 'emoji',
    props: ['amount']
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/common";
  .address-emoji {
    padding-right: rem(4);
  }
</style>
