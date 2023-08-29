<template>
  <div class="root">
    <Head title="BLOCK DETAILS"></Head>
    <panel>
      <Description :list="descriptionList" class="info-list">
        <template #height>
          <div class="label-content">{{ data.height }} <arrow-navigate :is-last="isLast" @pre="pre" @next="next" /></div>
        </template>
        <template #timestamp>
          <span>{{ data.timestamp.value | timeFormat }} ( {{ data.value | timeFormat2 }} )</span>
        </template>
      </Description>
    </panel>
    <panel class="trx-panel" title="Transactions" v-if="!isRequesting">
      <p v-if="total === 0" class="no-result">
        <img class="empty-icon" src="../../assets/empty.svg" />
        {{ $t('noTx') }}
      </p>
      <block-table v-if="total > 0" :data="list" :columns="columns" root-class="block-total-list" cell-class="block-total-list-cell">
        <template v-slot:fee="{ data }"
          ><span v-if="data">{{ data | unit(isTest) }}</span>
          <span v-else>0</span>
        </template>
        <template v-slot:status="{ data }">
          <span v-if="data" class="status-success">Success</span>
          <span v-else class="status-fail" :data-data="data">Fail</span>
        </template>
      </block-table>
      <div v-if="total > 0" class="page-navigation">
        <page type="simple" :sizer="sizer" :records-count="total" :page="page" root-class="block-page" @goto="goto"></page>
      </div>
    </panel>
  </div>
</template>

<script>
import Head from '~/components/Head'
import Panel from '../../components/panel/Panel'
import BlockTable from '../../components/Table/index'
import ArrowNavigate from '../../components/ArrowNavigate'
import Page from '../../components/Page'
import Description from '~/components/description/index.vue'
import { fetchBlockDetail, fetchTransactions, fetchBlockInfo } from '../../fetch'

export default {
  name: 'blockDetail',
  components: { Head, Panel, BlockTable, Page, Description, ArrowNavigate },
  async asyncData({ $axios, store: $store, params }) {
    const datas = await Promise.all([fetchBlockInfo({ $axios, $store }), fetchBlockDetail({ $axios, $store }, params.blockNumber)])
    const { curHeight: latestHeight } = datas[0]
    const data = datas[1]
    return {
      isLast: +params.blockNumber === +latestHeight,
      data
    }
  },
  data() {
    return {
      isRequesting: true,
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
          key: 'fee',
          slot: true
        },
        {
          title: 'Status',
          key: 'status',
          slot: true
        },
        {
          title: 'Time',
          key: 'timestamp',
          textAlign: 'right'
        }
      ]
    }
  },
  computed: {
    descriptionList() {
      return [
        {
          title: 'Height',
          name: 'height'
        },
        {
          title: 'Hash',
          content: this.data.hash || ''
        },
        {
          title: 'Epoch',
          content: this.data.epoch || ''
        },
        {
          title: 'Transactions',
          content: this.data.txs || ''
        },
        {
          title: 'Proposer',
          content: this.data.proposer || ''
        },
        {
          title: 'Time',
          name: 'timestamp'
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
      const $axios = this.$axios
      const $store = this.$store
      const { list, totalSize } = await fetchTransactions({ $axios, $store }, this.$route.params.blockNumber, '', page, this.sizer)
      this.list = list
      this.total = totalSize
      this.page = page
    },
    pre() {
      this.$router.push(`./${parseInt(this.$route.params.blockNumber) - 1}`)
    },
    next() {
      this.$router.push(`./${parseInt(this.$route.params.blockNumber) + 1}`)
    }
  }
}
</script>

<style scoped lang="scss">
.label-content {
  display: flex;
  align-items: center;
}
.trx-panel {
  margin-top: rem(20);
  .block-total-list {
    width: 100%;
    margin-left: 0;
  }
}
.page-navigation {
  padding-top: 30px;
  display: flex;
  justify-content: center;
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
.status-success {
  background-color: #2ed47a;
}
</style>
