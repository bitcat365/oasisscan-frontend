<template>
  <div class="blocks-root">
    <Head title="PROPOSALS">
      <template #HeadLeft>
      <span class="HeadLeft"> ({{list.length | readable}})</span>
    </template>
    </Head>
    <Panel>
      <block-table v-if="list && list.length > 0" root-class="block-total-list" cell-class="block-total-list-cell" :columns="columns" :data="list">
        <template v-slot:timestamp="{data}">
          <span>{{data.value | timeFormat}} </span>
        </template>
      </block-table>
    </Panel>
  </div>
</template>

<script>
  import {fetchProposals} from '../../fetch/index'
  import BlockTable from '../../components/Table/index'
  import Head from '~/components/Head'
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
      const { list, totalSize } = await fetchProposals({ $axios, $store }, 1, 20)
      return { list, total: totalSize }
    },
    methods: {
      async goto(pageNumber, progress = true) {
        const { $axios, $store } = this
        const { list, totalSize } = await fetchProposals({ $axios, $store }, pageNumber, this.sizer, progress)
        this.page = pageNumber
        this.list = list
        this.total = totalSize
        progress && (document.documentElement.scrollTop = document.body.scrollTop = 0)
      }
    },
    computed: {
    },
    created() {
    },
    destroyed() {
    },
    data() {
      return {
        sizer: 20,
        page: 1,
        list: [],
        name: '',
        columns: [
          {
            title: 'ID',
            key: 'id'
          },
          {
            title: 'Handler',
            key: 'handler'
          },
          {
            title: 'Deposit',
            key: 'deposit'
          },
          {
            title: 'Created Epoch',
            key: 'created_at'
          },
          {
            title: 'Closes Epoch',
            key: 'closes_at'
          },
          {
            title: 'Status',
            key: 'state',
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
    font-size: rem(16);
  }
    .block-total-list{
      padding: 0;
      width: 100%;
      margin-left: 0;
      border-radius: 1px;
      table-layout: fixed;
      /deep/ td, /deep/ th {
        vertical-align: middle;
        padding: 18px 10px;
      }
      /deep/ tr th, /deep/ tr td{
        &:nth-child(1) {
          width: 80px
        }
        &:nth-child(2) {
          width: 360px
        }
        &:last-child {
          padding-left: 0;
          //width: 260px;
        }
      }
    }
    .title {
      margin-left: 0px;
      margin-top: 6px;
      font-size:18px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(55,65,107,1);
      line-height: 1;
      display: flex;
      align-items: center;
      > .icon {
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }
    }
    .total-records{
      margin-left: 40px;
      margin-top: 9px;
      font-size:12px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(55,65,107,0.5);
      line-height: 1;
    }
</style>
