<template>
  <header>
    <Input class="input" v-model="keywords" prefix="ios-search" @on-enter="onsubmit" placeholder="Search by Address/Entity/Block/Tx hash"></Input>
    <Dropdown class="dropdown" @on-click="networkClick">
      <a class="network-selector" href="javascript:void(0)">
        {{ net }}&nbsp;
        <Icon type="ios-arrow-down" size="16"></Icon>
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
import { onSearch } from '../fetch'
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
    },
    async onsubmit() {
      onSearch(this, this.keywords)
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  height: rem(40);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.input {
  /deep/.ivu-input {
    max-width: rem(808);
    height: rem(40);
    line-height: rem(40);
    padding: 0 rem(40);
    font-size: 1rem;
    color: $gray500;
    border: 0;
    border-radius: rem(20);
  }
  /deep/.ivu-input:focus {
    box-shadow: none;
  }
  /deep/.ivu-icon {
    width: rem(40);
    height: rem(40);
    line-height: rem(40);
    font-size: rem(24);
  }
}
.dropdown {
  /deep/.ivu-dropdown {
    color: #475467;
  }
  .network-selector {
    display: block;
    width: rem(130);
    height: rem(40);
    line-height: rem(40);
    text-align: center;
    border-radius: rem(20);
    background-color: white;
  }
  /deep/.ivu-select-dropdown {
    border-radius: rem(10);
    padding: 0;
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
}
</style>
