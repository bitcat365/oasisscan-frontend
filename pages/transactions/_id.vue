<template>
  <div class="root">
    <nav-bar :active="4" />
    <div class="page-container container">
      <div class="title">
        <h1>TRANSACTION DETAILS</h1>
      </div>
      <panel>
        <template v-slot:header>
          <span>Overview</span>
        </template>
        <v-table class="v-table" :headers="listSchema" :data="data"></v-table>
      </panel>
      <panel class="trx-panel">
        <template v-slot:header>
          <span>{{data.method}}</span>
        </template>
        <v-table  v-if="data.method === 'staking.Transfer'" class="v-table" :headers="fromToSchema" :data="data"></v-table>
        <div class="raw-data" v-else>
          <pre> {{data.raw | pretty}}</pre>
        </div>
      </panel>
    </div>
  </div>
</template>

<script>
  import Panel from '../../components/Panel'
  import VTable from '../../components/VTable/index'
  import NavBar from '../../components/NavigationBar'
  import { fetchTransactionDetail } from '~/fetch/index'

  export default {
    name: 'transactionDetail',
    components: { NavBar, Panel, VTable},
    async asyncData({ $axios, params }) {
      const data = await fetchTransactionDetail($axios, params.id)
      return {
        data
      }
    },
    data() {
      return {
        listSchema: [
          {
            label: 'TxHash',
            key: 'txHash'
          },
          {
            label: 'Time',
            key: 'timestamp'
          },
          {
            label: 'Height',
            key: 'height'
          },
          {
            label: 'Fee',
            key: 'fee'
          },
          {
            label: 'Nonce',
            key: 'nonce'
          }
        ],
        list: [],
        fromToSchema: [
          {
            label: 'From',
            key: 'txHash'
          },
          {
            label: 'To',
            key: 'to'
          },
          {
            label: 'Amount',
            key: 'amount'
          }
        ]
      }
    },
    async mounted() {
    },
    methods: {
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
