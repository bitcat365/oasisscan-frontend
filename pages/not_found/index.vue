<template>
  <div class="container">
    <div class="notfound-con">
      <img src="../../assets/404_page.svg">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'not_found',
  }
</script>

<style lang="scss" scoped>
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
