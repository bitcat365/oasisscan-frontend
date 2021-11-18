<template>
  <div class="blocks-root">
    <nav-bar :active="6"/>
    <div class="page-container container">
      <div class="title">
        <h1>PARATIMES<span class="total-count"> ({{ runtimeListSize }})</span></h1>
      </div>
      <div class="operate">
        <Dropdown trigger="click" placement="bottom-start" @on-click="change">
          <a class="show-cur runtime-dropdown" href="javascript:void(0)">
            {{currentRuntime && currentRuntime.name ? currentRuntime.name : 'Unknown'}}
            ({{ currentRuntime ? currentRuntime.runtimeId : '' | hashFormat(10)}})
            <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem v-for="runtime in runtimeList" :key="runtime.runtimeId" :name="runtime.runtimeId">
              {{ runtime.name ? runtime.name : 'Unknown'}}
              ({{ runtime.runtimeId | hashFormat(10)}})
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <div class="tag-con">
          <div :class="['type', currentListType === ListTypes.nodeList ? 'sel' : '']" @click="changeListType(ListTypes.nodeList)">Nodes</div>
          <div :class="['type', currentListType === ListTypes.roundList ? 'sel' : '']" @click="changeListType(ListTypes.roundList)">Rounds</div>
          <div :class="['type', currentListType === ListTypes.txList ? 'sel' : '']" @click="changeListType(ListTypes.txList)">Transactions</div>
        </div>
      </div>
      <div v-if="currentListType=== ListTypes.roundList && !isLoading" class="block-list-wrapper round-list-wrapper">
        <block-table root-class="block-total-list" cell-class="block-total-list-cell" :columns="roundListColumns" :data="roundList">
          <template v-slot:timestamp="{data}">
            <span>{{data.value | timeFormat}} </span>
          </template>
        </block-table>
        <div class="page-navigation">
          <page :sizer="sizer" :records-count="roundListTotal" :page="roundListPage" root-class="block-page" @goto="goto"></page>
        </div>
      </div>
      <div v-else-if="currentListType=== ListTypes.nodeList && !isLoading" class="block-list-wrapper node-list-wrapper">
        <p v-if="nodeList && nodeList.length === 0" class="no-result">
          <img class="empty-icon" src="../../assets/empty.svg">
          No Node List
        </p>
        <block-table
          v-if="nodeList && nodeList.length > 0"
          root-class="block-total-list"
          cell-class="block-total-list-cell"
          :columns="nodeListColumns"
          :data="nodeList"
          @sort="sortNodeList"
          >
        </block-table>
      </div>
      <div v-else-if="currentListType=== ListTypes.txList && !isLoading" class="block-list-wrapper tx-list-wrapper">
        <p v-if="txList && txList.length === 0" class="no-result">
          <img class="empty-icon" src="../../assets/empty.svg">
          No Transaction History
        </p>
        <block-table
          v-if="txList && txList.length > 0"
          root-class="block-total-list"
          cell-class="block-total-list-cell"
          :columns="txListColumns"
          :data="txList"
          >
          <template v-slot:result="slotData">
            <div class="status-item green" v-if="slotData.data">Success</div>
            <div class="status-item red" v-else>Fail</div>
          </template>
        </block-table>
        <div class="page-navigation">
          <page :sizer="sizer" :records-count="txListTotal" :page="txListPage" root-class="block-page" @goto="goto"></page>
        </div>
      </div>
      <div class="loader-con">
        <loader v-if="isLoading"/>
      </div>
      <!--<div>{{JSON.stringify(list)}}</div>-->
    </div>
  </div>
</template>

<script>
import {
  fetchBlockList,
  fetchRoundList,
  fetchRuntimeList,
  fetchRuntimeNodeList,
  fetchRuntimeTxList
} from '../../fetch/index'
import BlockTable from '../../components/Table/index'
import NavBar from '../../components/NavigationBar'
import Page from '../../components/Page'
import Loader from '../../components/Loader';
import Config from '../../config'
  const ListTypes = {
    roundList: 'roundList',
    nodeList: 'nodeList',
    txList: 'txList'
  }
  export default {
    name: 'index',
    components: {
      Loader,
      NavBar,
      BlockTable,
      Page,
    },
    async asyncData({ $axios, store: $store, redirect, params }) {
      // if ($store.state.net !== Config.testnetChainId) {
      //   redirect(`/`)
      //   return
      // }
      let currentListType, currentRuntime
      if (params.listType) {
        currentListType = params.listType
      } else {
        currentListType = ListTypes.nodeList
      }

      const runtimeList = await fetchRuntimeList({ $axios, $store })
      if (runtimeList.length > 0) {
        if (params.runtimeid) {
          currentRuntime = runtimeList.find(({ runtimeId }) => runtimeId === params.runtimeid)
        }
        if (!currentRuntime) {
          currentRuntime = runtimeList[0]
        }
        let roundList = [], nodeList = [], txList = []
        let roundListTotal = 0, nodeListTotal = 0, txListTotal = 0
        if (currentListType === ListTypes.roundList) {
          const { list, totalSize } = await fetchRoundList({ $axios, $store }, currentRuntime.runtimeId)
          roundList = list
          roundListTotal = totalSize
        } else if (currentListType === ListTypes.txList) {
          const { list, totalSize } = await fetchRuntimeTxList({ $axios, $store }, currentRuntime.runtimeId, null)
          txList = list
          txListTotal = totalSize
        } else {
          const { list, totalSize } = await fetchRuntimeNodeList({ $axios, $store }, currentRuntime.runtimeId)
          nodeList = list
          nodeListTotal = totalSize
        }
        return { nodeList, roundList, txList, nodeListTotal, roundListTotal, txListTotal, runtimeList, runtimeListSize: runtimeList.length, currentRuntime, currentListType }
      } else {
        return {runtimeList: [], runtimeListSize: 0, currentRuntime: null, currentListType }
      }
    },
    methods: {
      async sortNodeList({ key, sortType }) {
        console.log(key, sortType)
        if (this.currentNodeListSortKey) {
          const currentSortColumn = this.nodeListColumns.find(c => c.sortKey === this.currentNodeListSortKey)
          currentSortColumn.sortType = ''
        }
        await this.getNodeList(0, key)
        this.currentNodeListSortKey = key
        const co = this.nodeListColumns.find(c => c.sortKey === key)
        co.sortType = 'down'
        this.nodeListColumns = [...this.nodeListColumns]
      },
      async goto(pageNumber, progress = true) {
        if (pageNumber > 1) {
          this.timer && clearTimeout(this.timer)
          this.timer = null
        }
        if (this.currentListType === ListTypes.roundList) {
          await this.getRoundList(pageNumber)
        } else if (this.currentListType === ListTypes.nodeList) {
          await this.getNodeList(pageNumber)
        } else if (this.currentListType === ListTypes.txList) {
          await this.getRuntimeTxList(pageNumber)
        }
        progress && (document.documentElement.scrollTop = document.body.scrollTop = 0)
      },
      async getRoundList(pageNumber) {
        const { $axios, $store } = this
        const { list, totalSize } = await fetchRoundList({ $axios, $store }, this.currentRuntime.runtimeId, pageNumber, this.sizer)
        this.roundListPage = pageNumber
        this.roundList = list
        this.roundListTotal = totalSize
      },
      async getNodeList(pageNumber, sortKey = 0) {
        const { $axios, $store } = this
        const { list, totalSize } = await fetchRuntimeNodeList({ $axios, $store }, this.currentRuntime.runtimeId, pageNumber, this.sizer, sortKey)
        this.nodeListPage = pageNumber
        this.nodeList = list
        this.nodeListTotal = totalSize
      },
      async getRuntimeTxList(pageNumber) {
        const { $axios, $store } = this
        const { list, totalSize } = await fetchRuntimeTxList({ $axios, $store }, this.currentRuntime.runtimeId, null, pageNumber, this.sizer)
        this.txListPage = pageNumber
        this.txList = list
        this.txListTotal = totalSize
      },
      async change(runtime) {
        this.currentRuntime = this.runtimeList.find(({ runtimeId }) => runtimeId === runtime)
        history.replaceState(
          {},
          null,
          `/paratimes/${this.currentRuntime.runtimeId}${this.currentListType ? '/' + this.currentListType : ''}`
        )
        this.isLoading = true
        await this.goto(1)
        this.isLoading = false
      },
      async changeListType(listType) {
        this.currentListType = listType
        history.replaceState(
          {},
          null,
          `/paratimes/${this.currentRuntime.runtimeId}/${listType}`
        )
        this.isLoading = true
        await this.goto(1)
        this.isLoading = false
      }
    },
    computed: {
      isTest() {
        return this.$store.state.net === Config.testnetChainId
      },
    },
    created() {
    },
    destroyed() {
      this.timer && clearTimeout(this.timer)
      this.timer = null
    },
    data() {
      return {
        sizer: 20,
        roundListPage: 1,
        nodeListPage: 1,
        txListPage: 1,
        roundList: [],
        roundListTotal: 0,
        nodeList: [],
        nodeListTotal: 0,
        txList: [],
        txListTotal: 0,
        currentRuntime: null,
        ListTypes,
        currentListType: ListTypes.nodeList,
        isLoading: false,
        currentNodeListSortKey: '',
        nodeListColumns: [
          {
            title: 'Node',
            key: 'entityId'
          },
          {
            title: 'Elected',
            key: 'elected',
            sortKey: 0,
            sortable: true,
            singleSortDirection: true
          },
          {
            title: 'Primary',
            key: 'primary',
            sortKey: 1,
            sortable: true,
            singleSortDirection: true
          },
          {
            title: 'Backup',
            key: 'backup',
            sortKey: 2,
            sortable: true,
            singleSortDirection: true
          },
          {
            title: 'Proposer',
            key: 'proposer',
            sortKey: 3,
            sortable: true,
            singleSortDirection: true
          },
          {
            title: 'Primary\nInvoked',
            key: 'primary_invoked',
            sortKey: 4,
            sortable: true,
            singleSortDirection: true
          },
          {
            title: 'Backup\nInvoked',
            key: 'bckp_invoked',
            sortKey: 7,
            sortable: true,
            singleSortDirection: true
          }
        ],
        roundListColumns: [
          {
            title: 'Round',
            key: 'round'
          },
          {
            title: 'header Type',
            key: 'header_type'
          },
          {
            title: 'IO Root',
            key: 'io_root'
          },
          {
            title: 'State Root',
            key: 'state_root'
          },
          {
            title: 'Times',
            key: 'timestamp',
            slot: true
          }
        ],
        txListColumns: [
          {
            title: 'Tx Hash',
            key: 'txHash'
          },
          {
            title: 'Round',
            key: 'round'
          },
          {
            title: 'Type',
            key: 'type'
          },
          {
            title: 'Status',
            key: 'result',
            slot: true
          },
          {
            title: 'Times',
            key: 'timestamp'
          }
        ]
      }
    },
  }
</script>

<style scoped lang="scss">
  @import "../../assets/css/common";
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
    padding-bottom: rem(24);
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
          .hash-link {
            color: #5f5f5f;
          }
          //width: 200px
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
  .round-list-wrapper {
    .block-total-list{
      /deep/ tr th, /deep/ tr td{
        &:nth-child(3),&:nth-child(4) {
          width: 250px;
        }
      }
    }
  }
  .node-list-wrapper {
    .block-total-list{
      table-layout: auto;
      /deep/ tr th:not(:last-child):not(:first-child) {
        padding-right: 90px;
      }
      /deep/ tr th, /deep/ tr td{
        &:nth-child(1) {
          width: 100%;
        }
        &:last-child {
          padding-left: 0;
          width: auto;
        }
      }
    }
  }
  .tx-list-wrapper {
    .block-total-list{
      table-layout: auto;
      /deep/ tr th, /deep/ tr td{
        &:nth-child(1) {
          .hash-link {
            color: #4472DE;
          }
        }
        &:last-child {
          padding-left: 0;
          width: auto;
        }
      }
      .status-item {
        color: white;
        text-align: center;
        border-radius: rem(4);
        padding: rem(4) rem(12);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        &.green {
          background-color: #2ED47A ;
        }
        &.red {
          background-color: #F7685B;
        }
      }
    }
  }
  .page-navigation {
    display: flex;
    justify-content: flex-end;
    padding: 15px 0;
  }
  .operate {
    display: flex;
    align-items: center;
  }
  .runtime-dropdown {
    padding: rem(2) rem(10);
    border: 1px solid rgba(0, 0, 0, 0.5);
    display: inline-block;
    border-radius: rem(4);
    background-color: #ffffff;
    min-width: rem(230);
    &.show-cur {
      color: #5F5F5F;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .tag-con {
    display: flex;
    flex-direction: row;
    margin-left: rem(20);
    .type {
      display: flex;
      align-items: center;
      text-align: center;
      height: rem(24);
      font-size: rem(12);
      padding: 0 0.75rem;
      border: 1px solid #979797;
      border-radius: rem(4);
      color: #333333;
      margin-left: rem(12);
      margin-bottom: rem(12);
      margin-top: rem(12);
      cursor: pointer;
      background-color: white;
      &.sel {
        color: white;
        background-color: #808080;
      }
      .inactive{
        margin-left: 1.06rem;
      }
      &:first-child {
        margin-left: 0;
      }
    }
  }
  .loader-con {
    margin-top: 60px;
    display: flex;
    justify-content: center;
  }
  .no-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-size: 14px;
    color: rgba(55, 65, 107, 1);
    padding: rem(80) 0;
    .empty-icon {
      width: rem(80);
      margin-bottom: rem(11);
    }
  }

</style>
