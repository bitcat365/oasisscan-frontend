<template>
  <div class="root">
    <nav-bar :active="7" />
    <div class="page-container container">
      <div class="title">
        <h1>PROPOSAL DETAILS</h1>
      </div>
      <panel>
        <template v-slot:header>
          <span>Header</span>
        </template>
        <div class="overview-content">
          <v-table class="v-table" :headers="listSchema" :data="data">
          </v-table>
          <pie-chart :options="data.options"></pie-chart>
        </div>
      </panel>
  <panel class="trx-panel" v-if="!isRequesting">
        <template v-slot:header>
          <span>Votes</span>
        </template>
        <p v-if="data.votes.length === 0" class="no-result">
          <img class="empty-icon" src="../../assets/empty.svg">
          {{$t('noVotes')}}
        </p>
        <block-table
          v-if="data.votes.length > 0"
          :data="data.votes"
          :columns="columns"
          root-class="block-total-list"
          cell-class="block-total-list-cell"
        >
        </block-table>
<!--        <div v-if="total > 0" class="page-navigation">-->
<!--          <page type="simple" :sizer="sizer" :records-count="total" :page="page" root-class="block-page" @goto="goto"></page>-->
<!--        </div>-->
      </panel>
    </div>
  </div>
</template>

<script>
  import Panel from '../../components/panel/Panel'
  import BlockTable from '../../components/Table/index'
  import Page from '../../components/Page'
  import VTable from '../../components/VTable/index'
  import PieChart from '../../components/proposals/piechart'
  import NavBar from '../../components/NavigationBar'
  import { fetchProposalDetail, fetchVotes} from '../../fetch';

  export default {
    name: 'proposalDetail',
    components: { NavBar, Panel, BlockTable, Page, VTable, PieChart },
    async asyncData({ $axios, store: $store, params }) {
      const data = await fetchProposalDetail({ $axios, $store }, params.id)
      return {
        data
      }
    },
    data() {
      return {
        isRequesting: false,
        listSchema: [
          {
            label: 'ID',
            key: 'id'
          },
          {
            label: 'Submitter',
            key: 'submitter'
          },
          {
            label: 'Status',
            key: 'state'
          },
          {
            label: 'Deposit',
            key: 'deposit'
          },
          {
            label: 'Type',
            key: 'type'
          },
          {
            label: 'Handler',
            key: 'handler'
          }
        ],
        list: [],
        total: 0,
        sizer: 10,
        page: 1,
        columns: [
          {
            title: 'Voter',
            key: 'voter'
          },
          {
            title: 'Vote',
            key: 'vote'
          }
        ]
      }
    },
    async mounted() {
      // await this.fetchList()
      // this.isRequesting = false
    },
    methods: {
      goto() {
        // this.fetchList()
      },
      async fetchList() {
        const $axios = this.$axios
        const $store = this.$store
        const { list } = await fetchVotes({ $axios, $store }, this.$route.params.id)
        this.list = list
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
  .trx-panel {
    margin-top: rem(12);
    .block-total-list {
      width: 100%;
      margin-left: 0;
      /deep/ tr td{
        &:nth-child(1) {
          .hash-link {
            color: #5f5f5f;
          }
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
  .overview-content{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>
