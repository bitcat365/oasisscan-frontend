<template>
  <div id="validatorInfo">
    <Head title="VALIDATOR INFO"></Head>
    <Row class="top">
      <Panel>
        <Detail :detailData="detailData" />
      </Panel>
    </Row>
    <Row :gutter="20" class="center-chart">
      <Col span="12">
        <Panel title="Escrow Status">
          <pie-chart v-if="pieDataZero" :data="[0, parseFloat(this.escrowAmountStatus.self), parseFloat(this.escrowAmountStatus.other)]" :descList="descList" :colors="['#026AA2', '#B692F6', '#36BFFA80']"></pie-chart>
        </Panel>
      </Col>
      <Col span="12">
        <Panel title="Escrow Trend">
          <trend-chart v-if="escrowTrendData && escrowTrendData.length > 0" :trends="escrowTrendData"></trend-chart>
        </Panel>
      </Col>
    </Row>
    <Row :gutter="20" class="center-block">
      <Col span="12">
        <Panel title="Signature Blocks">
          <Kuai v-if="signsStates && signsStates.length > 0" :list="signsStates"></Kuai>
        </Panel>
      </Col>
      <Col span="12">
        <Panel title="Signature Efficiency">
          <bar-chart v-if="stats && stats.length > 0"  :data="stats" :time="statsTime"></bar-chart>
        </Panel>
      </Col>
    </Row>
    <Row :gutter="20" class="bottom-table-top">
      <Col span="12">
        <Panel title="Delegators">
          <BlockTable :loading="loading1" :data="delegatorsList" :columns="columns1" :expand="false">
            <template v-slot:amount="{ data }">
              <span>Amount</span>
              <span class="gray">/ Shares</span>
            </template>
            <template v-slot:amountAndShares="slotData">
              <span>{{ slotData.data.amount }}</span>
              <span class="gray">/ {{ slotData.data.shares }}</span>
            </template>
            <template v-slot:address="{ data }">
              <router-link :to="data.link">{{ data.text | hashFormat(data.sliceLength) }}</router-link>
              <span v-if="data.text === entityAddress" class="self">Self</span>
            </template>
          </BlockTable>
          <Page slot="footer" type="simple" :sizer="eventListSizer" :records-count="totalDelegatorSize" :page="delegatorListPage" @goto="gotoDelegators" />
        </Panel>
      </Col>
      <Col span="12">
        <Panel title="Escrow Events">
          <BlockTable :loading="loading2" :data="evensList" :columns="columns2">
            <template v-slot:amount="{ data }">
              <span>Amount</span>
              <span class="gray">/ Shares</span>
            </template>
            <template v-slot:amountAndShares="slotData">
              <span :class="positiveStyle(slotData.data.add)">{{ showAmountShare(slotData.data.amount, slotData.data.add) }}</span>
              <span :class="positiveStyle(slotData.data.add, 'light')">/ {{ showAmountShare(slotData.data.shares, slotData.data.add) }}</span>
            </template>
          </BlockTable>
          <Page slot="footer" type="simple" :sizer="eventListSizer" :records-count="totalEventListSize" :page="eventListPage" @goto="gotoEvents" />
        </Panel>
      </Col>
    </Row>
    <Row :gutter="20" class="bottom-table-bot">
      <Col span="12">
        <Panel title="Proposed Blocks">
          <BlockTable :loading="loading3" :columns="blockListColumns" :data="blockList"> </BlockTable>
          <Page slot="footer" type="simple" :sizer="blockListSizer" :records-count="totalBlockListSize" :page="blockListPage" @goto="goto" />
        </Panel>
      </Col>
      <Col span="12">
        <Panel title="Votes">
          <BlockTable :loading="loading4" :columns="votesColumns" :data="votesList"> </BlockTable>
          <Page slot="footer" type="simple" :sizer="votesListSizer" :records-count="votesListSize" :page="votesListPage" @goto="gotoVotes" />
        </Panel>
      </Col>
    </Row>
  </div>
</template>

<script>
import Head from '~/components/Head'
import Panel from '../../../components/panel/Panel'
import BlockTable from '../../../components/Table/index'
import Page from '../../../components/Page'
import Detail from '../../../components/validator/detail'
import PieChart from '../../../components/charts/piechart'
import TrendChart from '../../../components/validator/trendchart'
import BarChart from '../../../components/validator/barchart'
import Kuai from '../../../components/validator/kuai'
import { getDelegatorsByProposer, getEventsByProposer, fetchValidatorDetail, getBlockByProposer,fetchVotes, validatorStats, fetchEscrowTrendByAddress,signsStats } from '../../../fetch'
import Config from '../../../config'
import { percent, readable } from '~/utils'
export default {
  name: 'validatorDetail',
  components: {
    Head,
    BlockTable,
    Panel,
    Page,
    Detail,
    PieChart,
    TrendChart,
    BarChart,
    Kuai
  },
  async asyncData({ $axios, store: $store, params }) {
    const entityAddress = decodeURIComponent(params.id)
    const data = await Promise.all([fetchValidatorDetail({ $axios, $store }, entityAddress), fetchEscrowTrendByAddress({ $axios, $store }, entityAddress)])
    const { escrowAmountStatus, escrowSharesStatus, ...other } = data[0]
    const detailData = { ...other, entityAddress: entityAddress }
    const { escrowTrendData } = data[1]
    const { list: blockList, totalSize: totalBlockListSize } = await getBlockByProposer({ $axios, $store }, entityAddress)
    const { list: votesList, totalSize: votesListSize } = await fetchVotes({ $axios, $store }, entityAddress)
     const { stats, time: statsTime } = await signsStats({ $axios, $store }, entityAddress)
    const res = {
      entityAddress,
      escrowAmountStatus,
      escrowSharesStatus,
      detailData,
      blockList,
      votesList,
      totalBlockListSize,
      votesListSize,
      escrowTrendData,
      signsList: [],
      proposalsList: [],
      blockInfo: {},
      stats,
      statsTime
    }
    return res
  },
  data() {
    return {
      editURL: Config.editURL,
      votesListSizer: 5,
      blockListSizer: 5,
      eventListSizer: 5,
      votesListPage:1,
      blockListPage: 1,
      delegatorListPage: 1,
      eventListPage: 1,
      totalDelegatorSize: 0,
      totalEventListSize: 0,
      delegatorsList: [],
      evensList: [],
      signsStates: [],
      blockListColumns: [
        {
          title: 'Height',
          key: 'height'
        },
        {
          title: 'Block Hash',
          key: 'hash',
          width: '40%'
        },
        {
          title: 'Time',
          key: 'timestamp',
          textAlign: 'right'
        }
      ],
      votesColumns: [
        {
          title: 'ID',
          key: 'proposalId'
        },
        {
          title: 'Title',
          key: 'voter',
          width: '40%'
        },
        {
          title: 'Answer',
          key: 'vote',
          textAlign: 'right'
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
          titleSlot: 'amount',
          key: 'amountAndShares',
          slot: true
        },
        {
          title: 'Percentage',
          key: 'percent',
          textAlign: 'right',
          width: '20%'
        }
      ],
      columns2: [
        {
          title: 'Tx Hash',
          key: 'txHash'
        },
        {
          titleSlot: 'amount',
          key: 'amountAndShares',
          slot: true
        },
        {
          title: 'Time',
          key: 'timestamp',
          textAlign: 'right',
          width: '20%'
        }
      ],
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false
    }
  },
  computed: {
    descList() {
      const escrowAmountStatus = this.escrowAmountStatus
      const escrowSharesStatus = this.escrowSharesStatus
      let list = [
        {
          title: 'Total Escrow',
          content: readable(Number(escrowAmountStatus.total).toFixed(0)) + ' ROSE',
          content1: '/ ' + readable(Number(escrowSharesStatus.total).toFixed(0)) + ' Shares'
        },
        {
          title: 'Self (' + percent(escrowAmountStatus.self / escrowAmountStatus.total, 1) + ')',
          content: readable(Number(escrowAmountStatus.self).toFixed(0)) + ' ROSE',
          content1: '/ ' + readable(Number(escrowSharesStatus.self).toFixed(0)) + ' Shares'
        },
        {
          title: 'Other (' + percent(escrowAmountStatus.other / escrowAmountStatus.total, 1) + ')',
          content: readable(Number(escrowAmountStatus.other).toFixed(0)) + ' ROSE',
          content1: '/ ' + readable(Number(escrowSharesStatus.other).toFixed(0)) + ' Shares'
        }
      ]
      return list
    },
    pieDataZero() {
     const escrowAmountStatus = this.escrowAmountStatus
      const escrowSharesStatus = this.escrowSharesStatus
      if (escrowAmountStatus === 0 && escrowSharesStatus === 0) {
        return false;
      } else {
        return true;
      }
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
      // this.proposalsStates = proposals
    },
    async gotoVotes(pageNumber) {
      const { $axios, $store } = this
      this.loading4 = true
      const { list, totalSize } = await fetchVotes({ $axios, $store }, this.entityAddress, this.votesListSizer, pageNumber)
      this.loading4 = false
      this.votesList = list
      this.votesListSize = totalSize
      this.votesListPage = pageNumber
    },
    async goto(pageNumber) {
      const { $axios, $store } = this
      this.loading3 = true
      const { list, totalSize } = await getBlockByProposer({ $axios, $store }, this.entityAddress, this.blockListSizer, pageNumber)
      this.loading3 = false
      this.blockList = list
      this.totalBlockListSize = totalSize
      this.blockListPage = pageNumber
    },
    async gotoEvents(pageNumber) {
      const { $axios, $store } = this
      this.loading2 = true
      const { list, totalSize } = await getEventsByProposer({ $axios, $store }, this.entityAddress, this.eventListSizer, pageNumber)
      this.loading2 = false
      this.evensList = list
      // console.log('evensList', list)
      this.totalEventListSize = totalSize
      this.eventListPage = pageNumber
    },
    async gotoDelegators(pageNumber) {
      const { $axios, $store } = this
      this.loading1 = true
      const { list, totalSize } = await getDelegatorsByProposer({ $axios, $store }, this.entityAddress, this.eventListSizer, pageNumber)
      this.loading1 = false
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
    positiveStyle(add, light) {
      if (add) {
        return light ? 'success1' : 'success'
      } else {
        return light ? 'error1' : 'error'
      }
    }
  }
}
</script>

<style scoped lang="scss">
#validatorInfo {
  .success {
    color: $success500;
  }
  .success1 {
    color: $success400;
  }
  .error {
    color: $error500;
  }
  .error1 {
    color: $error400;
  }
  .gray {
    color: $gray400;
  }
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
      .self {
        display: inline-block;
        width: rem(34);
        height: rem(20);
        line-height: rem(20);
        text-align: center;
        border-radius: rem(4);
        background-color: $gray300;
        color: #fff;
      }
    }
  }
  .bottom-table-bot {
    .ivu-col {
      > * {
        height: rem(490);
      }
    }
  }
}
</style>
