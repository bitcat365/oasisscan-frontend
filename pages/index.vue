<template>
  <div id="home">
    <Row :gutter="20" class="top">
      <Col span="8">
        <PanelSmall title="Price">
          <img slot="icon" src="../assets/price.svg" class="icon" />
          <span slot="headerRight" class="headerRight"> ${{ marketInfo.price | readable }} </span>
          <BlockMarket :marketChange="marketInfo.priceChangePct24h" :marketChart="marketChart.price" />
        </PanelSmall>
      </Col>
      <Col span="8">
        <PanelSmall title="Market Cap">
          <img slot="icon" src="../assets/market.svg" class="icon" />
          <span slot="headerRight" class="headerRight"> ${{ marketInfo.marketCap | readable }} </span>
          <BlockMarket :marketChange="marketInfo.marketCapChangePct24h" :marketChart="marketChart.marketCap" />
        </PanelSmall>
      </Col>
      <Col span="8">
        <PanelSmall title="Trading Volume">
          <img slot="icon" src="../assets/trade.svg" class="icon" />
          <span slot="headerRight" class="headerRight"> ${{ marketInfo.volume | readable }} </span>
          <BlockMarket :marketChange="marketInfo.volumeChangePct24h" :marketChart="marketChart.volume" />
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
        <Panel title="Network Trend">
          <span slot="headerRight" class="headerRight">
            <div class="circle" style="background-color:#7A5AF8"></div>
            Total Transaction
          </span>
          <span slot="headerRight" class="headerRight">
            <div class="circle" style="background-color:#53B1FD"></div>
            Total Escrow
          </span>
          <Chart :tx="tx" :escrow="escrow" />
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
import { fetchMarketChart, fetchMarketInfo, fetchBlockInfo, fetchHomeBlockList, fetchTransactionsList, fetchNetworkTrend} from '../fetch/index'
import Config from '../config/index'
import Panel from '../components/panel/Panel'
import PanelSmall from '../components/panel/PanelSmall'
import BlockInfo from '../components/index/BlockInfo'
import BlockMarket from '../components/index/BlockMarket'
import BlockTable from '../components/Table/index'
import Chart from '../components/index/Chart'
export default {
  components: { Panel, PanelSmall, BlockInfo, BlockTable, Chart, BlockMarket },
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
          key: 'txs',
          textAlign: 'center'
        },
        {
          title: 'Time',
          key: 'timestamp',
          textAlign: 'right'
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
          key: 'timestamp',
          textAlign: 'right'
        }
      ]
    }
  },
  async asyncData({ $axios, store: $store }) {
    const data = await Promise.all([fetchMarketChart({ $axios, $store }), fetchMarketInfo({ $axios, $store }), fetchBlockInfo({ $axios, $store }), fetchHomeBlockList({ $axios, $store }), fetchTransactionsList({ $axios, $store }), fetchNetworkTrend({ $axios, $store })])
    const marketChart = data[0]
    const marketInfo = data[1]
    const blockInfo = data[2]
    const { list: blocks } = data[3]
    const { list: transactions } = data[4]
    const tx = data[5].tx
    const escrow = data[5].escrow
    return { marketChart, marketInfo, blockInfo, blocks, transactions, newsList: Config.news, tx, escrow }
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
      const blockInfo = data[0]
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
        height: rem(350);
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
