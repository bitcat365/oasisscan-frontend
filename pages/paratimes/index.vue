<template>
  <div class="blocks-root">
    <Head :title="titleName" class="title">
      <template #HeadLeft>
        <span class="HeadLeft"> ({{ runtimeId }})</span>
      </template>
    </Head>
    <Panel class="panel">
      <div class="tag-con" slot="headerLeft">
        <div :class="['type', currentListType === ListTypes.nodeList ? 'sel' : '']" @click="changeListType(ListTypes.nodeList)">Nodes</div>
        <div :class="['type', currentListType === ListTypes.roundList ? 'sel' : '']" @click="changeListType(ListTypes.roundList)">Rounds</div>
        <div :class="['type', currentListType === ListTypes.txList ? 'sel' : '']" @click="changeListType(ListTypes.txList)">Transactions</div>
      </div>
      <Input slot="headerRight" v-if="currentListType === ListTypes.nodeList" v-model="nodeName" prefix="ios-search" placeholder="Node Filter" />
      <div v-if="currentListType === ListTypes.roundList" class="block-list-wrapper round-list-wrapper">
        <BlockTable :loading="loading" :columns="roundListColumns" :data="roundList">
          <template v-slot:timestamp="{ data }">
            <span>{{ data.value | timeFormat }} </span>
          </template>
        </BlockTable>
        <Page :sizer="roundListSizer" :records-count="roundListTotal" :page="roundListPage" root-class="block-page" @goto="goto"></Page>
      </div>
      <div v-else-if="currentListType === ListTypes.nodeList" class="block-list-wrapper node-list-wrapper">
        <BlockTable :loading="loading" :columns="nodeListColumns" :data="filterNodes" @sort="sortNodeList">
          <template v-slot:status="{ data }">
            <span v-if="data" class="success">Online</span>
            <span v-else class="error">Offline</span>
          </template>
        </BlockTable>
      </div>
      <div v-else-if="currentListType === ListTypes.txList" class="block-list-wrapper tx-list-wrapper">
        <BlockTable :loading="loading" :columns="txListColumns" :data="txList">
          <template v-slot:result="{ data }">
            <ColourDiv :color="data ? 'success' : 'error'">{{ data ? 'Success' : 'Fail' }}</ColourDiv>
          </template>
        </BlockTable>
        <Page :sizer="txListSizer" :records-count="txListTotal" :page="txListPage" root-class="block-page" @goto="goto"></Page>
      </div>
    </Panel>
  </div>
</template>

<script>
import { fetchRoundList, fetchRuntimeNodeList, fetchRuntimeTxList } from '../../fetch/index'
import Head from '~/components/Head'
import Panel from '~/components/panel/Panel'
import BlockTable from '../../components/Table/index'
import Page from '../../components/Page'
import ColourDiv from '~/components/colourDiv/colourDiv'
import Config from '../../config'
const ListTypes = {
  roundList: 'roundList',
  nodeList: 'nodeList',
  txList: 'txList'
}
export default {
  name: 'index',
  components: {
    Head,
    Panel,
    BlockTable,
    Page,
    ColourDiv
  },
  async asyncData({ $axios, store: $store, query }) {
    let currentListType, runtimeId, titleName
    if (query.listType) {
      currentListType = query.listType
    } else {
      currentListType = ListTypes.nodeList
    }
    if (query.runtimeId) {
      runtimeId = query.runtimeId
    }else{
      runtimeId = ''
    }
    if (query.name) {
      titleName = query.name
    }else{
      titleName = ''
    }
    let roundList = [],
      nodeList = [],
      txList = []
    let roundListTotal = 0,
      nodeListTotal = 0,
      txListTotal = 0,
      onlineNodes = 0,
      offlineNodes = 0
    if (currentListType === ListTypes.roundList) {
      const { list, totalSize } = await fetchRoundList({ $axios, $store }, runtimeId)
      roundList = list
      roundListTotal = totalSize
    } else if (currentListType === ListTypes.txList) {
      const { list, totalSize } = await fetchRuntimeTxList({ $axios, $store }, runtimeId, null)
      txList = list
      txListTotal = totalSize
    } else {
      const { list, totalSize, online, offline } = await fetchRuntimeNodeList({ $axios, $store }, runtimeId)
      nodeList = list
      nodeListTotal = totalSize
      onlineNodes = online
      offlineNodes = offline
    }
    return {
      runtimeId,
      titleName,
      currentListType,
      onlineNodes,
      offlineNodes,
      nodeList,
      roundList,
      txList,
      nodeListTotal,
      roundListTotal,
      txListTotal,
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
    async goto(pageNumber, pageSize, progress = true) {
      // if (pageNumber > 1) {
      //   this.timer && clearTimeout(this.timer)
      //   this.timer = null
      // }
      this.loading = true
      if (this.currentListType === ListTypes.roundList) {
        await this.getRoundList(pageNumber, pageSize)
      } else if (this.currentListType === ListTypes.nodeList) {
        await this.getNodeList(pageNumber)
      } else if (this.currentListType === ListTypes.txList) {
        await this.getRuntimeTxList(pageNumber, pageSize)
      }
      this.loading = false
      progress && (document.documentElement.scrollTop = document.body.scrollTop = 0)
    },
    async getRoundList(pageNumber, pageSize) {
      const { $axios, $store } = this
      const { list, totalSize } = await fetchRoundList({ $axios, $store }, this.runtimeId, pageNumber, pageSize)
      this.roundListPage = pageNumber
      this.roundListSizer = pageSize
      this.roundList = list
      this.roundListTotal = totalSize
    },
    async getNodeList(pageNumber, sortKey = 0) {
      const { $axios, $store } = this
      const { list, totalSize, offline, online } = await fetchRuntimeNodeList({ $axios, $store }, this.runtimeId, pageNumber, this.sizer, sortKey)
      this.nodeListPage = pageNumber
      this.nodeList = list
      this.nodeListTotal = totalSize
      this.onlineNodes = online
      this.offlineNodes = offline
    },
    async getRuntimeTxList(pageNumber, pageSize) {
      const { $axios, $store } = this
      const { list, totalSize } = await fetchRuntimeTxList({ $axios, $store }, this.runtimeId, null, pageNumber, pageSize)
      this.txListPage = pageNumber
      this.txListSizer = pageSize
      this.txList = list
      this.txListTotal = totalSize
    },
    async changeListType(listType) {
      this.currentListType = listType
      let query = Object.assign({}, this.$route.query, { listType: listType })
      this.$router.push({ path: this.$route.path, query: query })
      await this.goto(1)
    }
  },
  computed: {
    isTest() {
      return this.$store.state.net === Config.testnetChainId
    },
    filterNodes() {
      return this.nodeList.filter(item => {
        let filter = true
        if (this.nodeName) {
          filter = !!item.entityId && !!item.entityId.text && item.entityId.text.toLowerCase().indexOf(this.nodeName.toLowerCase()) >= 0
        }
        return filter
      })
    }
  },
  created() {},
  destroyed() {
    // this.timer && clearTimeout(this.timer)
    // this.timer = null
  },
  data() {
    return {
      loading: false,
      sizer: 20,
      roundListSizer: 20,
      txListSizer: 20,
      roundListPage: 1,
      nodeListPage: 1,
      txListPage: 1,
      roundList: [],
      roundListTotal: 0,
      nodeList: [],
      nodeListTotal: 0,
      txList: [],
      txListTotal: 0,
      ListTypes,
      currentListType: ListTypes.nodeList,
      currentNodeListSortKey: '',
      onlineNodes: 0,
      offlineNodes: 0,
      nodeName: '',
      nodeListColumns: [
        // {
        //   title: '#',
        //   key: 'rank',
        //   textAlign: 'left',
        //   width: '5%'
        // },
        {
          title: 'Node',
          key: 'entityId',
          width: '30%'
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
          title: 'Status',
          key: 'status',
          slot: true,
          textAlign: 'right'
        }
      ],
      roundListColumns: [
        {
          title: 'Round',
          key: 'round'
        },
        {
          title: 'Header Type',
          key: 'header_type'
        },
        {
          title: 'IO Root',
          key: 'io_root',
          width: '30%'
        },
        {
          title: 'State Root',
          key: 'state_root',
          width: '30%'
        },
        {
          title: 'Times',
          key: 'timestamp',
          slot: true,
          textAlign: 'right'
        }
      ],
      txListColumns: [
        {
          title: 'Tx Hash',
          key: 'txHash',
          width: '35%'
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
          key: 'timestamp',
          textAlign: 'right'
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.success {
  color: $success500;
}
.error {
  color: $error500;
}
.HeadLeft {
  color: $gray500;
  font-size: rem(16);
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
    @include regular;
    color: black;
    font-weight: normal;
    span {
      font-size: rem(14);
      color: rgba(0, 0, 0, 0.5);
    }
  }
}

.block-list-wrapper {
  .title {
    margin-left: 0px;
    margin-top: 6px;
    font-size: 18px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(55, 65, 107, 1);
    line-height: 1;
    display: flex;
    align-items: center;
    > .icon {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
  }
  .total-records {
    margin-left: 40px;
    margin-top: 9px;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(55, 65, 107, 0.5);
    line-height: 1;
  }
}
.operate {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .tags {
    display: flex;
    align-items: center;
    flex-direction: row;
    margin-bottom: rem(0);
    margin-top: rem(20);
  }
  input[type='text'] {
    width: rem(206);
    height: rem(30);
    border: 0;
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.5);
    border-radius: rem(4);
    padding: 0 rem(16);
    outline: none;
  }
}
.runtime-dropdown {
  padding: rem(2) rem(10);
  border: 1px solid rgba(0, 0, 0, 0.5);
  display: inline-block;
  border-radius: rem(4);
  background-color: #ffffff;
  min-width: rem(230);
  &.show-cur {
    color: #5f5f5f;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.panel {
  /deep/.ivu-input {
    width: rem(320);
    font-size: 1rem;
    color: $gray500;
    background-color: $gray100;
    border: 0;
    border-radius: rem(8);
  }
  /deep/.ivu-input:focus {
    box-shadow: none;
  }
  .tag-con {
    display: flex;
    flex-direction: row;
    .type {
      display: flex;
      align-items: center;
      text-align: center;
      height: rem(28);
      font-size: rem(14);
      padding: 0 0.75rem;
      border: 1px solid $gray200;
      border-radius: rem(8);
      color: $gray500;
      margin-left: rem(8);
      cursor: pointer;
      background-color: white;
      &.sel {
        color: white;
        background-color: $theme-color;
      }
      &:first-child {
        margin-left: 0;
      }
    }
  }
}
</style>
