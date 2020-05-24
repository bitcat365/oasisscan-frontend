<template>
  <div class="home-root">
    <nav-bar />
    <tab-menu :active="1"></tab-menu>
    <div class="welcome">
      Welcome Oasis Block Explorer
    </div>
    <div class="page-container">
      <block-info :blockInfo="blockInfo"></block-info>
      <div class="block-chain-list">
        <div class="list-card block-list">
          <p class="title">
            <span class="title-text">
              VALIDATOR(TOP SIGNATURES)
            </span>
            <a href="./validators">More</a>
          </p>
          <p class="table-wrapper">
            <block-table root-class="blocks-table" :columns="blockListColumns" :data="signs" />
          </p>
        </div>
        <div class="list-card transaction-list">
          <p class="title">
            <span class="title-text">
            VALIDATOR(TOP PROPOSALS)
            </span>
            <a href="./validators">More</a>
          </p>
          <p class="table-wrapper">
            <block-table root-class="txs-table" :columns="transactionColumns" :data="proposals" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { fetchBlockInfo, fetchHomeBlockList } from '../fetch/index'
  import BlockTable from '../components/Table/index'
  import NavBar from '../components/NavigationBar'
  import TabMenu from '../components/TabMenu'
  import BlockInfo from '../components/index/BlockInfo'

  export default {
    components: {
      NavBar,
      TabMenu,
      BlockInfo,
      BlockTable
    },
    async asyncData({ $axios }) {
      const data = await Promise.all([fetchBlockInfo($axios), fetchHomeBlockList($axios, 10, 'signs'), fetchHomeBlockList($axios, 10, 'proposals')])
      const blockInfo = data[0]
      const { list: signs } = data[1]
      const { list: proposals } = data[2]
      return { blockInfo, signs, proposals }
    },
    mounted() {
      // this.repool()
    },
    beforeDestroy() {
      clearTimeout(this.timer)
    },
    methods: {
      async repool() {
        const $axios = this.$axios
        const data = await Promise.all([fetchBlockInfo($axios), fetchHomeBlockList($axios)])
        const blockInfo = data[0]
        const { list: blockList } = data[1]
        const { list: transactionList } = data[2]
        this.blockInfo = blockInfo
        this.blockList = blockList
        this.transactionList = transactionList
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
            title: 'Validator',
            key: 'name'
          },
          {
            title: 'Signatures',
            key: 'signs'
          },
          {
            title: 'Score',
            key: 'score'
          }
        ],
        transactionColumns: [
          {
            title: 'Validator',
            // class: 136,
            key: 'name'
          },
          {
            title: 'Proposals',
            // class: 180,
            key: 'proposals'
          },
          {
            title: 'Score',
            key: 'score'
          }
        ]
      }
    }
  }
</script>

<style scoped lang="less">
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
  .page-container {
    position: relative;
    z-index: 1;
  }
  .welcome {
    line-height: 6.81rem;
    color: @theme-color;
    font-size: 3.13rem;
    text-align: center;
    background-color: #F8F8F8;
    .regular;
    margin-top: 1.69rem;
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
  .block-chain-list{
    position: relative;
    width: 100%;
    margin:1.56rem auto 0px;
    padding-bottom:1px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .block-list {
      width: 29.63rem;
    }
    .transaction-list{
      width: 29.63rem;
    }
    .list-card {
      background-color: white;
      border: 1px solid #D8D8D8;
      .title {
        position: relative;
        box-sizing: content-box;
        height: 4.25rem;
        font-size: 1.13rem;
        .regular;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50);
        font-weight:400;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #E0E0E0;;
        .title-text {
          padding-left: 3rem;
          display: flex;
          align-items: center;
          color: #3C3C3C;
        }
        a {
          position: absolute;
          right: 1.31rem;
          bottom: 1.31rem;
          font-size: 0.94rem;
          color: #727272;
        }
      }
      .table-wrapper {
        background-color: white;
        /deep/ .table {
          tbody {
            tr {
              td:first-child {
                color: @theme-color;
              }
              td:nth-child(2) {
                color: #4472DE;
              }
              td:last-child {
                color: #CECECE;
              }
            }
          }
        }
      }
    }
  }
</style>
