<template>
  <div class="root">
    <Head title="TRANSACTION DETAILS" class="title">
      <template #HeadLeft>
        <div class="paratime-tag">Paratime</div>
      </template>
    </Head>
    <panel title="Header">
      <Description :list="listSchema" class="info-list">
        <template #timestamp>
          <span>{{data.timestamp | timeFormat}} ( {{data.timestamp | timeFormat2}} )</span>
        </template>
        <template #result>
          <span v-if="data.result" class="status-success">Success</span>
          <div v-else>
            <span class="status-fail" >Fail</span>
            <span class="error-message">{{ data.detail.message }}</span>
          </div>
        </template>
      </Description>
      <!-- <v-table class="v-table" :headers="listSchema" :data="data">
        <template v-slot:timestamp="{data}">
          <span>{{data | timeFormat}} ( {{data | timeFormat2}} )</span>
        </template>
        <template v-slot:result="{data, detail}">
          <span v-if="data" class="status-success">Success</span>
          <div v-else>
            <span class="status-fail" >Fail</span>
            <span class="error-message">{{ detail.message }}</span>
          </div>
        </template>
      </v-table> -->
    </panel>
    <panel class="panel" title="Contents">
      <div class="raw-data">
        <pre>{{(data.etx || data.ctx || {}) | pretty }}</pre>
      </div>
    </panel>
    <panel title="Events" v-if="data.events" class="panel event-panel">
      <div class="raw-data">
        <pre>{{(data.events) | pretty }}</pre>
      </div>
    </panel>
  </div>
</template>

<script>
  import Head from '~/components/Head'
  import Panel from '../../../components/panel/Panel'
  import Description from '~/components/description/index.vue'
  import VTable from '../../../components/VTable/index'
  import { fetchRuntimeTxDetail } from '../../../fetch'

  export default {
    name: 'runtimeTxDetail',
    components: { Head, Panel, Description, VTable },
    async asyncData({ $axios, store: $store, params, route }) {
      const data = await fetchRuntimeTxDetail({ $axios, $store }, route.query.runtime, params.txId, route.query.round)
     console.log('data', data)
      return {
        data,
      }
    },
    data() {
      return {}
    },
    computed: {
      listSchema(){
        return [
          {
            title: 'Tx Hash',
            content: this.data.txHash || ''
          },
          {
            title: 'Runtime ID',
            content: this.data.runtimeIdAndName || ''
          },
          {
            title: 'Status',
            name: 'result'
          },
          {
            title: 'Time',
            name: 'timestamp'
          },
          {
            title: 'Round',
            content: this.data.round || ''
          },
          {
            title: 'Type',
            content: this.data.type || ''
          },
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
  .title {
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
    &.event-panel {
      margin-top: rem(18);
    }
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
