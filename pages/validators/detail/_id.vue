<template>
  <div id="validatorInfo">
    <Head title="VALIDATOR INFO"></Head>
    <Row class="top">
      <panel>
        <Detail :detailData="detailData" />
      </panel>
    </Row>
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
        <panel title="Delegators">
          <BlockTable v-if="delegatorsList && delegatorsList.length > 0" :data="delegatorsList" :columns="columns1" :expand="false" class="block-totasl-list  delegator-table" cell-class="block-total-list-cell">
            <template v-slot:address="{ data }">
              <a :href="data.link">{{ data.text | hashFormat }}</a>
              <span v-if="data.text === entityAddress">(Self)</span>
            </template>
          </BlockTable>
          <Page v-if="delegatorsList && delegatorsList.length > 0" type="simple" :sizer="eventListSizer" :records-count="totalDelegatorSize" :page="delegatorListPage" @goto="gotoDelegators" />
        </panel>
      </Col>
      <Col span="12">
        <panel title="Escrow Event">
          <BlockTable v-if="evensList && evensList.length > 0" :data="evensList" :columns="columns2" :expand="false" class="block-total-list events-list" cell-class="block-total-list-cell">
            <template v-slot:amountAndShares="slotData">
              <div class="amount-share" :class="positiveStyle(slotData.data.add)">
                {{ showAmountShare(slotData.data.value, slotData.data.add) }}
              </div>
            </template>
          </BlockTable>
          <Page v-if="evensList && evensList.length > 0" type="simple" :sizer="eventListSizer" :records-count="totalEventListSize" :page="eventListPage" root-class="block-page" @goto="gotoEvents" />
        </panel>
      </Col>
    </Row>
    <Row :gutter="20" class="bottom-table-bot">
      <Col span="12">
        <panel title="Proposed Blocks">
          <BlockTable class="block-total-list proposed-list" cell-class="block-total-list-cell" :columns="blockListColumns" :data="blockList"> </BlockTable>
          <Page type="simple" :sizer="blockListSizer" :records-count="totalBlockListSize" :page="blockListPage" root-class="block-page" @goto="goto" />
        </panel>
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
import Detail from '../../../components/validator/detail'
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
    Detail,
    PieChart,
    TrendChart,
    Kuai
  },
  async asyncData({ $axios, store: $store, params }) {
    const entityAddress = decodeURIComponent(params.id)
    const data = await Promise.all([fetchValidatorDetail({ $axios, $store }, entityAddress), fetchEscrowTrendByAddress({ $axios, $store }, entityAddress)])
    const { escrowAmountStatus, ...other } = data[0]
    const detailData = { ...other, entityAddress: entityAddress }
    const { list: escrowTrendData } = data[1]
    console.log('data 0', data[0])
    // console.log('escrowTrendData', escrowTrendData)
    // const { signs: signsList, proposals: proposalsList } = await fetchBlockList($axios, entityId)
    const { list: blockList, totalSize: totalBlockListSize } = await getBlockByProposer({ $axios, $store }, entityAddress)
    const res = {
      entityAddress,
      escrowAmountStatus,
      detailData,
      blockList,
      totalBlockListSize,
      escrowTrendData: [...escrowTrendData].reverse(),
      signsList: [],
      proposalsList: [],
      blockInfo: {}
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
.amount-share {
  &.positive {
    color: #00b538;
  }
  &.negative {
    color: #b60000;
  }
}
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
