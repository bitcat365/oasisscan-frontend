<template>
  <div class="root">
    <Head title="ROUND DETAILS" class="title">
      <template #HeadLeft>
        <div class="paratime-tag">Paratime</div>
      </template>
    </Head>
    <panel title="Header">
      <Description :list="listSchema" class="info-list">
        <template #round>
          <div class="label-content">{{data.round}} <arrow-navigate :is-last="isLast" @pre="pre" @next="next"/></div>
        </template>
        <template #timestamp>
          <span>{{data.timestamp | timeFormat}} ( {{data.timestamp | timeFormat2}} )</span>
        </template>
      </Description>
      <!-- <v-table class="v-table" :headers="listSchema" :data="data">
        <template v-slot:round="slotData">
          <div class="label-content">{{slotData.data}} <arrow-navigate :is-last="isLast" @pre="pre" @next="next"/></div>
        </template>
        <template v-slot:timestamp="{data}">
          <span>{{data | timeFormat}} ( {{data | timeFormat2}} )</span>
        </template>
      </v-table> -->
    </panel>
    <panel class="trx-panel" title="Transactions">
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
</template>

<script>
  import Head from '~/components/Head'
  import Panel from '../../../components/panel/Panel'
  import BlockTable from '../../../components/Table/index'
  import ArrowNavigate from '../../../components/ArrowNavigate'
  import Page from '../../../components/Page'
  import Description from '~/components/description/index.vue'
  import VTable from '../../../components/VTable/index'
  import {fetchRoundDetail, fetchRuntimeTxList} from '../../../fetch'
  import Loader from '../../../components/Loader';

  export default {
    name: 'roundDetail',
    components: { Head, Panel, Description, VTable, ArrowNavigate, BlockTable,  Loader,Page },
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
    computed: {
      listSchema(){
        return [{
          title: 'Round',
          name: 'round'
        },
        {
          title: 'Runtime ID',
          content: this.data.runtimeIdAndName || ''
        },
        {
          title: 'Header Type',
          content: this.data.header_type || ''
        },
        {
          title: 'Time',
          name: 'timestamp'
        },
        {
          title: 'Previous Hash',
          content: this.data.previous_hash || ''
        },
        {
          title: 'IO Toot',
          content: this.data.io_root || ''
        },
        {
          title: 'State Toot',
          content: this.data.state_root || ''
        },
        {
          title: 'Messages Hash',
          content: this.data.messages_hash || ''
        },
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
  .label-content {
    display: flex;
    align-items: center;
  }
  .title {
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
