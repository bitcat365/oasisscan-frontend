<template>
  <div class="container">
    <nav-bar :active="-1" />
    <div class="notfound-con">
      <img class="notfound" src="../../assets/404_page.png">
    </div>
  </div>
</template>

<script>
  import NavBar from '../../components/NavigationBar'

  export default {
    name: 'not_found',
    components: { NavBar }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/common";
  .notfound {
    width: rem(220);
    height: rem(220);
  }
  .container {
    min-height: calc(100vh - #{rem(100)});
    flex-direction: column;
    display: flex;
  }
  .notfound-con {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  }
</style>
