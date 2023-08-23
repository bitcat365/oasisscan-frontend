<template>
  <div class="blocks-root">
    <Head title="TRANSACTIONS">
      <template #HeadLeft>
        <span class="total-count"> ({{ totalTxs | readable }})</span>
      </template>
    </Head>
    <Dropdown trigger="click" placement="bottom-start" @on-click="change">
      <a class="show-cur method-dropdown" href="javascript:void(0)">
        {{ method === '' ? 'All Type' : method }}
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem name="all">All Type</DropdownItem>
        <DropdownItem v-for="method in methods" :key="method" :name="method">{{ method }}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <div class="block-list-wrapper">
      <block-table root-class="block-total-list" cell-class="block-total-list-cell" :columns="columns" :data="list">
        <template v-slot:fee="{ data }">
          <span v-if="data">{{ data | unit(isTest) }}</span>
          <span v-else>0</span>
        </template>
        <template v-slot:status="{ data }">
          <span v-if="data" class="status-success">Success</span>
          <span v-else class="status-fail" :data-data="data">Fail</span>
        </template>
        <template v-slot:timestamp="{ data }">
          <span>{{ data.value | timeFormat }} </span>
        </template>
      </block-table>
      <div class="page-navigation">
        <page :sizer="sizer" :records-count="total" :page="page" root-class="block-page" @goto="goto"></page>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchTransactionsList, fetchChainMethods, fetchBlockInfo } from '../../fetch/index'
import BlockTable from '../../components/Table/index'
import Head from '~/components/Head'
import Page from '../../components/Page'

export default {
  name: 'index',
  components: {
    Head,
    BlockTable,
    Page
  },
  async asyncData({ $axios, store: $store }) {
    const res = await Promise.all([fetchBlockInfo({ $axios, $store }), fetchTransactionsList({ $axios, $store }, 1, 20, '', true, 12)])
    const { totalTxs = 0 } = res[0]
    const { list, totalSize } = res[1]
    return { list, total: totalSize, totalTxs }
  },
  methods: {
    async goto(pageNumber, progress = true) {
      const { $axios, $store } = this
      if (pageNumber > 1) {
        this.timer && clearTimeout(this.timer)
        this.timer = null
      }
      const { list, totalSize } = await fetchTransactionsList({ $axios, $store }, pageNumber, this.sizer, this.method, progress, 12)
      this.page = pageNumber
      this.list = list
      this.total = totalSize
      if (progress) {
        document.documentElement.scrollTop = document.body.scrollTop = 0
      }
      if (this.page === 1) {
        this.repull()
      }
    },
    change(name) {
      console.log('name', name)
      if (name === 'all') {
        this.method = ''
      } else {
        this.method = name
      }
      this.goto(1)
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
  async mounted() {
    const { $axios, $store } = this
    const { list } = await fetchChainMethods({ $axios, $store })
    this.methods = list
    this.repull()
  },
  data() {
    return {
      sizer: 20,
      page: 1,
      list: [],
      name: '',
      methods: [],
      method: '',
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
          key: 'method'
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
          slot: true
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.method-dropdown {
  margin-top: rem(20);
  padding: rem(2) rem(10);
  border: 1px solid rgba(0, 0, 0, 0.5);
  display: inline-block;
  border-radius: rem(4);
  background-color: #ffffff;
  .show-cur {
    color: #5f5f5f;
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
.blocks-root {
  background-color: #f7f7f7;
  min-height: calc(100vh - #{rem(100)});
}
.block-list-wrapper {
  margin-top: rem(12);
  background-color: white;
  padding: 0 rem(30);
  border-radius: rem(8);
  .block-total-list {
    padding: 0;
    width: 100%;
    margin-left: 0;
    border-radius: 1px;
    /deep/ td,
    /deep/ th {
      vertical-align: middle;
      padding: 18px 10px;
    }
    /deep/ tr th,
    /deep/ tr td {
      &:nth-child(1) {
        width: rem(240);
      }
      &:last-child {
        padding-left: 0;
        width: 100px;
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
.page-navigation {
  display: flex;
  justify-content: center;
  padding: 15px 0;
}
</style>
