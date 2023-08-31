<template>
  <div class="root">
    <Head title="TRANSACTION DETAILS"></Head>
    <panel>
      <Description :list="listSchema" class="info-list">
        <template #fee>
          <span v-if="data.fee">{{ data.fee | unit(isTest) }}</span>
          <span v-else>{{ 0 | unit(isTest) }}</span>
        </template>
        <template #status>
          <span v-if="data.status" class="status-success">Success</span>
          <div v-else>
            <span class="status-fail">Fail</span>
            <span class="error-message">{{ data.error }}</span>
          </div>
        </template>
        <template #timestamp>
          <span>{{ (data.timestamp * 1000) | timeFormat }} ( {{ (data.timestamp * 1000) | timeFormat2 }} )</span>
        </template>
      </Description>
    </panel>
    <panel title="Contents" class="trx-panel">
      <Description v-if="data.method === 'staking.Transfer'" :list="fromToSchema" class="info-list">
        <template v-slot:amount="{ data }">
          <span v-if="data">{{ data | unit(isTest) }}</span>
          <span v-else>{{ 0 | unit(isTest) }}</span>
        </template>
      </Description>
      <div class="raw-data" v-else>
        <pre> {{ data.raw | pretty }}</pre>
      </div>
    </panel>
  </div>
</template>

<script>
import Head from '~/components/Head'
import Panel from '../../components/panel/Panel'
import Description from '~/components/description/index.vue'
import { fetchTransactionDetail } from '~/fetch/index'
import { readable } from '~/utils'
export default {
  name: 'transactionDetail',
  components: { Head, Panel, Description },
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
      listSchema(){ 
        return [{
          title: 'Tx Hash',
          content: this.data.txHash ||''
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
          title: 'Type',
          content: this.data.method || ''
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
  background: #f8f9fa;
  border: 1px solid #b2b2b2;
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
.trx-panel {
  margin-top: rem(20);
  .block-total-list {
    width: 100%;
    margin-left: 0;
  }
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

.status-fail,
.status-success {
  padding: rem(4) rem(10);
  color: white;
  border-radius: rem(4);
  font-size: rem(12);
}
.status-fail {
  background-color: #f7685b;
}
.error-message {
  color: #f7685b;
}
.status-success {
  background-color: #2ed47a;
}
</style>
