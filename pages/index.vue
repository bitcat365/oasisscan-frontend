<template>
  <div class="home-root">
    <nav-bar :active="1" />
    <div class="top-content">
      <div class="welcome">
        WELCOME TO OASIS BLOCK EXPLORER
      </div>
      <search-box></search-box>
      <div class="marquee-con">
        <scroll-news></scroll-news>
      </div>
    </div>
    <div class="bottom-content">
      <div class="page-container">
        <div class="dashboard-con">
          <panel title="Network Status" class="panel">
            <block-info :blockInfo="blockInfo"></block-info>
          </panel>
          <panel title="Transaction History" class="panel">
            <chart :tx-history="txHistory"/>
          </panel>
        </div>
        <div class="block-chain-list">
          <div class="list-card block-list">
            <p class="title">
            <span class="title-text">
              Latest Blocks
            </span>
              <a href="./blocks">More</a>
            </p>
            <p class="table-wrapper">
              <block-table root-class="blocks-table" :columns="blockListColumns" :data="blocks" />
            </p>
          </div>
          <div class="list-card transaction-list">
            <p class="title">
            <span class="title-text">
            Latest Transactions
            </span>
              <a href="./transactions">More</a>
            </p>
            <p class="table-wrapper">
              <block-table class="txs-table" :columns="transactionColumns" :data="transactions" />
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { fetchBlockInfo, fetchHomeBlockList, fetchTransactionsList, fetchTxHistory } from '../fetch/index'
  import BlockTable from '../components/Table/index'
  import NavBar from '../components/NavigationBar'
  import SearchBox from '../components/index/SearchBox'
  import BlockInfo from '../components/index/BlockInfo'
  import Chart from '../components/index/Chart'
  import ScrollNews from '../components/ScrollNews'
  import Panel from '../components/Panel'
  import Config from '../config/index'
  export default {
    components: {
      NavBar,
      BlockInfo,
      Chart,
      SearchBox,
      BlockTable,
      Panel,
      ScrollNews
    },
    async asyncData({ $axios }) {
      const data = await Promise.all([fetchBlockInfo($axios), fetchHomeBlockList($axios), fetchTransactionsList($axios), fetchTxHistory($axios)])
      const blockInfo = data[0]
      const txHistory = data[3]
      const { list: blocks } = data[1]
      const { list: transactions } = data[2]
      return { blockInfo, blocks, transactions, newsList: Config.news, txHistory }
    },
    mounted() {
      this.timer = setTimeout(() => {
        this.repool()
      }, 6000)
    },
    beforeDestroy() {
      clearTimeout(this.timer)
    },
    methods: {
      async repool() {
        const $axios = this.$axios
        const data = await Promise.all([fetchBlockInfo($axios), fetchHomeBlockList($axios), fetchTransactionsList($axios)])
        const blockInfo = data[0]
        const { list: blocks } = data[1]
        const { list: transactions } = data[2]
        this.blocks = blocks
        this.blockInfo = blockInfo
        this.transactions = transactions
        this.timer = setTimeout(() => {
          this.repool()
        }, 6000)
      }
    },
    data() {
      return {
        timer: -1,
        blockListColumns: [
          {
            title: 'Height',
            key: 'height'
          },
          {
            title: 'Proposer',
            key: 'proposer'
          },
          {
            title: 'txs',
            key: 'txs'
          },
          {
            title: 'Time',
            key: 'timestamp'
          }
        ],
        transactionColumns: [
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
            key: 'type'
          },
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
  @import "../assets/css/common";
  .main-content{
    min-height: calc(100vh - 60px - 80px);
    padding: 1.5rem;
  }
  .home-root {
    background-color: white;
    position: relative;
    overflow-x: hidden;
  }
  .top-content{
    background-color: #F3F3F3;
    background-image: url("../assets/backggrund.png");
    background-size: rem(1428) rem(332);
    background-position: right top;
    background-repeat: no-repeat;
    padding-bottom: rem(12);
  }
  .bottom-content{
    background-color: rgb(247,247,247);
    padding-top: rem(12);
  }
  .page-container {
    position: relative;
    z-index: 1;
  }
  .welcome {
    line-height: 1;
    color: $theme-color;
    font-size: rem(40);
    text-align: center;
    @include regular;
    padding-top: rem(76);
  }
  hr {
    width:100%;
    height:1px;
    border: 0;
    margin: 0;
    background:rgba(55,65,107,0.1);
    margin-block-start: 0;
    margin-block-end: 0;
  }
  .dashboard-con {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    > .panel{
      box-sizing: border-box;
      width: rem(594);
      padding-bottom: 0;
    }
  }
  .block-chain-list{
    position: relative;
    width: 100%;
    margin:1.56rem auto 0px;
    padding-bottom: rem(50);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .block-list {
      width: rem(594);
    }
    .transaction-list{
      width: rem(594);
    }
    .list-card {
      background-color: white;
      padding-bottom: rem(28);
      border-radius: rem(8);
      .title {
        position: relative;
        box-sizing: content-box;
        font-size: rem(16);
        padding: rem(20);
        padding-bottom: rem(10);
        @include regular;
        font-weight:400;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title-text {
          display: flex;
          align-items: center;
          color: #3C3C3C;
        }
        a {
          position: absolute;
          right: rem(26);
          top: rem(20);
          font-size: rem(12);
          color: white;
          padding:rem(5) rem(15);
          background-color: #979797;
          border-radius: rem(4);
        }
      }
      .table-wrapper {
        background-color: white;
        /deep/ .blocks-table {
          thead {
            tr {
              th:nth-child(2) {
                width: rem(180);
              }
            }
          }
        }
        /deep/ .txs-table {
          thead {
            tr {
              th:nth-child(1) {
                width: rem(180);
              }
              th:nth-child(3) {
                width: rem(180);
              }
            }
          }
        }
      }
    }
  }
</style>
