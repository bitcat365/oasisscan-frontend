<template>
  <div class="blocks-root">
    <Head title="BLOCKS">
      <template #HeadLeft v-if="latestBlock > 0">
        <span class="HeadLeft"> ({{ latestBlock | readable }})</span>
      </template>
    </Head>
    <Panel class="block-list-wrapper">
      <block-table v-if="list && list.length > 0" root-class="block-total-list" cell-class="block-total-list-cell" :columns="columns" :data="list">
        <template v-slot:timestamp="{ data }">
          <span>{{ data.value | timeFormat }} </span>
        </template>
      </block-table>
      <Page v-if="list && list.length > 0" :sizer="sizer" :records-count="total" :page="page" root-class="block-page" @goto="goto"></Page>
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
    async goto(pageNumber, progress = true) {
      if (pageNumber > 1) {
        this.timer && clearTimeout(this.timer)
        this.timer = null
      }
      const { $axios, $store } = this
      const { list, totalSize } = await fetchBlockList({ $axios, $store }, pageNumber, this.sizer, progress)
      this.page = pageNumber
      this.list = list
      this.total = totalSize
      progress && (document.documentElement.scrollTop = document.body.scrollTop = 0)
      if (this.page === 1) {
        this.repull()
      }
    },
    repull() {
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        if (this.page === 1) {
          await this.goto(1, false)
          this.repull()
        }
      }, 6000)
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.repull()
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
          key: 'hash'
        },
        {
          title: 'Proposer',
          key: 'proposer'
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
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.HeadLeft {
  color: $gray500;
  font-size: rem(18);
}
.block-list-wrapper {
  .block-total-list {
    padding: 0;
    width: 100%;
    margin-left: 0;
    border-radius: 1px;
    table-layout: auto;
    /deep/ td,
    /deep/ th {
      vertical-align: middle;
      padding: 18px 10px;
    }
    /deep/ tr th,
    /deep/ tr td {
      &:nth-child(1) {
        width: 180px;
      }
      &:last-child {
        padding-left: 0;
        width: 260px;
      }
    }
  }
  .title {
    margin-left: 0px;
    margin-top: 6px;
    font-size: 18px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(55, 65, 107, 1);
    line-height: 1;
    display: flex;
    align-items: center;
    > .icon {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
  }
  .total-records {
    margin-left: 40px;
    margin-top: 9px;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(55, 65, 107, 0.5);
    line-height: 1;
  }
}
</style>
