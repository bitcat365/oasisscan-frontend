<template>
  <div id="validatorInfo">
    <Head title="VALIDATOR INFO"></Head>
    <Row class="top">Detail</Row>
    <Row :gutter="20" class="center-chart">
      <Col span="12">
        <panel title="Escrow Status">
          <pie-chart :data="escrowAmountStatus"></pie-chart>
        </panel>
      </Col>
      <Col span="12">
        <panel title="Escrow Trend">
          <trend-chart :trends="escrowTrendData"></trend-chart>
        </panel>
      </Col>
    </Row>
    <Row :gutter="20" class="center-block">
      <Col span="12">
        <panel title="Signatures Blocks">
          <Kuai :list="signsStates"></Kuai>
        </panel>
      </Col>
      <Col span="12">
        <panel title="Proposal Blocks">
          <Kuai :list="proposalsStates"></Kuai>
        </panel>
      </Col>
    </Row>
    <Row :gutter="20" class="bottom-table-top">
      <Col span="12">
        <panel title="Delegators"></panel>
      </Col>
      <Col span="12">
        <panel title="Escrow Event"></panel>
      </Col>
    </Row>
    <Row :gutter="20" class="bottom-table-bot">
      <Col span="12">
        <panel title="Proposed Blocks"></panel>
      </Col>
      <Col span="12">
        <panel title="Votes"></panel>
      </Col>
    </Row>
  </div>
</template>

<script>
import Head from '~/components/Head'
import Panel from '../../../components/panel/Panel'
import BlockTable from '../../../components/Table/index'
import Page from '../../../components/Page'
import PieChart from '../../../components/validator/piechart'
import TrendChart from '../../../components/validator/trendchart'
import Kuai from '../../../components/validator/kuai'
import { getDelegatorsByProposer, getEventsByProposer, fetchValidatorDetail, getBlockByProposer, validatorStats, fetchEscrowTrendByAddress } from '../../../fetch'
import Config from '../../../config'
export default {
  name: 'validatorDetail',
  components: {
    Head,
    BlockTable,
    Panel,
    Page,
    PieChart,
    TrendChart,
    Kuai
  },
  async asyncData({ $axios, store: $store, params }) {
    const entityAddress = decodeURIComponent(params.id)
    const data = await Promise.all([fetchValidatorDetail({ $axios, $store }, entityAddress), fetchEscrowTrendByAddress({ $axios, $store }, entityAddress)])
    const { name = 'Validator', escrow, proposals, signs, nodes = [''], balance, website = '', twitter = '', keybase = '', icon = '', active, rank, delegators, rates, bounds, nonce, ...others } = data[0]
    const { list: escrowTrendData } = data[1]
    // console.log('escrowTrendData', escrowTrendData)
    // console.log('data 0', data[0])
    // const { signs: signsList, proposals: proposalsList } = await fetchBlockList($axios, entityId)
    const { list: blockList, totalSize: totalBlockListSize } = await getBlockByProposer({ $axios, $store }, entityAddress)
    const res = {
      ...others,
      blockList,
      totalBlockListSize,
      escrowTrendData: [...escrowTrendData].reverse(),
      signsList: [],
      proposalsList: [],
      blockInfo: {},
      name,
      escrow,
      proposals,
      signs,
      nodes,
      balance,
      website,
      twitter,
      keybase,
      icon,
      active,
      rank,
      entityAddress,
      delegators,
      rates,
      bounds,
      nonce
    }
    return res
  },
  data() {
    return {
      editURL: Config.editURL,
      blockListSizer: 5,
      eventListSizer: 5,
      blockListPage: 1,
      delegatorListPage: 1,
      eventListPage: 1,
      totalDelegatorSize: 0,
      totalEventListSize: 0,
      delegatorsList: null,
      evensList: null,
      signsStates: [],
      proposalsStates: [],
      blockListColumns: [
        {
          title: 'Height',
          key: 'height'
        },
        {
          title: 'Block Hash',
          key: 'hash'
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
      list: [],
      columns1: [
        {
          title: 'Address',
          key: 'address',
          slot: true
        },
        {
          title: 'Amount/Shares',
          key: 'amountAndShares'
        },
        {
          title: 'Percentage',
          key: 'percent'
        }
      ],
      columns2: [
        {
          title: 'Height',
          key: 'height'
        },
        {
          title: 'Tx Hash',
          key: 'txHash'
        },
        {
          title: 'Amount/Shares',
          key: 'amountAndShares',
          slot: true
        },
        {
          title: 'Time',
          key: 'timestamp'
        }
      ]
    }
  },
  computed: {
    noExtraInfo() {
      return !this.website && !this.twitter && !this.keybase
    }
  },
  mounted() {
    this.gotoEvents(1)
    this.gotoDelegators(1)
    this.getStates()
    this.timer && clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.repool()
    }, 6000)
  },
  destroyed() {
    this.timer && clearTimeout(this.timer)
    this.timer = null
  },
  methods: {
    async repool() {
      await this.getStates()
      this.timer = setTimeout(() => {
        this.repool()
      }, 5000)
    },
    async getStates() {
      const { $axios, $store } = this
      const { signs, proposals } = await validatorStats({ $axios, $store }, this.entityAddress)
      // console.log('signs', signs)
      this.signsStates = signs
      this.proposalsStates = proposals
    },
    async goto(pageNumber) {
      const { $axios, $store } = this
      const { list, totalSize } = await getBlockByProposer({ $axios, $store }, this.entityAddress, this.blockListSizer, pageNumber)
      this.blockList = list
      this.totalBlockListSize = totalSize
      this.blockListPage = pageNumber
    },
    async gotoEvents(pageNumber) {
      const { $axios, $store } = this
      const { list, totalSize } = await getEventsByProposer({ $axios, $store }, this.entityAddress, this.eventListSizer, pageNumber)
      this.evensList = list
      // console.log('evensList', list)
      this.totalEventListSize = totalSize
      this.eventListPage = pageNumber
    },
    async gotoDelegators(pageNumber) {
      const { $axios, $store } = this
      const { list, totalSize } = await getDelegatorsByProposer({ $axios, $store }, this.entityAddress, this.eventListSizer, pageNumber)
      this.delegatorsList = list
      // console.log('delegatorsList', list)
      this.totalDelegatorSize = totalSize
      this.delegatorListPage = pageNumber
    },
    showAmountShare(amountShare, add) {
      if (add) {
        return '+' + amountShare
      } else {
        return '-' + amountShare
      }
    },
    positiveStyle(add) {
      if (add) {
        return 'positive'
      } else {
        return 'negative'
      }
    }
  }
}
</script>

<style scoped lang="scss">
#validatorInfo {
  .top {
    margin-bottom: rem(20);
    .ivu-col {
      > * {
        height: rem(400);
      }
    }
  }
  .center-chart {
    margin-bottom: rem(20);
    .ivu-col {
      > * {
        height: rem(260);
      }
    }
  }
  .center-block {
    margin-bottom: rem(20);
    .ivu-col {
      > * {
        height: rem(170);
      }
    }
  }
  .bottom-table-top {
    margin-bottom: rem(20);
    .ivu-col {
      > * {
        height: rem(490);
      }
    }
  }
  .bottom-table-bot {
    margin-bottom: rem(20);
    .ivu-col {
      > * {
        height: rem(490);
      }
    }
  }
}
</style>
