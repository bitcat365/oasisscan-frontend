<template>
  <div class="container">
    <div class="notfound-con">
      <img class="notfound" src="../assets/404_page.png">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'error',
  }
</script>

<style lang="scss" scoped>
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
