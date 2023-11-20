<template>
  <div class="root">
    <Head title="TRANSACTION DETAILS" class="title">
      <template #HeadLeft>
        <div class="paratime-tag">Paratime</div>
      </template>
    </Head>
    <Panel title="Header">
      <Description :list="listSchema" class="info-list">
        <template #timestamp>
          <span>{{data.timestamp | timeFormat}} ({{data.timestamp | timeFormat2}})</span>
        </template>
        <template #status>
          <ColourDiv v-if="data.result" color="success">Success</ColourDiv>
          <template v-else>
            <ColourDiv color="error">Fail</ColourDiv>
            <span class="error-message">{{ data.message }}</span>
          </template>
        </template>
      </Description>
    </Panel>
    <Panel class="panel" title="Contents">
      <div class="raw-data">
        <pre>{{(data.etx || data.ctx || {}) | pretty }}</pre>
      </div>
    </Panel>
    <Panel title="Events" v-if="data.events" class="panel">
      <div class="raw-data">
        <pre>{{(data.events) | pretty }}</pre>
      </div>
    </Panel>
  </div>
</template>

<script>
  import Head from '~/components/Head'
  import Panel from '~/components/panel/Panel'
  import Description from '~/components/description/index.vue'
  import ColourDiv from '~/components/colourDiv/colourDiv'
  import { fetchRuntimeTxDetail } from '~/fetch'

  export default {
    name: 'runtimeTxDetail',
    components: { Head, Panel, Description, ColourDiv },
    async asyncData({ $axios, store: $store, params, route }) {
      let data = await fetchRuntimeTxDetail({ $axios, $store }, route.params.runtimeid, params.txId, route.query.round)
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
            title: 'Round',
            content: this.data.round || ''
          },
          {
            title: 'Type',
            content: this.data.type || ''
          },
          {
            title: 'Status',
            name: 'status'
          },
          {
            title: 'Time',
            name: 'timestamp'
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
      display: inline-block;
      margin-left: rem(10);
      padding: 0 rem(10);
      height: rem(30);
      line-height: rem(30);
      font-size: rem(14);
      border-radius: rem(8);
      background: $gray500;
      color: white;
    }
  }
  .panel {
    margin-top: rem(20);
  }
  .raw-data {
      color: $gray500;
      background: $gray50;
      font-size: rem(14);
      border-radius: rem(8);
      max-height: rem(400);
      overflow-y: auto;
      padding: rem(10);
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
  .error-message {
    color: #F7685B;
  }
  /deep/ .info-list > li > .label {
    width: rem(120);
    min-width: rem(120);
  }
</style>
