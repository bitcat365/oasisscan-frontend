<template>
  <div class="block-chain-info">
    <div>
      <block-status name="Block Height" :value="blockInfo.curHeight">
        <SvgIcon slot="icon" className="icon" iconName="b1" />
      </block-status>
      <block-status name="Active Validator" :value="blockInfo.activeValidator">
        <SvgIcon slot="icon" className="icon" iconName="b4" />
      </block-status>
      <block-status
        name="Total Transactions"
        :value="blockInfo.totalTxs"
        :border="false"
      >
        <SvgIcon slot="icon" className="icon" iconName="b5" />
      </block-status>
    </div>
    <div>
      <block-status name="Current Epoch" :value="blockInfo.curEpoch">
        <SvgIcon slot="icon" className="icon" iconName="b3" />
      </block-status>
      <block-status
        name="Total Delegators"
        :value="blockInfo.totalDelegator"
        :border="false"
      >
        <SvgIcon slot="icon" className="icon" iconName="b6" />
      </block-status>
      <block-status name="Total Escrow" :value="blockInfo.totalEscrow || -1">
        <SvgIcon slot="icon" className="icon" iconName="b2" />
      </block-status>
    </div>
  </div>
</template>

<script>
import BlockStatus from "./BlockStatus";
export default {
  name: "BlockInfo",
  components: {
    BlockStatus
  },
  props: ["blockInfo"],
  data() {
    return {};
  },
  mounted() {}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/utils";
.block-chain-info {
  width: 100%;
  @extend .flexRow;
  > div {
    flex: 1;
  }
  .icon {
    width: rem(30);
    height: rem(30);
    color: $blue700;
  }
}
</style>
