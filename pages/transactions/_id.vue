<template>
  <div class="root">
    <Head title="TRANSACTION DETAILS"></Head>
    <panel>
      <!-- TODO -->
      <v-table class="v-table" :headers="listSchema" :data="data">
        <template v-slot:fee="{ data }">
          <span v-if="data">{{ data | unit(isTest) }}</span>
          <span v-else>{{ 0 | unit(isTest) }}</span>
        </template>

        <template v-slot:status="{ data }">
          <span v-if="data.status" class="status-success">Success</span>
          <div v-else>
            <span class="status-fail">Fail</span>
            <span class="error-message">{{ data.error }}</span>
          </div>
        </template>
        <template v-slot:timestamp="{ data }">
          <span>{{ (data * 1000) | timeFormat }} ( {{ (data * 1000) | timeFormat2 }} )</span>
        </template>
      </v-table>
    </panel>
    <panel title="Contents" class="trx-panel">
      <v-table v-if="data.method === 'staking.Transfer'" class="v-table" :headers="fromToSchema" :data="data">
        <template v-slot:amount="{ data }">
          <span v-if="data">{{ data | unit(isTest) }}</span>
          <span v-else>{{ 0 | unit(isTest) }}</span>
        </template>
      </v-table>
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
import VTable from '../../components/VTable/index'
import { fetchTransactionDetail } from '~/fetch/index'
export default {
  name: 'transactionDetail',
  components: { Head, Panel, Description, VTable },
  async asyncData({ $axios, store: $store, params }) {
    console.log('params', params)
    const data = await fetchTransactionDetail({ $axios, $store }, params.id)
    return {
      data
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
          label: 'Status',
          key: 'status',
          slot: true
        },
        {
          label: 'Time',
          key: 'timestamp',
          slot: true
        },
        {
          label: 'Height',
          key: 'height'
        },
        {
          label: 'Fee',
          key: 'fee',
          slot: true
        },
        {
          label: 'Nonce',
          key: 'nonce'
        },
        {
          label: 'Type',
          key: 'method'
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
          key: 'amount',
          slot: true
        }
      ]
    }
  },
  computed: {
    descriptionList() {
      return []
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
    @include regular;
    color: black;
    font-weight: normal;
    span {
      font-size: rem(14);
      color: rgba(0, 0, 0, 0.5);
    }
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
