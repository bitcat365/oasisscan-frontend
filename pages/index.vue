<template>
  <div id="home">
    <Row :gutter="20" class="top">
      <Col span="8">
        <PanelSmall title="Price">
          <img slot="icon" src="../assets/price.svg" class="icon" />
          <span slot="headerRight" class="headerRight">
            $1.2345678
          </span>
        </PanelSmall>
      </Col>
      <Col span="8">
        <PanelSmall title="Market Cap Rank">
          <img slot="icon" src="../assets/market.svg" class="icon" />
          <span slot="headerRight" class="headerRight">
            123
          </span>
        </PanelSmall>
      </Col>
      <Col span="8">
        <PanelSmall title="Trading Volume">
          <img slot="icon" src="../assets/trade.svg" class="icon" />
          <span slot="headerRight" class="headerRight">
            $123,456.78
          </span>
        </PanelSmall>
      </Col>
    </Row>
    <Row :gutter="20" class="center">
      <Col span="12">
        <Panel title="Network Status">
          <span slot="headerRight" class="headerRight">
            <div class="circle" style="background-color:#12B76A"></div>
            Online
          </span>
          <BlockInfo :blockInfo="blockInfo"></BlockInfo>
        </Panel>
      </Col>
      <Col span="12">
        <Panel title="Transaction History">
          <span slot="headerRight" class="headerRight">
            <div class="circle" style="background-color:#7A5AF8"></div>
            Total Transaction
          </span>
          <span slot="headerRight" class="headerRight">
            <div class="circle" style="background-color:#53B1FD"></div>
            Total Escrow
          </span>
        </Panel>
      </Col>
    </Row>
    <Row :gutter="20" class="bottom">
      <Col span="12">
        <Panel title="Latest Blocks">
          <router-link slot="headerRight" to="/blocks" class="headerRight">View All</router-link>
          <BlockTable :columns="blockListColumns" :data="blocks" />
        </Panel>
      </Col>
      <Col span="12">
        <Panel title="Latest Transactions">
          <router-link slot="headerRight" to="/transactions" class="headerRight">View All</router-link>
          <BlockTable :columns="transactionColumns" :data="transactions" />
        </Panel>
      </Col>
    </Row>
  </div>
</template>

<script>
import { fetchBlockInfo, fetchHomeBlockList, fetchTransactionsList, fetchTxHistory } from '../fetch/index'
import Config from '../config/index'
import Panel from '../components/panel/Panel'
import PanelSmall from '../components/panel/PanelSmall'
import BlockInfo from '../components/index/BlockInfo'
import BlockTable from '../components/Table/index'
export default {
  components: { Panel, PanelSmall, BlockInfo, BlockTable },
  data() {
    return {
      timer: -1,
      blockListColumns: [
        {
          title: 'Height',
          key: 'height'
        },
        {
          title: 'Proposer',
          key: 'proposer'
        },
        {
          title: 'Txs',
          key: 'txs'
        },
        {
          title: 'Time',
          key: 'timestamp'
        }
      ],
      transactionColumns: [
        {
          title: 'Tx Hash',
          key: 'txHash'
        },
        {
          title: 'Height',
          key: 'height'
        },
        {
          title: 'Type',
          key: 'type'
        },
        {
          title: 'Time',
          key: 'timestamp'
        }
      ]
    }
  },
  async asyncData({ $axios, store: $store }) {
    const data = await Promise.all([fetchBlockInfo({ $axios, $store }), fetchHomeBlockList({ $axios, $store }), fetchTransactionsList({ $axios, $store }), fetchTxHistory({ $axios, $store })])
    let blockInfo = data[0]
    blockInfo.totalEscrow = Number(blockInfo.totalEscrow).toFixed()
    const txHistory = data[3]
    const { list: blocks } = data[1]
    const { list: transactions } = data[2]
    return { blockInfo, blocks, transactions, newsList: Config.news, txHistory }
  },
  mounted() {
    this.timer && clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.repool()
    }, 6000)
  },
  methods: {
    async repool() {
      const $axios = this.$axios
      const $store = this.$store
      const data = await Promise.all([fetchBlockInfo({ $axios, $store }, false), fetchHomeBlockList({ $axios, $store }, 10, 1, false), fetchTransactionsList({ $axios, $store }, 1, 10, '', false)])
      let blockInfo = data[0]
      blockInfo.totalEscrow = Number(blockInfo.totalEscrow).toFixed()
      const { list: blocks } = data[1]
      const { list: transactions } = data[2]
      this.blocks = blocks
      this.blockInfo = blockInfo
      this.transactions = transactions
      this.timer = setTimeout(() => {
        this.repool()
      }, 6000)
    }
  }
}
</script>

<style lang="scss" scoped>
#home {
  .top {
    margin-bottom: rem(20);
    .ivu-col {
      > * {
        height: rem(210);
      }
    }
  }
  .center {
    margin-bottom: rem(20);
    .ivu-col {
      > * {
        height: rem(360);
      }
      .headerRight {
        color: $gray400;
        .circle {
          display: inline-block;
          width: rem(10);
          height: rem(10);
          border-radius: rem(5);
          margin-left: rem(8);
        }
      }
    }
  }
  .bottom {
    margin-bottom: rem(20);
    .ivu-col {
      > * {
        height: rem(760);
      }
      .headerRight {
        color: $blue500;
      }
    }
  }
}
</style>
