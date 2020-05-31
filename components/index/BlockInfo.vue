<template>
  <div class="block-chain-info">
    <div>
      <block-status name="Block Height" value="1278473">
        <template slot="icon">
          <img class="icon1" src="../../assets/b1.png" />
        </template>
      </block-status>
      <block-status name="Current Epoch" value="1278">
        <template slot="icon">
          <img class="icon3" src="../../assets/b3.png">
        </template>
      </block-status>
      <block-status name="Total Transactions" value="127834" :border="false">
        <template slot="icon">
          <img class="icon5" src="../../assets/b5.png">
        </template>
      </block-status>
    </div>
    <div class="seperate"></div>
    <div>
      <block-status name="Total Escrow" value="1278473">
        <template slot="icon">
          <img class="icon2" src="../../assets/b2.png">
        </template>
      </block-status>
      <block-status name="Active validator" value="127">
        <template slot="icon">
          <img class="icon4" src="../../assets/b4.png">
        </template>
      </block-status>
      <block-status name="Total Delegators" value="1231" :border="false">
        <template slot="icon">
          <img class="icon6" src="../../assets/b6.png">
        </template>
      </block-status>
    </div>
  </div>
</template>

<script>
  import BlockStatus from './BlockStatus'
  export default {
    props: ['blockInfo'],
    name: 'BlockInfo',
    components: {
      BlockStatus
    },
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
    padding-left: rem(22);
    padding-right: rem(22);
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
