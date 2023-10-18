<template>
  <Spin fix v-if="loading" class="spin">
    <Icon type="ios-loading" size="24" class="spin-icon"></Icon>
    <div>Loading</div>
  </Spin>
</template>

<script>
export default {
  name: "Loader",
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style scoped lang="scss">
.spin{
  .spin-icon {
    animation: ani-spin 1s linear infinite;
  }
  @keyframes ani-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
