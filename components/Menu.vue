<template>
  <div :style="{ width: menuWidth }" class="menu">
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
      <template v-for="item in menuList1" :key="item.index">
        <router-link
          v-if="item.path"
          :to="item.path"
          :class="className(item.index)"
          @click.native="
            active = item.index
            item.open = !item.open
          "
        >
          <SvgIcon v-if="item.iconName" :className="active === item.index ? 'svgClass-active' : 'svgClass'" :iconName="item.iconName" />
          <span v-if="menuOpen" :class="menuOpen?'':'hoverText'">{{ item.name }}</span>
        </router-link>
        <span v-else-if="!item.path && menuOpen" class="menu-item menu-item-open">{{ item.name }}</span>
      </template>
    </nav>
    <div class="menu-list2">
      <router-link :to="'/FAQ'" :class="className(8) + ' top-border'" @click.native="active = 8">
        <SvgIcon :className="active === 8 ? 'svgClass-active' : 'svgClass'" iconName="FAQ" />
        <span v-show="menuOpen">FAQ</span>
        <span v-show="!menuOpen" class="hoverText">FAQ</span>
      </router-link>
      <div
        :class="className(9) + ' pointer'"
        @click="
          active = 9
          theme == 'dark' ? (theme = 'light') : (theme = 'dark')
        "
      >
        <SvgIcon :className="active === 9 ? 'svgClass-active' : 'svgClass'" :iconName="theme" />
        <span v-show="menuOpen">{{ theme == 'dark' ? 'Dark Theme' : 'Light Theme' }}</span>
        <span v-show="!menuOpen" class="hoverText">{{ theme == 'dark' ? 'Dark Theme' : 'Light Theme' }}</span>
      </div>
    </div>
    <div class="menu-bot">
      <div :class="menuOpen ? 'botIcon1' : 'botIcon2'">
        <SvgIcon className="svgClass pointer" iconName="Twitter" />
        <SvgIcon className="svgClass pointer" iconName="Telegram" />
      </div>
      <div class="botText">
        <span>Powered By</span><br v-if="!menuOpen" />
        <span>Bit Cat</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      theme: 'dark', // realTheme=light
      active: null,
      menuList1: [
        { index: 1, name: 'DASHBOARD', path: '/', iconName: 'home' },
        { index: 2, name: 'VALIDATORS', path: '/validators', iconName: 'validator' },
        { index: 3, name: 'ACCOUNTS', path: '/accounts', iconName: 'accounts' },
        { index: 4, name: 'BLOCKS', path: '/blocks', iconName: 'blocks' },
        { index: 5, name: 'TRANSACTIONS', path: '/transactions', iconName: 'transactions' },
        { index: 6, name: 'PROPOSALS', path: '/proposals', iconName: 'proposals' },
        { index: 7, name: 'PARATIMES', path: '' },
        { index: 8, name: 'Emerald', path: '/emerald', iconName: 'paratimes' },
        { index: 9, name: 'Sapphire', path: '/sapphire', iconName: 'paratimes' },
        { index: 10, name: 'Cipher', path: '/cipher', iconName: 'paratimes' },
      ]
    }
  },
  props: {
  },
  computed: {
    menuOpen() {
      return this.$store.state.menuOpen
    },
    menuWidth() {
      return this.$store.state.menuOpen ? '16rem' : '6.25rem'
    }
  },
  methods: {
    open() {
      this.$store.commit('SET_MENU_OPEN', true)
    },
    close() {
      this.$store.commit('SET_MENU_OPEN', false)
    },
    className(index) {
      if (this.$store.state.menuOpen) {
        return this.active === index ? 'menu-item menu-item-open menu-item-active' : 'menu-item menu-item-open'
      } else {
        return this.active === index ? 'menu-item menu-item-close menu-item-active' : 'menu-item menu-item-close'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/utils';
.menu {
  height: 100%;
  background-color: $theme-background;
  border-radius: 0 15px 15px 0;
  display: flex;
  flex-direction: column;
}
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
    right: rem(-15);
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
    height: rem(50);
    line-height: rem(50);
    margin: 0 rem(25);
    font-size: rem(14);
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
  }
  .menu-item-open {
    padding: 0 rem(10);
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
    vertical-align: -0.7em;
    width: rem(30);
    height: rem(30);
  }
  .svgClass-active {
    vertical-align: -0.7em;
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
.menu-bot {
  height: 100%;
  padding-bottom: rem(30);
  font-size: rem(14);
  color: $theme-color;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  .svgClass {
    vertical-align: -0.7em;
    width: rem(30);
    height: rem(30);
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
  }
}
</style>
