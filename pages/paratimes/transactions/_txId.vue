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
        <template #status>
          <ColourDiv v-if="data.result" color="success">Success</ColourDiv>
          <template v-else>
            <ColourDiv color="error">Fail</ColourDiv>
            <!-- <span class="error-message">{{ data.detail.message }}</span> -->
          </template>
        </template>
      </Description>
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
  import ColourDiv from '~/components/colourDiv/colourDiv'
  import { fetchRuntimeTxDetail } from '../../../fetch'

  export default {
    name: 'runtimeTxDetail',
    components: { Head, Panel, Description, ColourDiv },
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
            name: 'status'
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
      display: inline-block;
      margin-left: rem(8);
      width: rem(100);
      height: rem(30);
      line-height: rem(30);
      font-size: rem(16);
      border-radius: rem(12);
      text-align: center;
      background: $gray500;
      color: white;
    }
  }
  .panel {
    margin-top: rem(20);
    &.event-panel {
      margin-top: rem(18);
    }
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
