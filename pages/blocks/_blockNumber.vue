<template>
  <div class="root">
    <nav-bar :active="4" />
    <div class="page-container container">
      <div class="title">
        <h1>BLOCK DETAILS</h1>
      </div>
      <panel>
        <template v-slot:header>
          <span>Header</span>
        </template>
        <v-table class="v-table" :headers="listSchema" :data="data"></v-table>
      </panel>
      <panel class="trx-panel" v-if="!isRequesting">
        <template v-slot:header>
          <span>Transactions</span>
        </template>
        <p v-if="total === 0" class="no-result">
          <img class="empty-icon" src="../../assets/empty.png">
          {{$t('noTx')}}
        </p>
        <block-table
          v-if="total > 0"
          :data="list"
          :columns="columns"
          root-class="block-total-list"
          cell-class="block-total-list-cell"
        />
        <div v-if="total > 0" class="page-navigation">
          <page :sizer="sizer" :records-count="total" :page="page" root-class="block-page" @goto="goto"></page>
        </div>
      </panel>
    </div>
  </div>
</template>

<script>
  import Panel from '../../components/Panel'
  import BlockTable from '../../components/Table/index'
  import Page from '../../components/Page'
  import VTable from '../../components/VTable/index'

  import NavBar from '../../components/NavigationBar'
  import { fetchBlockDetail, fetchTransactions } from '../../fetch';

  export default {
    name: 'blockDetail',
    components: { NavBar, Panel, BlockTable, Page, VTable },
    async asyncData({ $axios, params }) {
      const data = await fetchBlockDetail($axios, params.blockNumber)
      return {
        data
      }
    },
    data() {
      return {
        isRequesting: true,
        listSchema: [
          {
            label: 'Height',
            key: 'height'
          },
          {
            label: 'Epoch',
            key: 'epoch'
          },
          {
            label: 'Time',
            key: 'timestamp'
          },
          {
            label: 'Hash',
            key: 'hash'
          },
          {
            label: 'Transactions',
            key: 'txs'
          },
          {
            label: 'Proposer',
            key: 'proposer'
          }
        ],
        list: [],
        total: 0,
        sizer: 10,
        page: 1,
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
            key: 'fee'
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
    },
    methods: {
      goto(pageNumber) {
        this.fetchList(pageNumber)
      },
      async fetchList(page = 1) {
        const { list, totalSize } = await fetchTransactions(this.$axios, this.$route.params.blockNumber, '', page, this.sizer)
        this.list = list
        this.total = totalSize
        this.page = page
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/css/common";
  .root {
    background-color: #f7f7f7;
    padding-bottom: rem(50);
    min-height: calc(100vh - #{rem(100)});
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
  .trx-panel {
    margin-top: rem(12);
    .block-total-list {
      width: 100%;
      margin-left: 0;
    }
  }
  .page-navigation {
    padding-top: 30px;
    display: flex;
    justify-content: flex-end;
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
  }
</style>
