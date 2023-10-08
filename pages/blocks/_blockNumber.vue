<template>
  <div class="root">
    <Head title="BLOCK DETAILS"></Head>
    <Panel>
      <Description :list="descriptionList" class="info-list">
        <template #height>
          <div class="label-content">
            {{ data.height }}
            <ArrowNavigate :is-last="isLast" @pre="pre" @next="next" />
          </div>
        </template>
        <template #timestamp>
          <span>{{ data.timestamp.value | timeFormat }} ( {{ data.value | timeFormat2 }} )</span>
        </template>
      </Description>
    </Panel>
    <Panel title="Transactions" v-if="!isRequesting">
      <BlockTable :loading="loading" :data="list" :columns="columns">
        <template v-slot:fee="{ data }">
          <span v-if="data">{{ data | unit(isTest) }}</span>
          <span v-else>0</span>
        </template>
        <template v-slot:status="{ data }">
          <ColourDiv :color="data ? 'success' : 'error'">{{ data ? 'Success' : 'Fail' }}</ColourDiv>
        </template>
      </BlockTable>
      <Page slot="footer" type="simple" :sizer="sizer" :records-count="total" :page="page" @goto="goto" />
    </Panel>
  </div>
</template>

<script>
import Head from '~/components/Head'
import Panel from '../../components/panel/Panel'
import BlockTable from '../../components/Table/index'
import ArrowNavigate from '../../components/ArrowNavigate'
import Page from '../../components/Page'
import Description from '~/components/description/index.vue'
import ColourDiv from '~/components/colourDiv/colourDiv'
import { fetchBlockDetail, fetchTransactions, fetchBlockInfo } from '../../fetch'

export default {
  name: 'blockDetail',
  components: { Head, Panel, BlockTable, Page, Description, ArrowNavigate, ColourDiv },
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
          key: 'txHash',
          width: '25%'
        },
        {
          title: 'Height',
          key: 'height'
        },
        {
          title: 'Type',
          key: 'type',
          width: '25%'
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
      ],
      loading: false
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
    async goto(pageNumber) {
      this.loading = true
      await this.fetchList(pageNumber)
      this.loading = false
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
