<template>
  <nav :class="['nav-bar', $i18n.locale]" role="navigation">
    <div class="container">
      <div class="nav-logo">
        <logo></logo>
      </div>
      <nav ref="navs" class="navs">
        <div v-if="active > 0" ref="slide" class="slide"></div>
        <router-link :to="'/'" class="nav" :class="isActive(1)" @click="tapMenu($event, 1)">DASHBOARD</router-link>
        <router-link :to="'/validators'" class="nav" :class="isActive(2)" @click="tapMenu($event, 2)">VALIDATORS</router-link>
        <router-link :to="'/accounts'" class="nav" :class="isActive(3)" @click="tapMenu($event, 3)">ACCOUNTS</router-link>
        <router-link :to="'/blocks'" class="nav" :class="isActive(4)" @click="tapMenu($event, 4)">BLOCKS</router-link>
        <router-link :to="'/transactions'" class="nav" :class="isActive(5)" @click="tapMenu($event, 5)">TRANSACTIONS</router-link>
        <router-link v-if="isTest" :to="'/paratimes'" class="nav" :class="isActive(6)" @click="tapMenu($event, 6)">PARATIMES</router-link>
      </nav>
      <div class="right-menu">
        <div class="chainid">
          <!--<span class="status"></span>-->
          <!--<span>{{chainId}}</span>-->
          <Dropdown @on-click="networkClick">
            <a class="network-selector" href="javascript:void(0)">
              <div class="left-content">
                <div class="green-dot"></div>
                {{ net }}
              </div>
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu class="network-select-list" slot="list">
              <DropdownItem :name="chainId" class="network-select-item">
                <div class="green-dot"></div>
                Mainnet
              </DropdownItem>
              <DropdownItem :name="testnetChainId" class="network-select-item main-net">
                <div class="green-dot"></div>
                Testnet
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <form v-if="active !== 1" @submit.stop.prevent="onsubmit" class="search-input-con">
          <input v-model="keywords" class="search-input" type="text" placeholder="Search by Address/Entity/Block/Block&Tx hash"></input>
          <div class="search-btn" @click.prevent.stop="onsubmit">
            <img class="search-icon" src="../assets/search.svg"/>
          </div>
        </form>
      </div>
    </div>
  </nav>
</template>

<script>
  import Config from '../config/index.json'
  import Logo from './Logo'
  import Vue from 'vue'
  import { onSearch } from '../fetch';

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
        chainId: Config.chainId,
        testnetChainId: Config.testnetChainId,
        keywords: ''
      }
    },
    methods: {
      isActive(index) {
        return this.active === index ? 'active item' : 'inactive item'
      },
      tapMenu(e, index) {
        // console.log(e)
        this.active = index
        this.slide(index)
      },
      slide(index) {
        if (index <= 0) {
          return
        }
        const navs = this.$refs.navs.children
        Vue.nextTick(() => {
          this.$refs.slide.style.width = navs[index].offsetWidth + 'px'
          this.$refs.slide.style.transform = 'translateX(' + navs[index].offsetLeft + 'px)'
          // console.log(navs[index].offsetLeft)
        })
      },
      onsubmit() {
        onSearch(this, this.keywords)
      },
      networkClick(name) {
        // console.log('name', name)
        if (name === Config.testnetChainId) {
          location.href = '//' + location.host.replace('www.oasisscan.com', 'testnet.oasisscan.com')
        } else {
          location.href = '//' + location.host.replace('testnet.oasisscan.com', 'www.oasisscan.com')
        }
        this.$store.commit('SET_NET', name)
      }
    },
    computed: {
      isTest() {
        return this.$store.state.net === Config.testnetChainId
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
    background-image: linear-gradient(269deg, #ff3f0f 0%, #FF3F0F 100%);
    > .container {
      width: 100%;
      margin: 0 auto;
      position: relative;
      > .navs{
        position: relative;
        display: flex;
        font-size: rem(16);
        width: rem(1200);
        height: 100%;
        margin: 0 auto;
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
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        font-size: 20px;
        color: white;
        display: flex;
        align-items: stretch;
      }
      > .right-menu {
        position: absolute;
        right: 0.89rem;
        top: 0;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        > .search-input-con{
          overflow:hidden;
          border: 1px solid white;
          border-radius: 2px;
          display: flex;
          height: rem(32);
          width: rem(350);
          margin-left: rem(20);
          align-items: stretch;
          .search-input {
            flex: 1;
            margin-right: rem(2);
            border: 0;
            background-color: transparent;
            outline: none;
            color: white;
            @include regular;
            padding: 0 rem(11);
            font-size: 12px;
            &::placeholder{
              color: rgba(255, 255, 255, 0.8);
            }
          }
          .search-btn {
            width: rem(32);
            background-color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            .search-icon {
              width: rem(18);
              height: rem(18);
            }
          }
        }
        > .chainid{
          height: 100%;
          color: white;
          font-size: 0.8rem;
          line-height: 1;
          @include regular;
          display: flex;
          align-items: center;
          .status{
            width: rem(10);
            height: rem(10);
            border-radius: 50%;
            margin-right: 0.42rem;
            background-color: #40FF02;
          }
          .green-dot {
            display: inline-block;
            width: 10px;
            height: 10px;
            background-color: #40FF02;
            border-radius: 100%;
          }
          a.network-selector {
            font-size: rem(14);
            border-radius:rem(2);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: rem(8);
            background-color: white;
            color: #2A2A2A;
            width: rem(110);
            height: rem(32);

          }
          .network-select-list {
            padding:0 rem(5);
            min-width: rem(110);
            .network-select-item {
              font-size: rem(14) !important;
              padding: rem(8);
              height: rem(32);
              &:hover {
                background: transparent;
                font-weight: bold;
              }
            }
          }
        }
      }

    }
  }
  @media screen and (max-width:rem(1200 + 240 * 2)){
    .nav-bar{
      > .container {
        > .navs{
          margin-left: rem(240);
          margin-right: rem(240);
          width: auto;
        }
      }
    }
  }
</style>
