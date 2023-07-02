<template>
  <div class="root">
    <nav-bar :active="6" />
    <div class="page-container container">
      <div class="title">
        <h1>ROUND DETAILS</h1>
        <div class="paratime-tag">Paratime</div>
      </div>
      <panel>
        <template v-slot:header>
          <span>Header</span>
        </template>
        <v-table class="v-table" :headers="listSchema" :data="data">
          <template v-slot:round="slotData">
            <div class="label-content">{{slotData.data}} <arrow-navigate :is-last="isLast" @pre="pre" @next="next"/></div>
          </template>
          <template v-slot:timestamp="{data}">
            <span>{{data | timeFormat}} ( {{data | timeFormat2}} )</span>
          </template>
        </v-table>
      </panel>
      <panel class="trx-panel">
        <template v-slot:header>
          <span>Transactions</span>
        </template>
        <div class="loader-con"  v-if="isRequesting">
          <loader/>
        </div>
        <p v-if="total === 0 && !isRequesting" class="no-result">
          <img class="empty-icon" src="../../../assets/empty.svg">
          {{$t('noTx')}}
        </p>
        <block-table
          v-if="total > 0 && !isRequesting"
          :data="list"
          :columns="columns"
          root-class="block-total-list"
          cell-class="block-total-list-cell"
        >
          <template v-slot:result="{data}">
            <span v-if="data" class="status-success">Success</span>
            <span v-else class="status-fail" :data-data="data">Fail</span>
          </template>
          <template v-slot:timestamp="{data}">
            <span>{{data.value | timeFormat}}</span>
          </template>
        </block-table>
        <div v-if="total > 0 && !isRequesting" class="page-navigation">
          <page type="simple" :sizer="sizer" :records-count="total" :page="page" root-class="block-page" @goto="goto"></page>
        </div>
      </panel>
    </div>
  </div>
</template>

<script>
  import Panel from '../../../components/panel/Panel'
  import BlockTable from '../../../components/Table/index'
  import ArrowNavigate from '../../../components/ArrowNavigate'
  import Page from '../../../components/Page'
  import VTable from '../../../components/VTable/index'

  import NavBar from '../../../components/NavigationBar'
  import {fetchRoundDetail, fetchRuntimeTxList} from '../../../fetch'
  import Loader from '../../../components/Loader';

  export default {
    name: 'roundDetail',
    components: { NavBar, Panel, VTable, ArrowNavigate, BlockTable,  Loader,Page },
    async asyncData({ $axios, store: $store, params, route }) {
      const data = await fetchRoundDetail({ $axios, $store }, route.query.runtime, params.roundId)
      return {
        data,
        isLast: !data.next
      }
    },
    data() {
      return {
        isRequesting: true,
        listSchema: [
          {
            label: 'Round',
            key: 'round',
            slot: true
          },
          {
            label: 'Runtime ID',
            key: 'runtimeIdAndName'
          },
          {
            label: 'Header Type',
            key: 'header_type'
          },
          {
            label: 'Time',
            key: 'timestamp',
            slot: true
          },
          {
            label: 'Previous Hash',
            key: 'previous_hash'
          },
          {
            label: 'IO Toot',
            key: 'io_root'
          },
          {
            label: 'State Toot',
            key: 'state_root'
          },
          {
            label: 'Messages Hash',
            key: 'messages_hash'
          },
        ],
        list: [],
        total: 0,
        sizer: 10,
        page: 1,
        columns: [
          {
            title: 'Tx Hash',
            key: 'txHash'
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
            title: 'Round',
            key: 'round'
          },
          {
            title: 'Time',
            key: 'timestamp',
            slot: true
          }
        ]
      }
    },
    async mounted() {
      await this.fetchList()
      this.isRequesting = false
    },
    methods: {
      goto(pageNumber) {
        this.fetchList(pageNumber)
      },
      async fetchList(page = 1) {
        const $axios = this.$axios
        const $store = this.$store
        const runtime = this.$route.query.runtime
        const roundId = this.$route.params.roundId
        const { list, totalSize } = await fetchRuntimeTxList({ $axios, $store }, runtime, roundId, page, this.sizer)
        this.list = list
        this.total = totalSize
        this.page = page
      },
      pre() {
        this.$router.push(`./${parseInt(this.$route.params.roundId) - 1}?runtime=${this.$route.query.runtime}`)
      },
      next() {
        this.$router.push(`./${parseInt(this.$route.params.roundId) + 1}?runtime=${this.$route.query.runtime}`)
      }
    }
  }
</script>

<style scoped lang="scss">
  .root {
    background-color: #f7f7f7;
    padding-bottom: rem(50);
    min-height: calc(100vh - #{rem(100)});
  }
  .label-content {
    display: flex;
    align-items: center;
  }
  .v-table {
    margin-top: rem(16);
  }
  .container {
  }
  .title {
    padding-top: rem(20);
    padding-bottom: rem(20);
    display: flex;
    align-items: center;
    justify-content: flex-start;
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
    .paratime-tag {
      background: #ccc;
      color: white;
      font-size: rem(16);
      border-radius: rem(12);
      padding: 0 rem(8);
      margin-left: rem(8);
    }
  }
  .trx-panel {
    margin-top: rem(12);
    .block-total-list {
      width: 100%;
      margin-left: 0;
      /deep/ tr th, /deep/ tr td{
        &:nth-child(1) {
          width: 300px;
          text-align: left;
        }
      }
    }
  }
  .page-navigation {
    padding-top: 30px;
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
  .status-fail,.status-success {
    padding: rem(4) rem(10);
    color: white;
    border-radius: rem(4);
    font-size: rem(12);
  }
  .status-fail {
    background-color: #F7685B;
  }
  .status-success {
    background-color: #2ED47A;
  }
  .loader-con {
    margin-top: 60px;
    display: flex;
    justify-content: center;
  }
</style>
