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
            {{ currentRuntime ? currentRuntime.runtimeId : ''}}
            <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem v-for="runtime in runtimeList" :key="runtime.runtimeId" :name="runtime.runtimeId">
              {{ runtime.runtimeId }}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <div class="tag-con">
          <div :class="['type', currentListType === ListTypes.nodeList ? 'sel' : '']" @click="changeListType(ListTypes.nodeList)">Node List</div>
          <div :class="['type', currentListType === ListTypes.roundList ? 'sel' : '']" @click="changeListType(ListTypes.roundList)">Round</div>
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
        <block-table v-if="nodeList && nodeList.length > 0" root-class="block-total-list" cell-class="block-total-list-cell" :columns="nodeListColumns" :data="nodeList">
        </block-table>
      </div>
      <div class="loader-con">
        <loader v-if="isLoading"/>
      </div>
      <!--<div>{{JSON.stringify(list)}}</div>-->
    </div>
  </div>
</template>

<script>
import {fetchBlockList, fetchRoundList, fetchRuntimeList, fetchRuntimeNodeList} from '../../fetch/index'
import BlockTable from '../../components/Table/index'
import NavBar from '../../components/NavigationBar'
import Page from '../../components/Page'
import Loader from '../../components/Loader';
import Config from '../../config'
  const ListTypes = {
    roundList: 'roundList',
    nodeList: 'nodeList'
  }
  export default {
    name: 'index',
    components: {
      Loader,
      NavBar,
      BlockTable,
      Page,
    },
    async asyncData({ $axios, store: $store, redirect }) {
      if ($store.state.net !== Config.testnetChainId) {
        redirect(`/`)
        return
      }
      const runtimeList = await fetchRuntimeList({ $axios, $store })
      console.log('runtimeList', runtimeList)
      if (runtimeList.length > 0) {
        const currentRuntime = runtimeList[0]
        const { list, totalSize } = await fetchRuntimeNodeList({ $axios, $store }, currentRuntime.runtimeId)
        console.log('list', list)
        return { nodeList: list, nodeListTotal: totalSize, runtimeList, runtimeListSize: runtimeList.length, currentRuntime }
      } else {
        return { nodeList: [], nodeListTotal: 0, runtimeList: [], runtimeListSize: 0, currentRuntime: null }
      }
    },
    methods: {
      async goto(pageNumber, progress = true) {
        if (pageNumber > 1) {
          this.timer && clearTimeout(this.timer)
          this.timer = null
        }
        if (this.currentListType === ListTypes.roundList) {
          await this.getRoundList(pageNumber)
        } else {
          await this.getNodeList(pageNumber)
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
      async getNodeList(pageNumber) {
        const { $axios, $store } = this
        const { list, totalSize } = await fetchRuntimeNodeList({ $axios, $store }, this.currentRuntime.runtimeId, pageNumber, this.sizer)
        this.nodeListPage = pageNumber
        this.nodeList = list
        this.nodeListTotal = totalSize
      },
      async change(runtime) {
        this.currentRuntime = this.runtimeList.find(({ runtimeId }) => runtimeId === runtime)
        this.isLoading = true
        await this.goto(1)
        this.isLoading = false
      },
      async changeListType(listType) {
        this.currentListType = listType
        if (listType === ListTypes.nodeList && this.nodeList.length === 0) {
          this.isLoading = true
          await this.goto(1)
          this.isLoading = false
        } else if (listType === ListTypes.roundList && this.roundList.length === 0) {
          this.isLoading = true
          await this.goto(1)
          this.isLoading = false
        }
      }
    },
    computed: {
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
        nodeListTotal: 0,
        roundListTotal: 0,
        roundList: [],
        nodeList: [],
        currentRuntime: null,
        ListTypes,
        currentListType: ListTypes.nodeList,
        isLoading: false,
        nodeListColumns: [
          {
            title: 'Entity ID',
            key: 'entityId'
          },
          {
            title: 'Elected',
            key: 'elected'
          },
          {
            title: 'Primary',
            key: 'primary'
          },
          {
            title: 'Backup',
            key: 'backup'
          },
          {
            title: 'Proposer',
            key: 'proposer'
          },
          {
            title: 'Primary\nInvoked',
            key: 'primary_invoked'
          },
          {
            title: 'Backup\nInvoked',
            key: 'bckp_invoked'
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
          width: 200px;
        }
      }
    }
  }
  .node-list-wrapper {
    .block-total-list{
      /deep/ tr th, /deep/ tr td{
        &:nth-child(1) {
          width: 200px;
        }
        &:last-child {
          padding-left: 0;
          width: auto;
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
    min-width: rem(390);
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
