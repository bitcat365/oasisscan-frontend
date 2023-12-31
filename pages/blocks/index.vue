<template>
  <div class="blocks-root">
    <Head title="BLOCKS">
      <template #HeadLeft v-if="latestBlock > 0">
        <span class="HeadLeft"> ({{ latestBlock | readable }})</span>
      </template>
    </Head>
    <Panel class="block-list-wrapper">
      <BlockTable :loading="loading" :columns="columns" :data="list">
        <template v-slot:timestamp="{ data }">
          <span>{{ data.value | timeFormat }} </span>
        </template>
      </BlockTable>
      <Page slot="footer" :sizer="sizer" :records-count="total" :page="page" root-class="block-page" @goto="goto"></Page>
    </Panel>
  </div>
</template>

<script>
import Head from '~/components/Head'
import { fetchBlockList } from '../../fetch/index'
import BlockTable from '../../components/Table/index'
import Page from '../../components/Page'
import Panel from '~/components/panel/Panel'

export default {
  name: 'index',
  components: {
    Head,
    BlockTable,
    Page,
    Panel
  },
  async asyncData({ $axios, store: $store }) {
    const { list, totalSize } = await fetchBlockList({ $axios, $store }, 1, 20)
    return { list, total: totalSize, latestBlock: list && list.length > 0 ? list[0].height.text : 0 }
  },
  methods: {
    async goto(pageNumber, pageSize, progress = true) {
      // if (pageNumber > 1) {
      //   this.timer && clearTimeout(this.timer)
      //   this.timer = null
      // }
      const { $axios, $store } = this
      this.loading = true
      const { list, totalSize } = await fetchBlockList({ $axios, $store }, pageNumber, pageSize, progress)
      this.loading = false
      this.page = pageNumber
      this.sizer = pageSize
      this.list = list
      this.total = totalSize
      progress && (document.documentElement.scrollTop = document.body.scrollTop = 0)
      // if (this.page === 1) {
      //   this.repull()
      // }
    },
    // repull() {
    //   this.timer && clearTimeout(this.timer)
    //   this.timer = setTimeout(async () => {
    //     if (this.page === 1) {
    //       await this.goto(1, false)
    //       this.repull()
    //     }
    //   }, 6000)
    // }
  },
  computed: {},
  created() {},
  mounted() {
    // this.repull()
  },
  destroyed() {
    this.timer && clearTimeout(this.timer)
    this.timer = null
  },
  data() {
    return {
      sizer: 20,
      page: 1,
      list: [],
      name: '',
      columns: [
        {
          title: 'Height',
          key: 'height'
        },
        {
          title: 'Block Hash',
          key: 'hash',
          width: '25%'
        },
        {
          title: 'Proposer',
          key: 'proposer',
          width: '37.5%'
        },
        {
          title: 'Txs',
          key: 'txs'
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
  }
}
</script>

<style scoped lang="scss">
.HeadLeft {
  color: $gray500;
  font-size: rem(16);
}
</style>
