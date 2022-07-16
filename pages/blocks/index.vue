<template>
  <div class="blocks-root">
    <nav-bar :active="4"/>
    <div class="page-container container">
      <div class="title">
        <h1>BLOCKS<span v-if="latestBlock > 0" class="total-count"> ({{latestBlock | readable}})</span></h1>
      </div>
      <div class="block-list-wrapper">
        <block-table root-class="block-total-list" cell-class="block-total-list-cell" :columns="columns" :data="list">
          <template v-slot:timestamp="{data}">
            <span>{{data.value | timeFormat}} </span>
          </template>
        </block-table>
        <div class="page-navigation">
          <page :sizer="sizer" :records-count="total" :page="page" root-class="block-page" @goto="goto"></page>
        </div>
      </div>
      <!--<div>{{JSON.stringify(list)}}</div>-->
    </div>
  </div>
</template>

<script>
  import { fetchBlockList } from '../../fetch/index'
  import BlockTable from '../../components/Table/index'
  import NavBar from '../../components/NavigationBar'
  import Page from '../../components/Page'

  export default {
    name: 'index',
    components: {
      NavBar,
      BlockTable,
      Page,
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
    computed: {
    },
    created() {
    },
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
          // {
          //   title: 'Epoch',
          //   key: 'epoch'
          // },
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
            slot: true
          }
        ]
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/css/common";
  .blocks-root {
    background-color: #f7f7f7;
  }
  .container {
    padding-bottom: rem(50);
  }
  .title {
    padding-top: rem(20);
    display: flex;
    align-items: center;
    justify-content: space-between;
    h1 {
      font-size: rem(20);
      padding: 0;
      margin: 0;
      @include regular;;
      color: black;
      font-weight: normal;
      span {
        font-size: rem(14);
        color: rgba(0, 0, 0, 0.5);
      }
    }
  }
  .block-list-wrapper {
    margin-top: rem(12);
    background-color: white;
    padding:0 rem(30);
    border-radius: rem(8);
    .block-total-list{
      padding: 0;
      width: 100%;
      margin-left: 0;
      border-radius: 1px;
      table-layout: auto;
      /deep/ td, /deep/ th {
        vertical-align: middle;
        padding: 18px 10px;
      }
      /deep/ tr th, /deep/ tr td{
        &:nth-child(1) {
          width: 180px
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
  }
  .page-navigation {
    display: flex;
    justify-content: center;
    padding: 15px 0;
  }
</style>
