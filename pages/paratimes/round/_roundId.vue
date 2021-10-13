<template>
  <div class="root">
    <nav-bar :active="6" />
    <div class="page-container container">
      <div class="title">
        <h1>Round DETAILS</h1>
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
            <span>{{data.value | timeFormat}} ( {{data.value | timeFormat2}} )</span>
          </template>
        </v-table>
      </panel>
    </div>
  </div>
</template>

<script>
  import Panel from '../../../components/Panel'
  import BlockTable from '../../../components/Table/index'
  import ArrowNavigate from '../../../components/ArrowNavigate'
  import Page from '../../../components/Page'
  import VTable from '../../../components/VTable/index'

  import NavBar from '../../../components/NavigationBar'
  import {fetchRoundDetail} from '../../../fetch'

  export default {
    name: 'blockDetail',
    components: { NavBar, Panel, VTable, ArrowNavigate },
    async asyncData({ $axios, store: $store, params, route }) {
      const data = await fetchRoundDetail({ $axios, $store }, route.query.runtime, params.roundId)
      console.log('data', data)
      return {
        data,
        isLast: !data.next
      }
    },
    data() {
      return {
        listSchema: [
          {
            label: 'Round',
            key: 'round',
            slot: true
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
          }
        ],
      }
    },
    async mounted() {
    },
    methods: {
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
  @import "../../../assets/css/common";
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
    }
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
