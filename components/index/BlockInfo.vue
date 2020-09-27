<template>
  <div class="block-chain-info">
    <div>
      <block-status name="Block Height" :value="blockInfo.curHeight">
        <template slot="icon">
          <img class="icon1" src="../../assets/b1.svg" />
        </template>
      </block-status>
      <block-status name="Current Epoch" :value="blockInfo.curEpoch">
        <template slot="icon">
          <img class="icon3" src="../../assets/b3.svg">
        </template>
      </block-status>
      <block-status name="Total Transactions" :value="blockInfo.totalTxs" :border="false">
        <template slot="icon">
          <img class="icon5" src="../../assets/b5.svg">
        </template>
      </block-status>
    </div>
    <div class="seperate"></div>
    <div>
      <block-status name="Total Escrow" :value="blockInfo.totalEscrow || -1">
        <template slot="icon">
          <img class="icon2" src="../../assets/b2.svg">
        </template>
      </block-status>
      <block-status name="Active Validator" :value="blockInfo.activeValidator">
        <template slot="icon">
          <img class="icon4" src="../../assets/b4.svg">
        </template>
      </block-status>
      <block-status name="Total Delegators" :value="blockInfo.totalDelegate" :border="false">
        <template slot="icon">
          <img class="icon6" src="../../assets/b6.svg">
        </template>
      </block-status>
    </div>
  </div>
</template>

<script>
  import BlockStatus from './BlockStatus'
  export default {
    name: 'BlockInfo',
    components: {
      BlockStatus
    },
    props: ['blockInfo'],
    data() {
      return {
      }
    },
    mounted() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/css/common";
  .block-chain-info {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-left: rem(32);
    padding-right: rem(32);
    padding-top: rem(18);
    padding-bottom: rem(18);
    .seperate {
      height: rem(250);
      width: 1px;
      background-color: #D4D4D4;
    }
    .icon1,.icon2,.icon3,.icon4,.icon5,.icon6 {
      width: rem(40);
    }
    .icon4 {
      width: rem(33);
    }
  }
</style>
