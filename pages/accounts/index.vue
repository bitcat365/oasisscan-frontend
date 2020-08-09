<template>
  <div class="blocks-root">
    <nav-bar :active="3"/>
    <div class="page-container container">
      <div class="title">
        <h1>ACCOUNTS<span class="total-count"> ({{total}})</span></h1>
      </div>
      <div class="block-list-wrapper">
        <block-table root-class="block-total-list" cell-class="block-total-list-cell" :columns="columns" :data="list">
          <template v-slot:address="{data}">
            <div class="account-item">
              <emoji :amount="data.total"></emoji>
              <a :href="data.link" target="_self">{{data.text | hashFormat(data.sliceLength ? data.sliceLength : undefined)}}</a>
            </div>
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
  import LS from 'local-storage'
  import { fetchAccountsList } from '../../fetch/index'
  import Emoji from '../../components/emoji'
  import BlockTable from '../../components/Table/index'
  import NavBar from '../../components/NavigationBar'
  import Page from '../../components/Page'

  export default {
    name: 'index',
    components: {
      NavBar,
      BlockTable,
      Page,
      Emoji
    },
    async asyncData({ $axios }) {
      const { list, totalSize } = await fetchAccountsList($axios, 1, 20)
      console.log('list', list)
      return { list, total: totalSize }
    },
    methods: {
      async goto(pageNumber) {
        const $axios = this.$axios
        const { list, totalSize } = await fetchAccountsList($axios, pageNumber, this.sizer)
        this.page = pageNumber
        this.list = list
        this.total = totalSize
        document.documentElement.scrollTop = document.body.scrollTop = 0
      },
      star(id, star) {
        let accounts = LS('StaredAccounts')
        if (!accounts) {
          accounts = []
        }
        const index = accounts.findIndex(v => v === id)
        if (star) {
          if (index >= 0) {
            accounts.splice(index, 1)
          }
          if (accounts.length >= 20) {
            accounts.shift()
          }
          accounts.push(id)
        } else {
          accounts.splice(index, 1)
        }
        LS('staredAccounts', accounts)
        this.staredAccounts = accounts
      },
    },
    computed: {
    },
    created() {
    },
    mounted() {
      const $axios = this.$axios
    },
    data() {
      return {
        sizer: 20,
        page: 1,
        list: [],
        columns: [
          {
            title: '#',
            key: 'rank',
          },
          {
            title: 'Accounts',
            key: 'address',
            slot: true
          },
          {
            title: 'Available',
            key: 'available'
          },
          {
            title: 'Escrow',
            key: 'escrow'
          },
          {
            title: 'Debonding',
            key: 'debonding'
          },
          {
            title: 'Amount',
            key: 'total'
          }
        ]
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/css/common";
  .rank {
    display: flex;
    flex-direction: column;
    align-items: center;
    .star {
      width: rem(10);
      margin-top: rem(5);
      cursor: pointer;
      display: block;
      opacity: 1;
    }
    .unstar {
      display: none;
      transition: all .3s;
      opacity: 0;
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
      /deep/ .table-row:hover{
        .unstar {
          display: block;
          opacity: 1;
        }
      }
      /deep/ td, /deep/ th {
        vertical-align: middle;
        padding: 18px 10px;
      }
      /deep/ td {
        padding: 0 10px;
        height: rem(57);
      }
      /deep/ tr th, /deep/ tr td{
        &:nth-child(1) {
          width: 60px;
          text-align: center;
        }
        &:nth-child(2) {
          width: 400px;
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
  .account-item {
    display: flex;
    align-items: center;
  }
</style>
