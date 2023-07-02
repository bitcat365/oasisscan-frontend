<template>
  <div>
    <nav-bar />
    <tab-menu :active="3"></tab-menu>
    <div class="page-container container">
      <block-info :blockInfo="blockInfo"></block-info>
      <div class="title">
        <h1>CURRENT NETWORK PARAMETERS</h1>
      </div>
      <panel root-class="parameters-panel">
        <template v-slot:header>
          <span>{{net}}</span>
        </template>
        <div class="parameters-content">

<p><a href="https://github.com/oasislabs/public-testnet-artifacts/releases/download/2020-03-05/genesis.json" target="_blank">Genesis Document</a>:</p>
<br />
<p>sha1: 641a88d66085dcb8f310a1564227d478ed9a524d</p>
<p>sha256: f551c11d6545deecbc26b4973bb0ea04f3f555066ba9739bd175221660f367f1</p>

<br />
<p>Oasis Seed Node Address:</p>
<br />
<p>D14B9192C94F437E9FA92A755D3CC0341F2E87CF@34.82.86.53:26656</p>
<br />

<p>Oasis Core version:</p>
<br />
<p><a href="https://github.com/oasislabs/oasis-core/releases/tag/v20.4.1" target="_blank">20.4.1</a></p>
<br />
<p>More info: <a href="https://docs.oasis.dev/operators/current-testnet-parameters.html#deployment-change-log" target="_blank">Oasis doc: Current Testnet Parameters</a></p>

        </div>
      </panel>
    </div>
  </div>
</template>

<script>
  import { fetchBlockInfo } from '../../fetch/index'
  import NavBar from '../../components/NavigationBar'
  import TabMenu from '../../components/TabMenu'
  import BlockInfo from '../../components/index/BlockInfo'
  import Panel from '../../components/panel/Panel'
  import Cofig from '../../config/index'
  export default {
    name: 'index',
    components: {
      NavBar,
      TabMenu,
      BlockInfo,
      Panel
    },
    async asyncData({ $axios, store: $store }) {
      const blockInfo = await fetchBlockInfo({ $axios, $store })
      return { blockInfo }
    },
    methods: {
    },
    computed: {
      net() {
        return this.$store.state.net
      }
    },
    created() {
    },
    mounted() {

    }
  }
</script>

<style scoped lang="scss">

  .container {
    padding-top: 30px;
  }
  .title {
    height: 4.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    h1 {
      font-size: 1.5rem;
      padding: 0;
      margin: 0;
      @include regular;;
      color: black;
      font-weight: normal;
    }
  }
  .parameters-panel{
    border: 1px solid #979797;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50);
    border-radius: 2px;
  }
  .parameters-content{
    min-height: 46.81rem;
    padding: 1.38rem 1.75rem;
    font-size: 1.25rem;
    font-weight: normal;
    line-height: 1.75rem;
    @include medium;
    color: #626262;
  }
</style>
