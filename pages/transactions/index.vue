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
      <BlockTable :loading="loading" :columns="columns" :data="list">
        <template v-slot:fee="{ data }">
          <span v-if="data">{{ data | unit(isTest) }}</span>
          <span v-else>0 ROSE</span>
        </template>
        <template v-slot:status="{ data }">
          <ColourDiv :color="data ? 'success' : 'error'">{{ data ? 'Success' : 'Fail' }}</ColourDiv>
        </template>
        <template v-slot:timestamp="{ data }">
          <span>{{ data.value | timeFormat }} </span>
        </template>
      </BlockTable>
      <Page slot="footer" :sizer="sizer" :records-count="total" :page="page" @goto="goto"></Page>
    </Panel>
  </div>
</template>

<script>
import { fetchTransactionsList, fetchChainMethods, fetchBlockInfo } from '../../fetch/index'
import BlockTable from '../../components/Table/index'
import Head from '~/components/Head'
import Panel from '~/components/panel/Panel'
import Page from '../../components/Page'
import ColourDiv from '~/components/colourDiv/colourDiv'
export default {
  name: 'index',
  components: {
    Head,
    Panel,
    BlockTable,
    Page,
    ColourDiv
  },
  async asyncData({ $axios, store: $store }) {
    const res = await Promise.all([fetchBlockInfo({ $axios, $store }), fetchTransactionsList({ $axios, $store }, 1, 20, '', true, 12)])
    const { totalTxs = 0 } = res[0]
    const { list, totalSize } = res[1]
    return { list, total: totalSize, totalTxs }
  },
  methods: {
    async goto(pageNumber, pageSize ,progress = true) {
      const { $axios, $store } = this
      if (pageNumber > 1) {
        this.timer && clearTimeout(this.timer)
        this.timer = null
      }
      this.loading = true
      const { list, totalSize } = await fetchTransactionsList({ $axios, $store }, pageNumber, pageSize, this.method, progress, 12)
      this.loading = false
      this.page = pageNumber
      this.sizer = pageSize
      this.list = list
      this.total = totalSize
      if (progress) {
        document.documentElement.scrollTop = document.body.scrollTop = 0
      }
      // if (this.page === 1) {
      //   this.repull()
      // }
    },
    change(name) {
      console.log('name', name)
      if (name === 'all') {
        this.method = ''
      } else {
        this.method = name
      }
      this.goto(1,this.sizer)
    },
    // repull() {
    //   this.timer && clearTimeout(this.timer)
    //   this.timer = setTimeout(async () => {
    //     if (this.page === 1) {
    //       await this.goto(1,this.sizer, false)
    //       this.repull()
    //     }
    //   }, 6000)
    // }
  },
  computed: {},
  created() {},
  async mounted() {
    const { $axios, $store } = this
    const { list } = await fetchChainMethods({ $axios, $store })
    this.methods = list
    // this.repull()
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
          title: 'Block Hash',
          key: 'txHash',
          width: '25%'
        },
        {
          title: 'Height',
          key: 'height'
        },
        {
          title: 'Type',
          key: 'method',
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
.dropdown {
  position: relative;
  .method-dropdown {
    margin: 0 rem(10);
    padding: 0 rem(16);
    height: rem(32);
    line-height: rem(32);
    display: inline-block;
    border-radius: rem(24);
    background-color: $gray100;
    color: $gray600;
    font-size: rem(14);
  }
  /deep/.ivu-select-dropdown {
    padding: 0;
    border-radius: rem(8);
    left: rem(10) !important;
    top: rem(40) !important;
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
</style>
