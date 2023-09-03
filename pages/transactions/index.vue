<template>
  <div class="blocks-root">
    <Head title="TRANSACTIONS">
      <template #HeadLeft>
        <span class="HeadLeft"> ({{ totalTxs | readable }})</span>
      </template>
    </Head>
    <Panel class="panel">
      <template slot="headerLeft">
        <Dropdown class="dropdown" trigger="click" placement="bottom-start" @on-click="change">
          <a class="method-dropdown" href="javascript:void(0)">
            {{ method === '' ? 'ALL TYPES' : method }}
            <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list" class="select-list">
            <DropdownItem name="all" class="select-item">ALL TYPES</DropdownItem>
            <DropdownItem v-for="method in methods" :key="method" :name="method" class="select-item">{{ method }}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </template>
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
        <Page :sizer="sizer" :records-count="total" :page="page" root-class="block-page" @goto="goto"></Page>
      </div>
    </Panel>
  </div>
</template>

<script>
import { fetchTransactionsList, fetchChainMethods, fetchBlockInfo } from '../../fetch/index'
import BlockTable from '../../components/Table/index'
import Head from '~/components/Head'
import Panel from '~/components/panel/Panel'
import Page from '../../components/Page'

export default {
  name: 'index',
  components: {
    Head,
    Panel,
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
.dropdown {
  .method-dropdown {
    padding: 0 rem(16);
    height: rem(40);
    line-height: rem(40);
    display: inline-block;
    border-radius: rem(16);
    background-color: $gray100;
    color: $gray600;
    font-size: rem(14);
  }
  /deep/.ivu-select-dropdown {
    padding: 0;
    .select-list {
      min-width: rem(260);
      background-color: $gray100;
      border-radius: rem(8);
      padding: 0;
      .select-item {
        font-size: rem(14);
        padding: 0 rem(10);
        height: rem(30);
        line-height: rem(30);
        &:hover {
          background: $gray200;
        }
      }
    }
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
.block-list-wrapper {
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
      &:last-child {
        padding-left: 0;
        width: 100px;
      }
    }
  }
}
</style>
