<template>
  <div :style="{ width: menuWidth }" class="menu">
    <div class="menu-top">
      <div class="menu-logo">
        <router-link to="/">
          <SvgIcon class="logo-oasis" className="svgIcon" iconName="menulogo" v-show="menuOpen" />
        </router-link>
        <router-link to="/">
          <SvgIcon class="logo-oasis" className="svgIcon1" iconName="menulogo1" v-show="!menuOpen" />
        </router-link>
        <SvgIcon class="menu-right" className="svgIcon2 pointer" iconName="menutoleft" v-show="menuOpen" @click="close()" />
        <SvgIcon class="menu-right" className="svgIcon2 pointer" iconName="menutoright" v-show="!menuOpen" @click="open()" />
      </div>
      <nav class="menu-list1">
        <template v-for="(item,index) in menuList1">
          <router-link
            v-if="item.to"
            :key="item.id"
            :to="item.to"
            :class="className(item.to)"
          >
            <SvgIcon v-if="item.iconName" :className="ifActive(item.to) ? 'svgClass-active' : 'svgClass'" :iconName="item.iconName" />
            <span :class="menuOpen ? '' : 'hoverText'">{{ item.name }}</span>
          </router-link>
          <span v-else-if="!item.to && menuOpen" class="menu-item menu-item-open">{{ item.name }}</span>
        </template>
      </nav>
      <div class="menu-list2">
        <router-link :to="'/FAQ'" :class="className('/FAQ') + ' top-border'">
          <SvgIcon :className="ifActive('/FAQ') ? 'svgClass-active' : 'svgClass'" iconName="FAQ" />
          <span :class="menuOpen ? '' : 'hoverText'">FAQ</span>
        </router-link>
        <!-- <div
          :class="className('2-2') + ' pointer'"
          @click="
            theme == 'dark' ? (theme = 'light') : (theme = 'dark')
          "
        >
          <SvgIcon :className="active === '2-2' ? 'svgClass-active' : 'svgClass'" :iconName="theme" />
          <span v-show="menuOpen">{{ theme == 'dark' ? 'Dark Theme' : 'Light Theme' }}</span>
          <span v-show="!menuOpen" class="hoverText">{{ theme == 'dark' ? 'Dark Theme' : 'Light Theme' }}</span>
        </div> -->
      </div>
    </div>
    <div class="menu-bot">
      <div :class="menuOpen ? 'botIcon1' : 'botIcon2'">
        <a href="https://twitter.com/BitCat365" target="_blank"><SvgIcon className="svgClass pointer" iconName="Twitter" /></a>
        <a href="https://t.me/joinchat/LBbAfRU0nlwushyr9sfJAQ" target="_blank"><SvgIcon className="svgClass pointer" iconName="Telegram" /></a>
      </div>
      <div class="botText">
        <span>Powered By</span><br v-if="!menuOpen" />
        <a href="https://www.bitcat365.com" target="_blank" class="link"> Bit Cat</a>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchRuntimeList } from '../fetch/index'
export default {
  name: 'Menu',
  data() {
    return {
      theme: 'dark', // realTheme=light
      // active: null,
      runtimeList: []
    }
  },
  props: {},
  computed: {
    menuOpen() {
      return this.$store.state.menuOpen
    },
    menuWidth() {
      return this.$store.state.menuOpen ? '14.5rem' : '4.5rem'
    },
    menuList1() {
      let menuList = [
        { id: '1-1', name: 'DASHBOARD', to: '/', iconName: 'home' },
        { id: '1-2', name: 'VALIDATORS', to: '/validators', iconName: 'validator' },
        { id: '1-3', name: 'ACCOUNTS', to: '/accounts', iconName: 'accounts' },
        { id: '1-4', name: 'BLOCKS', to: '/blocks', iconName: 'blocks' },
        { id: '1-5', name: 'TRANSACTIONS', to: '/transactions', iconName: 'transactions' },
        { id: '1-6', name: 'PROPOSALS', to: '/proposals', iconName: 'proposals' }
      ]
      if (this.runtimeList.length > 0) {
        menuList.push({ id: '1-7', name: 'PARATIMES', key: '/paratimes' })
        this.runtimeList.forEach(ele => {
          menuList.push({ id: '1-' + menuList.length + 1, name: ele.name, to: { path: '/paratimes/' + ele.runtimeId, query: ele }, iconName: 'paratimes' })
        })
      }
      return menuList
    }
  },
  methods: {
    open() {
      this.$store.commit('SET_MENU_OPEN', true)
    },
    close() {
      this.$store.commit('SET_MENU_OPEN', false)
    },
    ifActive(to) {
      const path = typeof to == 'string' ? to : to.path
      const res = this.$route.path == path ? true : this.$route.path.startsWith(path + '/') ? true : this.$route.path.startsWith(to.key)
      return res
    },
    className(to) {
      if (this.$store.state.menuOpen) {
        return this.ifActive(to) ? 'menu-item menu-item-open menu-item-active' : 'menu-item menu-item-open'
      } else {
        return this.ifActive(to) ? 'menu-item menu-item-close menu-item-active' : 'menu-item menu-item-close'
      }
    },
    async RuntimeList() {
      const { $axios, $store } = this
      const runtimeList = await fetchRuntimeList({ $axios, $store })
      if (runtimeList.length > 0) {
        this.runtimeList = runtimeList
      } else {
        this.runtimeList = []
      }
    }
  },
  created() {
    this.RuntimeList()
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/utils';
.menu {
  height: 100%;
  min-height: 100vh;
  background-color: $theme-background;
  border-radius: 0 15px 15px 0;
  @extend .flexColumn;
}
.menu-top {
  .menu-logo {
    height: rem(120);
    padding: rem(30) 0;
    text-align: center;
    position: relative;
    .logo-oasis {
      margin: auto;
    }
    .menu-right {
      position: absolute;
      right: rem(-10);
      bottom: 0;
    }
    .svgIcon {
      width: rem(200);
      height: rem(60);
      position: relative;
      left: rem(-6);
    }
    .svgIcon1 {
      width: rem(50);
      height: rem(50);
      margin: rem(5) auto;
    }
    .svgIcon2 {
      width: rem(30);
      height: rem(30);
    }
  }
  [class^='menu-list'] {
    .menu-item {
      position: relative;
      display: block;
      height: rem(40);
      line-height: rem(40);
      margin: rem(10) rem(16);
      font-size: rem(16);
      color: $theme-color;
      border-radius: 5px;
      .hoverText {
        position: absolute;
        visibility: hidden;
        top: rem(10);
        left: rem(54);
        height: rem(28);
        line-height: rem(28);
        padding: 0 rem(10);
        color: $theme-background;
        background-color: $theme-color;
        border-radius: 5px;
        white-space: nowrap;
      }
    }
    .menu-item:hover .hoverText {
      visibility: visible;
      z-index: 999;
    }
    .menu-item-open {
      padding: 0 rem(5);
      text-align: left;
    }
    .menu-item-close {
      text-align: center;
    }
    .menu-item:hover {
      font-weight: bold;
    }
    .menu-item-active {
      font-weight: bold;
      color: $theme-background;
      background-color: $theme-color;
    }
    .svgClass {
      vertical-align: -0.6em;
      width: rem(30);
      height: rem(30);
    }
    .svgClass-active {
      vertical-align: -0.6em;
      width: rem(30);
      height: rem(30);
      color: $theme-background;
      background-color: $theme-color;
    }
  }
  .menu-list1 {
  }
  .menu-list2 {
    .top-border {
      border-top: 1px solid #e0dff0;
    }
  }
}
.menu-bot {
  height: 100%;
  padding-bottom: rem(30);
  font-size: rem(14);
  color: $gray500;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  .svgClass {
    vertical-align: -0.7em;
    width: rem(30);
    height: rem(30);
    color: $blue500;
  }
  .botIcon1 {
    text-align: center;
    margin: rem(4) 0;
  }
  .botIcon2 {
    margin: rem(4) 0;
    height: rem(68);
    @extend .flexColumn;
    align-items: center;
  }
  .botText {
    text-align: center;
    font-size: rem(12);
    .link{
      color: $blue500;
    }
  }
}
</style>
