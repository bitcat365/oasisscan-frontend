<template>
  <nav :class="['nav-bar', $i18n.locale]" role="navigation">
    <div class="container">
      <div class="nav-logo">
        <logo></logo>
      </div>
      <div class="chainid">
        <span class="label">CHAIN-ID</span>
        {{chainId}}
      </div>
    </div>
  </nav>
</template>

<script>
  import Config from '../config/index.json'
  import Logo from './Logo'
console.log('Config', Config)
  export default {
    name: 'NavigationBar',
    props: ['activeMenu'],
    components: {
      Logo
    },
    data() {
      return {
        chainId: Config.chainId
      }
    },
    methods: {
    },
    computed: {
      isTest() {
        return this.$store.state.net === 'testnet'
      },
      net() {
        return this.$store.state.net
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/common";

  .nav-bar{
    position: relative;
    z-index: 100;
    align-items: stretch;
    display: flex;
    line-height: 1;
    background-image: linear-gradient(269deg, #FF7322 0%, #FF3F0F 100%);
    border: 1px solid #979797;
    > .container {
      align-items: stretch;
      display: flex;
      width: 100%;
      margin: 0 auto;
      position: relative;
      justify-content: space-between;
      > .nav-logo{
        height: 100%;
        font-size: 20px;
        color: white;
        display: flex;
        align-items: stretch;
      }
      > .chainid{
        color: white;
        font-size: 1rem;
        @include regular;;
        display: flex;
        align-items: center;
        padding-right: 0.89rem;
        span {
          color: #C8C8C8;
          font-size: 1rem;
          padding-right: 0.42rem;
        }
      }
    }
  }
</style>
