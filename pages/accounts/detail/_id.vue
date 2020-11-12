<template>
  <div class="root">
    <nav-bar :active="3" />
    <div class="page-container container">
      <div class="title">
        <h1>ACCOUNT DETAILS</h1>
      </div>
      <panel>
        <template v-slot:header>
          <span>Overview</span>
        </template>
        <div class="overview-content">
          <v-table class="v-table" :headers="listSchema" :data="data">
            <template v-slot:address="slotData">
              <div class="address-item">
                <emoji :amount="slotData.data.total"/>
                <span>{{slotData.data.address}}</span> <span class="copy-con" v-clipboard:copy="slotData.data.address" v-clipboard:success="onCopy"> <img class="copy-icon" src="../../../assets/copy.svg"></span>
              </div>
            </template>
            <template v-slot:total="{data}">
              <span>{{data | unit(isTest)}}</span>
            </template>
          </v-table>
          <pie-chart :data="data"></pie-chart>
        </div>
      </panel>
      <div class="list-panels">
        <panel class="voters-panel">
          <template v-slot:header>
            <span>Escrow Active</span>
          </template>
          <p v-if="delegationsList && delegationsList.length === 0" class="no-result">
            <img class="empty-icon_s" src="../../../assets/empty.svg">
            No Escrow
          </p>
          <block-table
            v-if="delegationsList && delegationsList.length > 0"
            :data="delegationsList"
            :columns="columns1"
            :expand="false"
            class="block-total-list  delegator-table"
            cell-class="block-total-list-cell"
          />
          <div class="page-navigation">
            <page
              v-if="delegationsList && delegationsList.length > 0"
              type="simple"
              :sizer="delegationsListSizer"
              :records-count="totalDelegationsSize"
              :page="delegationsListPage"
              root-class="block-page"
              @goto="gotoDelegations"></page>
          </div>
        </panel>
        <panel class="voters-panel">
          <template v-slot:header>
            <span>Escrow Debonding</span>
          </template>
          <p v-if="debondingsList && debondingsList.length === 0" class="no-result">
            <img class="empty-icon_s" src="../../../assets/empty.svg">
            No Debonding
          </p>
          <block-table
            v-if="debondingsList && debondingsList.length > 0"
            :data="debondingsList"
            :columns="columns2"
            :expand="false"
            class="block-total-list  delegator-table"
            cell-class="block-total-list-cell"
          >

          </block-table>
          <div class="page-navigation">
            <page
              v-if="debondingsList && debondingsList.length > 0"
              type="simple"
              :sizer="debondingsListSizer"
              :records-count="totalDebondingsSize"
              :page="debondingsListPage"
              root-class="block-page"
              @goto="gotoDeboundings"></page>
          </div>
        </panel>
      </div>
      <panel class="trx-panel" v-if="!isRequesting">
        <template v-slot:header>
          <span>Transactions</span>
        </template>
        <p v-if="total === 0" class="no-result">
          <img class="empty-icon" src="../../../assets/empty.svg">
          {{$t('noTx')}}
        </p>
        <block-table
          v-if="total > 0"
          :data="list"
          :columns="columns"
          root-class="block-total-list"
          cell-class="block-total-list-cell"
        >
          <template v-slot:fee="{data}">
            <span v-if="data">{{data | unit(isTest)}}</span>
            <span v-else>0</span>
          </template>
        </block-table>
        <div v-if="total > 0" class="page-navigation">
          <page :sizer="sizer" :records-count="total" :page="page" root-class="block-page" @goto="goto"></page>
        </div>
      </panel>
    </div>
  </div>
</template>

<script>
  import Panel from '../../../components/Panel'
  import BlockTable from '../../../components/Table/index'
  import Page from '../../../components/Page'
  import VTable from '../../../components/VTable/index'
  import NavBar from '../../../components/NavigationBar'
  import Emoji from '../../../components/emoji'
  import PieChart from '../../../components/accounts/piechart'
  import { fetchAccountDetail, fetchAccountDebonding, fetchAccountDelegations, fetchTransactions } from '../../../fetch/index'

  export default {
    name: 'accountDetail',
    components: { PieChart, NavBar, Panel, VTable, BlockTable, Page, Emoji },
    async asyncData({ $axios, store: $store, params }) {
      const datas = await Promise.all([
        fetchAccountDetail({ $axios, $store }, params.id),
        fetchAccountDelegations({ $axios, $store }, params.id),
        fetchAccountDebonding({ $axios, $store }, params.id)
      ])
      const data = await datas[0]
      const { list: delegationsList, totalSize: totalDelegationsSize } = await datas[1]
      const { list: debondingsList, totalSize: totalDebondingsSize } = await datas[2]
      console.log(delegationsList,'delegationsList')
      console.log(debondingsList,'debondingsList')
      console.log(totalDebondingsSize,'totalDebondingsSize')
      console.log(totalDelegationsSize,'totalDelegationsSize')
      return {
        totalDebondingsSize,
        totalDelegationsSize,
        accountAddress: params.id,
        data,
        delegationsList,
        debondingsList
      }
    },
    data() {
      return {
        delegationsListSizer: 5,
        delegationsListPage: 1,
        debondingsListSizer: 5,
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
            key: 'amount'
          }
        ],
        columns2: [
          {
            title: 'Validator',
            key: 'validatorName'
          },
          {
            title: 'Amount',
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
        list: [],
        total: 0,
        sizer: 10,
        page: 1,
        isRequesting: true,
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
      onCopy() {
        this.$toast.top('Copied')
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
      goto(pageNumber) {
        this.fetchList(pageNumber)
      },
      async fetchList(page = 1) {
        const $axios = this.$axios
        const $store = this.$store
        const { list, totalSize } = await fetchTransactions({ $axios, $store }, '', this.accountAddress, page, this.sizer)
        this.list = list
        this.total = totalSize
        this.page = page
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/css/common";
  .trx-panel {
    margin-top: rem(12);
    .block-total-list {
      width: 100%;
      margin-left: 0;
    }
  }
  .overview-content{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .address-item {
    display: flex;
    align-items: center;
  }
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
  .root {
    background-color: #f7f7f7;
    padding-bottom: rem(50);
    min-height: calc(100vh - #{rem(100)});
  }
  .raw-data {
    background: #F8F9FA;
    border: 1px solid #B2B2B2;
    border-radius: rem(4);
    max-height: rem(400);
    overflow-y: scroll;
    padding: rem(15) rem(20);
    margin-top: rem(30);
    margin-left: rem(20);
    margin-right: rem(20);
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
  .v-table {
    margin-top: rem(16);
  }
  .container {
  }
  .title {
    padding-top: rem(20);
    padding-bottom: rem(20);
    display: flex;
    align-items: center;
    justify-content: space-between;
    h1 {
      font-size: rem(20);
      padding: 0;
      margin: 0;
      @include regular;;
      color: black;
      font-weight: normal;
      span {
        font-size: rem(14);
        color: rgba(0, 0, 0, 0.5);
      }
    }
  }
  .page-navigation {
    padding-top: rem(16);
    display: flex;
    justify-content: center;
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
  .list-panels {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: rem(12);
  }
  .voters-panel {
    width: rem(594);
    .block-total-list {
      width: 100%;
      margin-left: 0;
    }
    /deep/ {
      .panel-title {
        align-items: flex-end;
      }
      .panel-content{
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
        min-height: rem(272);
      }
    }
  }
</style>
