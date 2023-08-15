<template>
  <div id="accountInfo">
    <Head title="ACCOUNT INFO"></Head>
    <Row class="top">
      <Col>
        <panel>
          <VTable class="v-table" :headers="listSchema" :data="data">
            <template v-slot:address="slotData">
              <div class="address-item">
                <emoji :amount="slotData.data.total" />
                <span>{{ slotData.data.address }}</span> <span class="copy-con" v-clipboard:copy="slotData.data.address" v-clipboard:success="onCopy"> <img class="copy-icon" src="../../../assets/copy.svg"/></span>
              </div>
            </template>
            <template v-slot:total="{ data }">
              <span>{{ data | unit(isTest) }}</span>
            </template>
          </VTable>
        </panel>
      </Col>
    </Row>
    <Row :gutter="20" class="center-chart">
      <Col span="12">
        <panel title="Assets">
          <pie-chart :data="data"></pie-chart>
        </panel>
      </Col>
      <Col span="12">
        <panel title="Reward History">
          柱状图
        </panel>
      </Col>
    </Row>
    <Row :gutter="20" class="bottom-table-top">
      <Col span="12">
        <panel title="Escrow">
          <div v-if="currentEscrowType === EscrowTypes.active && !isEscrowRequesting">
            <p v-if="delegationsList && delegationsList.length === 0" class="no-result">
              <img class="empty-icon_s" src="../../../assets/empty.svg" />
              No Escrow
            </p>
            <BlockTable v-if="delegationsList && delegationsList.length > 0" :data="delegationsList" :columns="columns1" :expand="false" class="block-total-list  delegator-table" cell-class="block-total-list-cell" />
            <Page v-if="delegationsList && delegationsList.length > 0" type="simple" :sizer="delegationsListSizer" :records-count="totalDelegationsSize" :page="delegationsListPage" root-class="block-page" @goto="gotoDelegations" />
          </div>
          <div v-else-if="!isEscrowRequesting">
            <p v-if="debondingsList && debondingsList.length === 0" class="no-result">
              <img class="empty-icon_s" src="../../../assets/empty.svg" />
              No Debonding
            </p>
            <BlockTable v-if="debondingsList && debondingsList.length > 0" :data="debondingsList" :columns="columns2" :expand="false" class="block-total-list  delegator-table" cell-class="block-total-list-cell"> </BlockTable>
            <Page v-if="debondingsList && debondingsList.length > 0" type="simple" :sizer="debondingsListSizer" :records-count="totalDebondingsSize" :page="debondingsListPage" root-class="block-page" @goto="gotoDeboundings" />
          </div>
          <div v-if="isEscrowRequesting" class="escrow-loader-con">
            <loader />
          </div>
        </panel>
      </Col>
      <Col span="12">
        <panel title="Event">
          <p v-if="eventList && eventList.length === 0" class="no-result">
            <img class="empty-icon_s" src="../../../assets/empty.svg" />
            No Event
          </p>
          <BlockTable v-if="eventList && eventList.length > 0" :data="eventList" :columns="eventListSchema" :expand="false" class="block-total-list  delegator-table" cell-class="block-total-list-cell" />
          <Page v-if="eventList && eventList.length > 0" type="simple" :sizer="eventSizer" :records-count="eventTotal" :page="eventPage" root-class="block-page" @goto="gotoEvents" />
        </panel>
      </Col>
    </Row>
    <Row :gutter="20" class="bottom-table-bot">
      <Col span="24">
        <panel title="Transactions">
          <div v-if="currentTxListType === ListTypes.consensus && !isRequesting">
            <p v-if="total === 0" class="no-result">
              <img class="empty-icon" src="../../../assets/empty.svg" />
              {{ $t('noTx') }}
            </p>
            <BlockTable v-if="total > 0" :data="list" :columns="columns" root-class="block-total-list" cell-class="block-total-list-cell">
              <template v-slot:fee="{ data }">
                <span v-if="data">{{ data | unit(isTest) }}</span>
                <span v-else>0</span>
              </template>
              <template v-slot:status="{ data }">
                <div class="status-item green" v-if="data">Success</div>
                <div class="status-item red" v-else>Fail</div>
              </template>
            </BlockTable>
            <Page type="simple" v-if="total > 0" :sizer="sizer" :records-count="total" :page="page" root-class="block-page" @goto="goto"></Page>
          </div>
          <div v-else-if="currentTxListType === ListTypes.paratime && !isRequesting">
            <p v-if="runtimeTotal === 0 && !isRequesting" class="no-result">
              <img class="empty-icon" src="../../../assets/empty.svg" />
              {{ $t('noTx') }}
            </p>
            <BlockTable v-if="runtimeTotal > 0" :data="runtimeList" :columns="runtimeColumns" root-class="block-total-list" cell-class="block-total-list-cell">
              <template v-slot:status="{ data }">
                <div class="status-item green" v-if="data">Success</div>
                <div class="status-item red" v-else>Fail</div>
              </template>
            </BlockTable>
            <Page type="simple" v-if="runtimeTotal > 0" :sizer="runtimeSizer" :records-count="runtimeTotal" :page="runtimePage" root-class="block-page" @goto="runTimeGoto"></Page>
          </div>
          <div v-if="isRequesting" class="loader-con">
            <Loader />
          </div>
        </panel>
      </Col>
    </Row>
  </div>
</template>

<script>
import Head from '~/components/Head'
import Panel from '../../../components/panel/Panel'
import BlockTable from '../../../components/Table/index'
import Page from '../../../components/Page'
import VTable from '../../../components/VTable/index'
import Emoji from '../../../components/emoji'
import PieChart from '../../../components/accounts/piechart'
import Loader from '../../../components/Loader'
import { fetchAccountDetail, fetchAccountDebonding, fetchAccountDelegations, fetchTransactions, fetchRuntimeTransactions, fetchEventsTransactions } from '../../../fetch/index'
const ListTypes = {
  consensus: 'consensus',
  paratime: 'paratime'
}

const EscrowTypes = {
  active: 'active',
  debonding: 'debonding'
}
export default {
  name: 'accountDetail',
  components: { Head, PieChart, Panel, VTable, BlockTable, Page, Emoji, Loader },
  async asyncData({ $axios, store: $store, params }) {
    const datas = await Promise.all([fetchAccountDetail({ $axios, $store }, params.id), fetchAccountDelegations({ $axios, $store }, params.id), fetchEventsTransactions({ $axios, $store }, params.id)])
    const data = await datas[0]
    const { list: delegationsList, totalSize: totalDelegationsSize } = await datas[1]
    const { list: eventList, totalSize: eventTotal } = await datas[2]
    console.log(delegationsList, 'delegationsList')
    console.log(eventList, 'eventList')
    console.log(eventTotal, 'eventTotal')
    console.log(totalDelegationsSize, 'totalDelegationsSize')
    return {
      eventList,
      eventTotal,
      totalDelegationsSize,
      accountAddress: params.id,
      data,
      delegationsList
    }
  },
  data() {
    return {
      ListTypes,
      EscrowTypes,
      currentTxListType: ListTypes.consensus,
      currentEscrowType: EscrowTypes.active,
      delegationsListSizer: 5,
      delegationsListPage: 1,
      debondingsListSizer: 5,
      debondingsListPage: 1,
      columns1: [
        {
          title: 'Validator/Account',
          key: 'validatorName'
        },
        {
          title: 'Shares',
          key: 'shares'
        },
        {
          title: 'Amount',
          key: 'amount'
        }
      ],
      columns2: [
        {
          title: 'Validator/Account',
          key: 'validatorName'
        },
        {
          title: 'Shares',
          key: 'shares'
        },
        {
          title: 'Due Epoch',
          key: 'debondEnd'
        }
      ],
      listSchema: [
        {
          label: 'Address',
          key: 'address',
          slot: true
        },
        {
          label: 'Entity ID',
          key: 'total'
        },
        {
          label: 'Total Balance',
          key: 'total',
          slot: true
        },
        {
          label: 'Available',
          key: 'available'
        },
        {
          label: 'Escrow',
          key: 'escrow'
        },
        {
          label: 'Debonding',
          key: 'debonding'
        },
        {
          label: 'Nonce',
          key: 'nonce'
        }
      ],
      eventListSchema: [
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
        }
      ],
      eventList: null,
      eventTotal: 0,
      eventSizer: 5,
      eventPage: 1,
      debondingsList: [],
      list: [],
      total: 0,
      sizer: 10,
      page: 1,
      runtimeList: [],
      runtimeTotal: 0,
      runtimeSizer: 10,
      runtimePage: 1,
      isRequesting: true,
      isEscrowRequesting: false,
      columns: [
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
          title: 'Fee',
          key: 'fee',
          slot: true
        },
        {
          title: 'Status',
          key: 'status',
          slot: true
        },
        {
          title: 'Time',
          key: 'timestamp'
        }
      ],
      runtimeColumns: [
        {
          title: 'Tx Hash',
          key: 'txHash'
        },
        {
          title: 'Round',
          key: 'round'
        },
        {
          title: 'Runtime Name',
          key: 'runtimeName'
        },
        {
          title: 'Type',
          key: 'type'
        },
        {
          title: 'Status',
          key: 'status',
          slot: true
        },
        {
          title: 'Time',
          key: 'timestamp'
        }
      ]
    }
  },
  async mounted() {
    await this.fetchList()
    this.isRequesting = false
    console.log('data', this.data)
  },
  methods: {
    async changeEscrowListType(type) {
      this.currentEscrowType = type
      if (type === EscrowTypes.active) {
        if (this.list.length === 0) {
          this.isEscrowRequesting = true
          await this.gotoDelegations(1)
          this.isEscrowRequesting = false
        }
      } else {
        if (this.debondingsList.length === 0) {
          this.isEscrowRequesting = true
          await this.gotoDeboundings(1)
          this.isEscrowRequesting = false
        }
      }
    },
    async changeTxListType(type) {
      this.currentTxListType = type
      if (type === ListTypes.consensus) {
        if (this.delegationsList.length === 0) {
          this.isRequesting = true
          await this.goto(1)
          this.isRequesting = false
        }
      } else {
        if (this.debondingsList.length === 0) {
          this.isRequesting = true
          await this.runTimeGoto(1)
          this.isRequesting = false
        }
      }
    },
    onCopy() {
      this.$toast.top('Copied')
    },
    async gotoEvents(pageNumber) {
      const $axios = this.$axios
      const $store = this.$store
      const { list, totalSize } = await fetchEventsTransactions({ $axios, $store }, this.accountAddress, pageNumber, this.eventSizer)
      this.eventList = list
      console.log('eventList', list)
      this.eventTotal = totalSize
      this.eventPage = pageNumber
    },
    async gotoDelegations(pageNumber) {
      const $axios = this.$axios
      const $store = this.$store
      const { list, totalSize } = await fetchAccountDelegations({ $axios, $store }, this.accountAddress, pageNumber, this.delegationsListSizer)
      this.delegationsList = list
      console.log('delegatorsList', list)
      this.totalDelegationsSize = totalSize
      this.delegationsListPage = pageNumber
    },
    async gotoDeboundings(pageNumber) {
      const $axios = this.$axios
      const $store = this.$store
      const { list, totalSize } = await fetchAccountDebonding({ $axios, $store }, this.accountAddress, pageNumber, this.debondingsListSizer)
      this.debondingsList = list
      console.log('delegatorsList', list)
      this.totalDebondingsSize = totalSize
      this.debondingsListPage = pageNumber
    },
    async goto(pageNumber) {
      await this.fetchList(pageNumber)
    },
    runTimeGoto(pageNumber) {
      return this.fetchList(pageNumber, true)
    },
    async fetchList(page = 1, runtime = false) {
      const $axios = this.$axios
      const $store = this.$store
      if (!runtime) {
        const { list, totalSize } = await fetchTransactions({ $axios, $store }, '', this.accountAddress, page, this.sizer, runtime)
        this.list = list
        this.total = totalSize
        this.page = page
      } else {
        const { list, totalSize } = await fetchRuntimeTransactions({ $axios, $store }, this.accountAddress, page, this.runtimeSizer)
        this.runtimeList = list
        this.runtimeTotal = totalSize
        this.runtimePage = page
      }
    }
  }
}
</script>

<style scoped lang="scss">
#accountInfo {
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
        // height: rem(490);
      }
    }
  }
  .v-table {
    margin-top: rem(16);
    .address-item {
      display: flex;
      align-items: center;
      .copy-con {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 0 rem(6);
        .copy-icon {
          width: rem(16);
          height: rem(16);
        }
      }
    }
  }
  .no-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-size: 14px;
    color: rgba(55, 65, 107, 1);
    padding: rem(80) 0;
    .empty-icon {
      width: rem(80);
      margin-bottom: rem(11);
    }
    .empty-icon_s {
      width: rem(50);
      margin-bottom: rem(11);
    }
  }
  .loader-con,
  .escrow-loader-con {
    padding: rem(80) 0;
    display: flex;
    justify-content: center;
  }
}
</style>
