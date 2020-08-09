<template>
  <router-link class="logo" aria-current="page" :to="'/'">
    <img class="logo-oasis" src="../assets/oasis-scan-logo.svg"/>
  </router-link>
</template>
<script>
  export default {
    name: 'Logo',
    props: ['light']
  }
</script>
<style lang="scss" scoped>
  @import "../assets/css/common";
  .logo {
    color: #37416B;
    display: flex;
    align-items: center;
    font-weight: 900;
    padding: 0 ;
    line-height: 1;
    font-family: 'Gotham Pro Black';
    > .logo-oasis{
      height: rem(102);
      margin: 0 0 0 10px;
    }
  }
</style>
