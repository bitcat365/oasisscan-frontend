<template>
  <div class="block-chain-info">
    <div class="block-card">
      <div class="info-title">Height</div>
      <div class="info-number">{{blockInfo.height | intFormat}}</div>
    </div>
    <div class="block-card">
      <div class="info-title">Node</div>
      <div class="info-number">{{blockInfo.totalNodes | intFormat}}</div>
    </div>
    <div class="block-card">
      <div class="info-title">Validator</div>
      <div class="info-number">{{blockInfo.entity | intFormat}}</div>
    </div>
    <div class="block-card">
      <div class="info-title">Escrow</div>
      <div class="info-number">{{blockInfo.escrow | intFormat}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['blockInfo'],
    name: 'BlockInfo',
    data() {
      return {
      }
    },
    mounted() {
    }
  }
</script>

<style scoped lang="scss">
  .block-chain-info {
    position: relative;
    width: 100%;
    text-align: center;
    margin: 2.06rem auto 0;
    display: flex;
    justify-content: space-between;
    .block-card {
      border: 1px solid #979797;
      box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50);
      border-radius: 2px;
      width: 14.56rem;
      transition: all .2s ease-in-out;
      &:hover {
        box-shadow: 0 6px 12px 0 rgba(0,0,0,0.30);
        transform: translateY(-5px) scale(1.02);
        transform-origin: bottom;
      }
      > .info-number{
        color: #FF7A59;
        font-size: 1.5rem;
        line-height: 4.69rem;
      }
      > .info-title{
        background: #E0E0E0;
        line-height: 3rem;
        color: #3A3A3A;
        font-size: 1.13rem;
      }
    }
  }
</style>
