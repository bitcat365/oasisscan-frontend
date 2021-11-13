<template>
  <div class="root">
    <nav-bar :active="6" />
    <div class="page-container container">
      <div class="title">
        <h1>TRANSACTION DETAILS</h1>
        <div class="paratime-tag">Paratime</div>
      </div>
      <panel>
        <template v-slot:header>
          <span>Header</span>
        </template>
        <v-table class="v-table" :headers="listSchema" :data="data">
          <template v-slot:timestamp="{data}">
            <span>{{data.value | timeFormat}} ( {{data.value | timeFormat2}} )</span>
          </template>
          <template v-slot:result="{data, detail}">
            <span v-if="data" class="status-success" :data-a="JSON.stringify(all)">Success</span>
            <div v-else>
              <span class="status-fail" >Fail</span>
              <span class="error-message">{{ detail.message }}</span>
            </div>
          </template>
        </v-table>
      </panel>
      <panel class="panel">
        <template v-slot:header>
          <span>Contents</span>
        </template>
        <div class="raw-data">
          <pre>{{(data.etx || data.ctx || {}) | pretty }}</pre>
        </div>
      </panel>
    </div>
  </div>
</template>

<script>
  import Panel from '../../../components/Panel'
  import VTable from '../../../components/VTable/index'

  import NavBar from '../../../components/NavigationBar'
  import { fetchRuntimeTxDetail } from '../../../fetch'

  export default {
    name: 'runtimeTxDetail',
    components: { NavBar, Panel, VTable },
    async asyncData({ $axios, store: $store, params, route }) {
      const data = await fetchRuntimeTxDetail({ $axios, $store }, route.query.runtime, params.txId)
      return {
        data,
      }
    },
    data() {
      return {
        listSchema: [
          {
            label: 'Tx Hash',
            key: 'txHash'
          },
          {
            label: 'Runtime ID',
            key: 'runtimeId'
          },
          {
            label: 'Status',
            key: 'result',
            slot: true
          },
          {
            label: 'Time',
            key: 'timestamp',
            slot: true
          },
          {
            label: 'Round',
            key: 'round'
          },
          {
            label: 'Type',
            key: 'type'
          },
        ],
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
  .root {
    background-color: #f7f7f7;
    padding-bottom: rem(50);
    min-height: calc(100vh - #{rem(100)});
  }
  .label-content {
    display: flex;
    align-items: center;
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
    justify-content: flex-start;
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
    .paratime-tag {
      background: #ccc;
      color: white;
      font-size: rem(16);
      border-radius: rem(12);
      padding: 0 rem(8);
      margin-left: rem(8);
    }
  }
  .panel {
    margin-top: rem(36);
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
  .status-fail,.status-success {
    padding: rem(4) rem(10);
    color: white;
    border-radius: rem(4);
    font-size: rem(12);
  }
  .status-fail {
    background-color: #F7685B;
  }
  .error-message {
    color: #F7685B;
  }
  .status-success {
    background-color: #2ED47A;
  }
  /deep/ .info-list > li > .label {
    width: rem(120);
    min-width: rem(120);
  }
</style>
