<template>
  <div class="root">
    <Head title="TRANSACTION DETAILS"></Head>
    <Panel>
      <Description :list="listSchema" class="info-list">
        <template #fee>
          <span v-if="data.fee">{{ data.fee | unit(isTest) }}</span>
          <span v-else>{{ 0 | unit(isTest) }}</span>
        </template>
        <template #status>
          <ColourDiv :color="data.status.status ? 'success' : 'error'">{{ data.status.status ? 'Success' : 'Fail' }}</ColourDiv>
          <span v-if="!data.status.status" class="error-message">{{ data.status.error }}</span>
        </template>
        <template #timestamp>
          <span>{{ (data.timestamp * 1000) | timeFormat }} ({{ (data.timestamp * 1000) | timeFormat2 }})</span>
        </template>
      </Description>
    </Panel>
    <Panel title="Contents" class="trx-panel">
      <Description v-if="data.method === 'staking.Transfer'" :list="fromToSchema" class="info-list">
        <template v-slot:amount="{ data }">
          <span v-if="data">{{ data | unit(isTest) }}</span>
          <span v-else>{{ 0 | unit(isTest) }}</span>
        </template>
      </Description>
      <div class="raw-data" v-else>
        <pre> {{ data.raw | pretty }}</pre>
      </div>
    </Panel>
  </div>
</template>

<script>
import Head from '~/components/Head'
import Panel from '../../components/panel/Panel'
import Description from '~/components/description/index.vue'
import ColourDiv from '~/components/colourDiv/colourDiv'
import { fetchTransactionDetail } from '~/fetch/index'
import { readable } from '~/utils'
export default {
  name: 'transactionDetail',
  components: { Head, Panel, Description, ColourDiv },
  async asyncData({ $axios, store: $store, params }) {
    console.log('params', params)
    const data = await fetchTransactionDetail({ $axios, $store }, params.id)
    return {
      data
    }
  },
  data() {
    return {
      list: []
    }
  },
  computed: {
    listSchema() {
      return [
        {
          title: 'Hash',
          content: this.data.txHash || ''
        },
        {
          title: 'Type',
          content: this.data.method || ''
        },
        {
          title: 'Height',
          content: this.data.height || ''
        },
        {
          title: 'Fee',
          name: 'fee'
        },
        {
          title: 'Nonce',
          content: this.data.nonce || ''
        },
        {
          title: 'Status',
          name: 'status'
        },
        {
          title: 'Time',
          name: 'timestamp'
        }
      ]
    },
    fromToSchema() {
      return [
        {
          title: 'From',
          content: this.data.from || ''
        },
        {
          title: 'To',
          content: this.data.to || ''
        },
        {
          title: 'Amount',
          name: 'amount'
        }
      ]
    }
  },
  async mounted() {},
  methods: {}
}
</script>

<style scoped lang="scss">
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
.trx-panel {
  margin-top: rem(20);
  .block-total-list {
    width: 100%;
    margin-left: 0;
  }
}
.error-message {
  color: $error500;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
