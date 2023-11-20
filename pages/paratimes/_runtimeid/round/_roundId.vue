<template>
  <div class="root">
    <Head title="ROUND DETAILS" class="title">
      <template #HeadLeft>
        <div class="paratime-tag">Paratime</div>
      </template>
    </Head>
    <Panel title="Header">
      <Description :list="listSchema" class="info-list">
        <template #round>
          <div class="label-content">{{ data.round }} <arrow-navigate :is-last="isLast" @pre="pre" @next="next" /></div>
        </template>
        <template #timestamp>
          <span>{{ data.timestamp | timeFormat }} ({{ data.timestamp | timeFormat2 }})</span>
        </template>
      </Description>
    </Panel>
    <Panel title="Transactions" class="Transactions">
      <BlockTable :loading="loading" :data="list" :columns="columns">
        <template v-slot:status="{ data }">
          <ColourDiv :color="data ? 'success' : 'error'">{{ data ? 'Success' : 'Fail' }}</ColourDiv>
        </template>
        <template v-slot:timestamp="{ data }">
          <span>{{ data.value | timeFormat }}</span>
        </template>
      </BlockTable>
      <Page slot="footer" type="simple" :sizer="sizer" :records-count="total" :page="page" @goto="goto"></Page>
    </Panel>
  </div>
</template>

<script>
import Head from '~/components/Head'
import Panel from '~/components/panel/Panel'
import BlockTable from '~/components/Table/index'
import ArrowNavigate from '~/components/ArrowNavigate'
import Page from '~/components/Page'
import Description from '~/components/description/index.vue'
import ColourDiv from '~/components/colourDiv/colourDiv'
import { fetchRoundDetail, fetchRuntimeTxList } from '~/fetch'
import Loader from '~/components/Loader'

export default {
  name: 'roundDetail',
  components: { Head, Panel, Description, ArrowNavigate, BlockTable, Loader, Page, ColourDiv },
  async asyncData({ $axios, store: $store, params, route }) {
    const data = await fetchRoundDetail({ $axios, $store }, route.params.runtimeid, params.roundId)
    return {
      data,
      isLast: !data.next
    }
  },
  data() {
    return {
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
          title: 'Round',
          key: 'round'
        },
        {
          title: 'Type',
          key: 'type'
        },
        {
          title: 'Status',
          key: 'status',
          slot: true
        },
        {
          title: 'Time',
          key: 'timestamp',
          slot: true,
          textAlign: 'right'
        }
      ],
      loading: false
    }
  },
  computed: {
    listSchema() {
      return [
        {
          title: 'Round',
          name: 'round'
        },
        {
          title: 'Runtime ID',
          content: this.data.runtimeIdAndName || ''
        },
        {
          title: 'Header Type',
          content: this.data.header_type || ''
        },
        {
          title: 'Time',
          name: 'timestamp'
        },
        {
          title: 'Previous Hash',
          content: this.data.previous_hash || ''
        },
        {
          title: 'IO Toot',
          content: this.data.io_root || ''
        },
        {
          title: 'State Toot',
          content: this.data.state_root || ''
        },
        {
          title: 'Messages Hash',
          content: this.data.messages_hash || ''
        }
      ]
    }
  },
  async mounted() {
    await this.fetchList()
  },
  methods: {
    goto(pageNumber) {
      this.fetchList(pageNumber)
    },
    async fetchList(page = 1) {
      const $axios = this.$axios
      const $store = this.$store
      const runtime = this.$route.params.runtimeid
      const roundId = this.$route.params.roundId
      this.loading = true
      const { list, totalSize } = await fetchRuntimeTxList({ $axios, $store }, runtime, roundId, page, this.sizer)
      this.loading = false
      this.list = list
      this.total = totalSize
      this.page = page
    },
    pre() {
      this.$router.push(`/paratimes/${this.$route.params.runtimeid}/round/${parseInt(this.$route.params.roundId) - 1}`)
    },
    next() {
      this.$router.push(`/paratimes/${this.$route.params.runtimeid}/round/${parseInt(this.$route.params.roundId) + 1}`)
    }
  }
}
</script>

<style scoped lang="scss">
.info-list {
  padding: 0 rem(10);
  .label-content {
    display: flex;
    align-items: center;
    gap: rem(20);
  }
}
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
.Transactions {
  margin-top: rem(20);
}
</style>
