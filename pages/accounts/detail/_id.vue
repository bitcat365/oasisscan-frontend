<template>
  <div class="root">
    <nav-bar :active="3" />
    <div class="page-container container">
      <div class="title">
        <h1>ACCOUNT DETIALS</h1>
      </div>
      <panel>
        <template v-slot:header>
          <span>Overview</span>
        </template>
        <v-table class="v-table" :headers="listSchema" :data="data">
          <template v-slot:address="slotData">
            <div class="address-item">
              <span>{{slotData.data}}</span> <span class="copy-con" v-clipboard="slotData.data"> <img class="copy-icon" src="../../../assets/copy.png"></span>
            </div>
          </template>
        </v-table>
      </panel>
      <panel class="trx-panel">

      </panel>
    </div>
  </div>
</template>

<script>
  import Panel from '../../../components/Panel'
  import VTable from '../../../components/VTable/index'
  import NavBar from '../../../components/NavigationBar'
  import { fetchAccountDetail } from '../../../fetch/index'

  export default {
    name: 'accountDetail',
    components: { NavBar, Panel, VTable},
    async asyncData({ $axios, params }) {
      const data = await fetchAccountDetail($axios, params.id)
      return {
        data
      }
    },
    data() {
      return {
        listSchema: [
          {
            label: 'address',
            key: 'address',
            slot: true
          },
          {
            label: 'Total Balance',
            key: 'total'
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
        fromToSchema: [
          {
            label: 'From',
            key: 'from'
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
  @import "../../../assets/css/common";
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
