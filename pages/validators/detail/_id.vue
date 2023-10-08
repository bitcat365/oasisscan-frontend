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
          <pie-chart v-if="descList && descList.length > 0" :data="[parseFloat(this.escrowAmountStatus.self), parseFloat(this.escrowAmountStatus.other)]" :descList="descList" :colors="['#B692F6', '#36BFFA80']"></pie-chart>
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
        <Panel title="Signatures Blocks">
          <Kuai v-if="signsStates && signsStates.length > 0" :list="signsStates"></Kuai>
        </Panel>
      </Col>
      <Col span="12">
        <Panel title="Proposal Blocks">
          <Kuai v-if="proposalsStates && proposalsStates.length > 0" :list="proposalsStates"></Kuai>
        </Panel>
      </Col>
    </Row>
    <Row :gutter="20" class="bottom-table-top">
      <Col span="12">
        <Panel title="Delegators">
          <BlockTable :loading="loading1" :data="delegatorsList" :columns="columns1" :expand="false">
            <template v-slot:address="{ data }">
              <router-link :to="data.link">{{ data.text | hashFormat }}</router-link>
              <span v-if="data.text === entityAddress">(Self)</span>
            </template>
          </BlockTable>
          <Page slot="footer" type="simple" :sizer="eventListSizer" :records-count="totalDelegatorSize" :page="delegatorListPage" @goto="gotoDelegators" />
        </Panel>
      </Col>
      <Col span="12">
        <Panel title="Escrow Events">
          <BlockTable :loading="loading2" :data="evensList" :columns="columns2">
            <template v-slot:amountAndShares="slotData">
              <div class="amount-share" :class="positiveStyle(slotData.data.add)">
                {{ showAmountShare(slotData.data.value, slotData.data.add) }}
              </div>
            </template>
          </BlockTable>
          <Page slot="footer" type="simple" :sizer="eventListSizer" :records-count="totalEventListSize" :page="eventListPage" @goto="gotoEvents" />
        </Panel>
      </Col>
    </Row>
    <Row :gutter="20" class="bottom-table-bot">
      <!-- <Col span="12"> -->
      <Col span="24">
        <Panel title="Proposed Blocks">
          <BlockTable :loading="loading3" :columns="blockListColumns" :data="blockList"> </BlockTable>
          <Page slot="footer" type="simple" :sizer="blockListSizer" :records-count="totalBlockListSize" :page="blockListPage" @goto="goto" />
        </Panel>
      </Col>
      <!-- <Col span="12">
        <Panel title="Votes"></Panel>
      </Col> -->
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
import Kuai from '../../../components/validator/kuai'
import { getDelegatorsByProposer, getEventsByProposer, fetchValidatorDetail, getBlockByProposer, validatorStats, fetchEscrowTrendByAddress } from '../../../fetch'
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
    Kuai
  },
  async asyncData({ $axios, store: $store, params }) {
    const entityAddress = decodeURIComponent(params.id)
    const data = await Promise.all([fetchValidatorDetail({ $axios, $store }, entityAddress), fetchEscrowTrendByAddress({ $axios, $store }, entityAddress)])
    const { escrowAmountStatus, ...other } = data[0]
    const detailData = { ...other, entityAddress: entityAddress }
    const { list: escrowTrendData } = data[1]
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
      delegatorsList: [],
      evensList: [],
      signsStates: [],
      proposalsStates: [],
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
          key: 'percent',
          textAlign: 'right',
          width: '20%'
        }
      ],
      columns2: [
        {
          title: 'Height',
          key: 'height'
        },
        {
          title: 'Amount/Shares',
          key: 'amountAndShares',
          slot: true,
          width: '50%'
        },
        {
          title: 'Time',
          key: 'timestamp',
          textAlign: 'right'
        }
      ],
      loading1: false,
      loading2: false,
      loading3: false
    }
  },
  computed: {
    descList() {
      let data = this.escrowAmountStatus
      let list = [
        {
          title: 'Self (' + percent(data.self / data.total, 1) + ')',
          content: readable(data.self) + ' ROSE',
          content1: '/ ' + readable(data.self) + ' Shares'
        },
        {
          title: 'Other (' + percent(data.other / data.total, 1) + ')',
          content: readable(data.other) + ' ROSE',
          content1: '/ ' + readable(data.other) + ' Shares'
        }
      ]
      return list
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
    positiveStyle(add) {
      if (add) {
        return 'success'
      } else {
        return 'error'
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
  .error {
    color: $error500;
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
