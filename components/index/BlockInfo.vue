<template>
  <div class="block-chain-info">
    <div>
      <block-status name="Block Height" :value="blockInfo.curHeight">
        <SvgIcon slot="icon" className="icon1" iconName="b1" />
      </block-status>
      <block-status name="Current Epoch" :value="blockInfo.curEpoch">
        <SvgIcon slot="icon" className="icon3" iconName="b3" />
      </block-status>
      <block-status
        name="Total Transactions"
        :value="blockInfo.totalTxs"
        :border="false"
      >
        <SvgIcon slot="icon" className="icon5" iconName="b5" />
      </block-status>
    </div>
    <div>
      <block-status name="Total Escrow" :value="blockInfo.totalEscrow || -1">
        <SvgIcon slot="icon" className="icon2" iconName="b2" />
      </block-status>
      <block-status name="Active Validator" :value="blockInfo.activeValidator">
        <SvgIcon slot="icon" className="icon4" iconName="b4" />
      </block-status>
      <block-status
        name="Total Delegators"
        :value="blockInfo.totalDelegate"
        :border="false"
      >
        <SvgIcon slot="icon" className="icon6" iconName="b6" />
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
  .icon1,
  .icon2,
  .icon3,
  .icon4,
  .icon5,
  .icon6 {
    width: rem(30);
    height: rem(30);
    color: $blue700;
  }
}
</style>
