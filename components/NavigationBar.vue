<template>
  <nav :class="['nav-bar', $i18n.locale]" role="navigation">
    <div class="container">
      <div class="nav-logo">
        <logo></logo>
      </div>
      <nav ref="navs" class="navs">
        <div ref="slide" class="slide"></div>
        <router-link :to="'/'" class="nav" :class="isActive(1)" @click="tapMenu($event, 1)">DASHBOARD</router-link>
        <router-link :to="'/validators'" class="nav" :class="isActive(2)" @click="tapMenu($event, 2)">VALIDATORS</router-link>
        <router-link :to="'/blocks'" class="nav" :class="isActive(3)" @click="tapMenu($event, 3)">BLOCKS</router-link>
        <router-link :to="'/transactions'" class="nav" :class="isActive(4)" @click="tapMenu($event, 4)">TRANSACTIONS</router-link>
      </nav>
      <div class="chainid">
        <span class="status"></span>
        <span>{{chainId}}</span>
      </div>
    </div>
  </nav>
</template>

<script>
  import Config from '../config/index.json'
  import Logo from './Logo'
  import Vue from 'vue'
  console.log('Config', Config)
  export default {
    name: 'NavigationBar',
    props: {
      active: {
        type: Number,
        default: 1
      }
    },
    components: {
      Logo
    },
    data() {
      return {
        chainId: Config.chainId
      }
    },
    methods: {
      isActive(index) {
        return this.active === index ? 'active item' : 'inactive item'
      },
      tapMenu(e, index) {
        console.log(e)
        this.active = index
        this.slide(index)
      },
      slide(index) {
        const navs = this.$refs.navs.children
        Vue.nextTick(() => {
          this.$refs.slide.style.width = navs[index].offsetWidth + 'px'
          this.$refs.slide.style.transform = 'translateX(' + navs[index].offsetLeft + 'px)'
          console.log(navs[index].offsetLeft)
        })
      }
    },
    computed: {
      isTest() {
        return this.$store.state.net === 'testnet'
      },
      net() {
        return this.$store.state.net
      }
    },
    mounted() {
      this.slide(this.active)
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
    height: rem(60);
    background-image: linear-gradient(269deg, #FF7322 0%, #FF3F0F 100%);
    border: 1px solid #979797;
    > .container {
      align-items: stretch;
      display: flex;
      width: 100%;
      margin: 0 auto;
      position: relative;
      justify-content: space-between;
      > .navs{
        position: relative;
        display: flex;
        font-size: rem(16);
        > .nav {
          display: flex;
          align-items: center;
          padding: rem(6);
          cursor: pointer;
          color: white;
          &.active {
            @include bold;
          }
        }
        > .slide{
          transition: all .3s;
          position: absolute;
          height: rem(2);
          background-color: white;
          top: 0;
          z-index: 2;
          left: 0;
          width: rem(114);
        }
      }
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
        line-height: 1;
        @include regular;
        display: flex;
        align-items: center;
        margin-right: 0.89rem;
        .status{
          width: rem(10);
          height: rem(10);
          border-radius: 50%;
          margin-right: 0.42rem;
          background-color: #40FF02;
        }
      }
    }
  }
</style>
