<template>
  <router-link class="logo" aria-current="page" :to="$i18n.path('/')">
    <img class="logo-oasis" src="../assets/oasis-scan-logo.png"/>
  </router-link>
</template>
<script>
  export default {
    name: 'Logo',
    props: ['light']
  }
</script>
<style lang="less" scoped>
  .logo {
    color: #37416B;
    display: flex;
    align-items: center;
    font-weight: 900;
    padding: 0 ;
    line-height: 1;
    font-family: 'Gotham Pro Black';
    > .logo-oasis{
      height: 2.44rem
    }
  }
</style>
