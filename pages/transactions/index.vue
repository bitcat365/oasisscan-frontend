<template>
  <div class="blocks-root">
    <nav-bar :active="4"/>
    <div class="page-container container">
      <div class="title">
        <h1>TRANSACTIONS<span class="total-count"> ({{total}})</span></h1>
      </div>
      <Dropdown trigger="click" placement="bottom-start" @on-click="change">
        <a class="show-cur method-dropdown" href="javascript:void(0)">
          {{method === '' ? 'All Method' : method}}
          <Icon type="ios-arrow-down"></Icon>
        </a>
        <DropdownMenu slot="list">
          <DropdownItem name="all">All Method</DropdownItem>
          <DropdownItem v-for="method in methods" :key="method" :name="method">{{method}}</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <div class="block-list-wrapper">
        <block-table root-class="block-total-list" cell-class="block-total-list-cell" :columns="columns" :data="list">
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
  import { fetchTransactionsList, fetchChainMethods } from '../../fetch/index'
  import BlockTable from '../../components/Table/index'
  import NavBar from '../../components/NavigationBar'
  import Page from '../../components/Page'

  export default {
    name: 'index',
    components: {
      NavBar,
      BlockTable,
      Page
    },
    async asyncData({ $axios }) {
      const { list, totalSize } = await fetchTransactionsList($axios, 1, 20, '', true, 12)
      console.log('list', list)
      return { list, total: totalSize }
    },
    methods: {
      async goto(pageNumber) {
        const $axios = this.$axios
        const { list, totalSize } = await fetchTransactionsList($axios, pageNumber, this.sizer, this.method, true, 12)
        this.page = pageNumber
        this.list = list
        this.total = totalSize
        document.documentElement.scrollTop = document.body.scrollTop = 0
      },
      change(name) {
        console.log('name', name)
        if (name === 'all') {
          this.method = ''
        } else {
          this.method = name
        }
        this.goto(1)
      }
    },
    computed: {
    },
    created() {
    },
    async mounted() {
      const $axios = this.$axios
      const { list } = await fetchChainMethods($axios)
      this.methods = list
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
            title: 'Fee',
            key: 'fee'
          },
          {
            title: 'Method',
            key: 'method'
          },
          // {
          //   title: 'Status',
          //   key: 'timestamp'
          // },
          {
            title: 'Time',
            key: 'timestamp'
          }
        ]
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/css/common";
  .method-dropdown {
    margin-top: rem(20);
    padding: rem(2) rem(10);
    border: 1px solid rgba(0, 0, 0, 0.5);
    display: inline-block;
    border-radius: rem(4);
    background-color: #ffffff;
    .show-cur {
      color: #5F5F5F;
    }
  }
  .page-navigation {
    display: flex;
    justify-content: flex-end;
    padding: 30px;
  }
  .blocks-root {
    background-color: #f7f7f7;
    min-height: calc(100vh - #{rem(100)});
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
      /deep/ td, /deep/ th {
        vertical-align: middle;
        padding: 18px 10px;
      }
      /deep/ tr th, /deep/ tr td{
        &:nth-child(1) {
          width: rem(240)
        }
        &:last-child {
          padding-left: 0;
          width: 110px;
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
    justify-content: flex-end;
    padding: 15px 0;
  }
</style>
