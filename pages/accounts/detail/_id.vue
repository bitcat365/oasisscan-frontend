<template>
  <div id="accountInfo">
    <Head title="ACCOUNT INFO"></Head>
    <Row class="top">
      <Col>
        <panel>
          <div class="topDesc">
            <Description :list="descriptionList" class="info-list">
              <div slot="address" class="address">
                <span>{{ data.address }}</span>
                <span class="copy-con" v-clipboard:copy="data.address" v-clipboard:success="onCopy">
                  <SvgIcon className="svgIcon" iconName="copy" />
                </span>
                <div class="QRcode">
                  <SvgIcon className="svgIcon" iconName="QRcode" @mousemove="creatQrCode" />
                  <div class="QRcodeImg" id="qrCode" ref="qrCode"></div>
                </div>
              </div>
            </Description>
            <pie-chart :data="[parseFloat(data.available), parseFloat(data.escrow), parseFloat(data.debonding)]" :descList="descList" :colors="['#B692F6', '#36BFFA80', '#016AA3']"> </pie-chart>
          </div>
        </panel>
      </Col>
    </Row>
    <!-- <Row :gutter="20" class="center-chart">
      <Col span="12">
        <panel title="Assets">
          <pie-chart :data="[parseFloat(data.available), parseFloat(data.escrow), parseFloat(data.debonding)]" :descList="descList" :colors="['#B692F6', '#36BFFA80', '#016AA3']"> </pie-chart>
        </panel>
      </Col>
      <Col span="12">
        <panel title="Reward History">
          柱状图
        </panel>
      </Col>
    </Row> -->
    <Row :gutter="20" class="bottom-table-top">
      <Col span="12">
        <Panel title="Escrow">
          <div class="tag-con" slot="headerRight">
            <div :class="['type', currentEscrowType === EscrowTypes.active ? 'sel' : '']" @click="changeEscrowListType(EscrowTypes.active)">Active</div>
            <div :class="['type', currentEscrowType === EscrowTypes.debonding ? 'sel' : '']" @click="changeEscrowListType(EscrowTypes.debonding)">Reclaim</div>
            <!-- <div :class="['type', currentEscrowType === EscrowTypes.reward ? 'sel' : '']" @click="changeEscrowListType(EscrowTypes.reward)">Reward</div> -->
          </div>
          <template v-if="currentEscrowType === EscrowTypes.active">
            <BlockTable :loading="loading1" :data="delegationsList" :columns="columns1" :expand="false" />
            <Page slot="footer" type="simple" :sizer="delegationsListSizer" :records-count="totalDelegationsSize" :page="delegationsListPage" @goto="gotoDelegations" />
          </template>
          <template v-else>
            <BlockTable :loading="loading1" :data="debondingsList" :columns="columns2" :expand="false" class="blockTable"> </BlockTable>
            <Page slot="footer" type="simple" :sizer="debondingsListSizer" :records-count="totalDebondingsSize" :page="debondingsListPage" @goto="gotoDeboundings" />
          </template>
        </Panel>
      </Col>
      <Col span="12">
        <Panel title="Events">
          <BlockTable :loading="loading2" :data="eventList" :columns="eventListSchema" :expand="false" />
          <Page slot="footer" type="simple" :sizer="eventSizer" :records-count="eventTotal" :page="eventPage" @goto="gotoEvents" />
        </Panel>
      </Col>
    </Row>
    <Row :gutter="20" class="bottom-table-bot">
      <Col span="24">
        <Panel title="Transactions">
          <div class="tag-con" slot="headerRight">
            <div :class="['type', currentTxListType === ListTypes.consensus ? 'sel' : '']" @click="changeTxListType(ListTypes.consensus)">Consensus</div>
            <div :class="['type', currentTxListType === ListTypes.paratime ? 'sel' : '']" @click="changeTxListType(ListTypes.paratime)">Paratime</div>
          </div>
          <div v-if="currentTxListType === ListTypes.consensus">
            <BlockTable :loading="loading3" :data="list" :columns="columns">
              <template v-slot:fee="{ data }">
                <span v-if="data">{{ data | unit(isTest) }}</span>
                <span v-else>0</span>
              </template>
              <template v-slot:status="{ data }">
                <ColourDiv :color="data ? 'success' : 'error'">{{ data ? 'Success' : 'Fail' }}</ColourDiv>
              </template>
            </BlockTable>
            <Page type="simple" :sizer="sizer" :records-count="total" :page="page" @goto="goto"></Page>
          </div>
          <div v-else-if="currentTxListType === ListTypes.paratime">
            <BlockTable :loading="loading3" :data="runtimeList" :columns="runtimeColumns">
              <template v-slot:status="{ data }">
                <ColourDiv :color="data ? 'success' : 'error'">{{ data ? 'Success' : 'Fail' }}</ColourDiv>
              </template>
            </BlockTable>
            <Page type="simple" :sizer="runtimeSizer" :records-count="runtimeTotal" :page="runtimePage" @goto="runTimeGoto"></Page>
          </div>
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
import Description from '~/components/description/index.vue'
import PieChart from '../../../components/charts/piechart'
import ColourDiv from '~/components/colourDiv/colourDiv'
import { percent, readable } from '~/utils'
import { fetchAccountDetail, fetchAccountDebonding, fetchAccountDelegations, fetchTransactions, fetchRuntimeTransactions, fetchEventsTransactions } from '../../../fetch/index'
const ListTypes = {
  consensus: 'consensus',
  paratime: 'paratime'
}

const EscrowTypes = {
  active: 'active',
  debonding: 'debonding',
  reward: 'reward'
}
export default {
  name: 'accountDetail',
  components: { Head, PieChart, Panel, Description, BlockTable, Page, ColourDiv },
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
  created(){
    this.$Spin.hide()
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
      totalDebondingsSize: 0,
      debondingsListPage: 1,
      columns1: [
        {
          title: 'Validator',
          key: 'validatorName'
        },
        {
          title: 'Shares',
          key: 'shares'
        },
        {
          title: 'Amount',
          key: 'amount',
          textAlign: 'right'
        }
      ],
      columns2: [
        {
          title: 'Validator',
          key: 'validatorName'
        },
        {
          title: 'Shares',
          key: 'shares'
        },
        {
          title: 'Unlock Epoch',
          key: 'debondEnd',
          textAlign: 'right',
          iconName: 'question'
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
          key: 'type',
          textAlign: 'right'
        }
      ],
      eventList: null,
      eventTotal: 0,
      eventSizer: 5,
      eventPage: 1,
      debondingsList: [],
      list: [],
      total: 0,
      sizer: 5,
      page: 1,
      runtimeList: [],
      runtimeTotal: 0,
      runtimeSizer: 5,
      runtimePage: 1,
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
          slot: true,
          textAlign: 'center'
        },
        {
          title: 'Time',
          key: 'timestamp',
          textAlign: 'right'
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
      ],
      qrcode: {},
      loading1: false,
      loading2: false,
      loading3: false
    }
  },
  computed: {
    descriptionList() {
      const list = [
        { title: 'Address', name: 'address' },
        // {
        //   title: 'Entity ID',
        //   content: '?'
        // },
        {
          title: 'Total Balance',
          content: readable(this.data.total) + ' ROSE' || ''
        },
        {
          title: 'Available',
          content: readable(this.data.available) || ''
        },
        {
          title: 'Escrow',
          content: readable(this.data.escrow) || ''
        },
        {
          title: 'Reclaim',
          content: readable(this.data.debonding) || ''
        },
        {
          title: 'Nonce',
          content: readable(this.data.nonce) || ''
        }
      ]
      return list
    },
    descList() {
      let data = this.data
      let list = [
        {
          title: 'Available (' + percent(data.available / data.total, 1) + ')',
          content: readable(Number(data.available).toFixed(0)) + ' ROSE'
        },
        {
          title: 'Escrow (' + percent(data.escrow / data.total, 1) + ')',
          content: readable(Number(data.escrow).toFixed(0)) + ' ROSE'
        },
        {
          title: 'Reclaim (' + percent(data.debonding / data.total, 1) + ')',
          content: readable(Number(data.debonding).toFixed(0)) + ' ROSE'
        }
      ]
      return list
    }
  },
  async mounted() {
    await this.fetchList()
    console.log('data', this.data)
  },
  methods: {
    async changeEscrowListType(type) {
      this.currentEscrowType = type
      if (type === EscrowTypes.active) {
        if (this.list.length === 0) {
          await this.gotoDelegations(1)
        }
      } else {
        if (this.debondingsList.length === 0) {
          await this.gotoDeboundings(1)
        }
      }
    },
    async changeTxListType(type) {
      this.currentTxListType = type
      if (type === ListTypes.consensus) {
        if (this.delegationsList.length === 0) {
          await this.goto(1)
        }
      } else {
        if (this.debondingsList.length === 0) {
          await this.runTimeGoto(1)
        }
      }
    },
    onCopy() {
      this.$toast.top('Copied')
    },
    creatQrCode() {
      if (Object.keys(this.qrcode).length === 0) {
        this.qrcode = new this.$QRCode(this.$refs.qrCode, {
          text: this.data.address,
          width: 200,
          height: 200,
          colorDark: '#1849A9',
          colorLight: '#ffffff',
          correctLevel: this.$QRCode.CorrectLevel.L
        })
      }
    },
    async gotoEvents(pageNumber) {
      const $axios = this.$axios
      const $store = this.$store
      this.loading2 = true
      const { list, totalSize } = await fetchEventsTransactions({ $axios, $store }, this.accountAddress, pageNumber, this.eventSizer)
      this.loading2 = false
      this.eventList = list
      console.log('eventList', list)
      this.eventTotal = totalSize
      this.eventPage = pageNumber
    },
    async gotoDelegations(pageNumber) {
      const $axios = this.$axios
      const $store = this.$store
      this.loading1 = true
      const { list, totalSize } = await fetchAccountDelegations({ $axios, $store }, this.accountAddress, pageNumber, this.delegationsListSizer)
      this.loading1 = false
      this.delegationsList = list
      console.log('delegatorsList', list)
      this.totalDelegationsSize = totalSize
      this.delegationsListPage = pageNumber
    },
    async gotoDeboundings(pageNumber) {
      const $axios = this.$axios
      const $store = this.$store
      this.loading1 = true
      const { list, totalSize } = await fetchAccountDebonding({ $axios, $store }, this.accountAddress, pageNumber, this.debondingsListSizer)
      this.loading1 = false
      this.debondingsList = list
      console.log('debondingsList', list)
      this.totalDebondingsSize = totalSize
      this.debondingsListPage = pageNumber
    },
    async goto(pageNumber) {
      this.loading3 = true
      await this.fetchList(pageNumber)
      this.loading3 = false
    },
    async runTimeGoto(pageNumber) {
      this.loading3 = true
      await this.fetchList(pageNumber, true)
      this.loading3 = false
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
@import '~@/assets/css/utils';
#accountInfo {
  .top {
    margin-bottom: rem(20);
    .info-list {
      padding: 0 rem(10);
    }
    .topDesc {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .ivu-col {
      .address {
        display: flex;
        align-items: center;
        .copy-con {
          line-height: 1;
        }
        .QRcode {
          line-height: 1;
          position: relative;
          .QRcodeImg {
            display: none;
            position: absolute;
            top: 0;
            left: rem(40);
          }
        }
        .QRcode:hover{
          .QRcodeImg {
            display: block;
          }
        }
        .svgIcon {
          width: rem(30);
          height: rem(30);
          cursor: pointer;
        }
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
    .ivu-col {
      > * {
        // height: rem(490);
      }
    }
  }
  .tag-con {
    display: flex;
    flex-direction: row;
    .type {
      display: flex;
      align-items: center;
      text-align: center;
      height: rem(28);
      font-size: rem(14);
      padding: 0 0.75rem;
      border: 1px solid $gray200;
      border-radius: rem(8);
      color: $gray500;
      margin-left: rem(8);
      cursor: pointer;
      background-color: white;
      &.sel {
        color: white;
        background-color: $theme-color;
      }
      &:first-child {
        margin-left: 0;
      }
    }
  }
  .blockTable {
    /deep/.header-title{
      justify-content: end;
    }
    /deep/.question {
      cursor: pointer;
      position: relative;
      &:hover::before {
        position: absolute;
        top: -1.5rem;
        left: -6rem;
        content: '1 epoch estimate take 1 hour';
        @extend .hoverText;
      }
    }
  }
}
</style>
