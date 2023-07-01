<template>
  <header>
    <Input v-model="keywords" icon="ios-search" type="text" placeholder="Search by Address/Entity/Block/Tx hash"></Input>
    <Dropdown @on-click="networkClick">
      <a class="network-selector" href="javascript:void(0)">
        {{ net }}
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <DropdownMenu class="network-select-list" slot="list">
        <DropdownItem :name="chainId" class="network-select-item">
          Mainnet
        </DropdownItem>
        <DropdownItem :name="testnetChainId" class="network-select-item">
          Testnet
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </header>
</template>

<script>
import Config from '../config/index.json'
export default {
  data() {
    return {
      chainId: Config.chainId,
      testnetChainId: Config.testnetChainId,
      keywords: ''
    }
  },
  computed: {
    net() {
      return this.$store.state.net
    }
  },
  methods: {
    networkClick(name) {
      // console.log('name', name)
      if (name === Config.testnetChainId) {
        location.href = '//' + location.host.replace('www.oasisscan.com', 'testnet.oasisscan.com')
      } else {
        location.href = '//' + location.host.replace('testnet.oasisscan.com', 'www.oasisscan.com')
      }
      this.$store.commit('SET_NET', name)
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  height: rem(50);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
/deep/.ivu-input {
  max-width: rem(808);
  height: rem(50);
  line-height: rem(50);
  padding: 0 rem(50);
  font-size: 1rem;
  color: #667085;
  border: 0;
  border-radius: rem(25);
}
/deep/.ivu-input-icon {
  width: rem(50);
  height: rem(50);
  line-height: rem(50);
  font-size: rem(24);
  position: absolute;
  left: 0;
}
/deep/.ivu-dropdown {
  font-size: 1rem;
  color: #475467;
}
.network-selector {
  width: rem(110);
  height: rem(40);
  padding-left: rem(10);
  border-radius: rem(20);
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: white;
}
.network-select-list {
  min-width: rem(100);
  .network-select-item {
    font-size: 1rem !important;
    padding: 0 rem(20);
    height: rem(36);
    line-height: rem(36);
    &:hover {
      background: #e4e7ec;
      // font-weight: bold;
    }
  }
}
</style>
