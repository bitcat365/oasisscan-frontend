<template>
  <div class="root">
    <nav-bar :active="5" />
    <div class="page-container container">
      <div class="title">
        <h1>EVENT DETAILS</h1>
      </div>
      <panel>
        <template v-slot:header>
          <span>Overview</span>
        </template>
        <v-table class="v-table" :headers="listSchema" :data="data">
          <template v-slot:timestamp="{data}">
            <span>{{data.value | timeFormat}} ( {{data.value | timeFormat2}} )</span>
          </template>
        </v-table>
      </panel>
      <panel class="trx-panel">
        <template v-slot:header>
          <span>Contents</span>
        </template>
        <div class="raw-data">
          <pre> {{data.raw | pretty}}</pre>
        </div>
      </panel>
    </div>
  </div>
</template>

<script>
  import Panel from '../../components/Panel'
  import VTable from '../../components/VTable/index'
  import NavBar from '../../components/NavigationBar'
  import { fetchEventDetail } from '~/fetch/index'
  export default {
    name: 'eventDetail',
    components: { NavBar, Panel, VTable},
    async asyncData({ $axios, store: $store, params }) {
      const data = await fetchEventDetail({ $axios, $store }, params.id)
      return {
        data
      }
    },
    data() {
      return {
        listSchema: [
          {
            label: 'Tx Hash',
            key: 'txHash'
          },
          {
            label: 'Height',
            key: 'height'
          },
          {
            label: 'Time',
            key: 'timestamp',
            slot: true
          },
          {
            label: 'Type',
            key: 'type'
          },
        ],
      }
    },
    async mounted() {
    },
    methods: {
    }
  }
</script>

<style scoped lang="scss">
  .root {
    background-color: #f7f7f7;
    padding-bottom: rem(50);
    min-height: calc(100vh - #{rem(100)});
  }
  .raw-data {
    background: #F8F9FA;
    border: 1px solid #B2B2B2;
    border-radius: rem(4);
    max-height: rem(400);
    overflow-y: scroll;
    padding: rem(15) rem(20);
    margin-top: rem(30);
    margin-left: rem(20);
    margin-right: rem(20);
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
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
  .error-message {
    color: #F7685B;
  }
  .status-success {
    background-color: #2ED47A;
  }
</style>
