<template>
  <div class="menu-list">
    <nav class="menu-list1">
      <router-link
        v-for="item in menuList1"
        :key="item.index"
        :to="item.path"
        :class="className(item.index)"
        @click.native="
          active = item.index
          item.open = !item.open
        "
      >
        <SvgIcon :className="active === item.index ? 'svgClass-active' : 'svgClass'" :iconName="item.iconName" />
        <span v-show="open">{{ item.name }}</span>
        <span v-show="!open" class="hoverText">{{ item.name }}</span>
        <SvgIcon v-show="open && item.children" :className="active === item.index ? 'svgClass-active' : 'svgClass'" :iconName="item.open ? 'down' : 'right'" />
      </router-link>
    </nav>
    <div class="menu-list2">
      <router-link :to="'/FAQ'" :class="className(8) + ' top-border'" @click.native="active = 8">
        <SvgIcon :className="active === 8 ? 'svgClass-active' : 'svgClass'" iconName="FAQ" />
        <span v-show="open">FAQ</span>
        <span v-show="!open" class="hoverText">FAQ</span>
      </router-link>
      <div
        :class="className(9) + ' pointer'"
        @click="
          active = 9
          theme == 'dark' ? (theme = 'light') : (theme = 'dark')
        "
      >
        <SvgIcon :className="active === 9 ? 'svgClass-active' : 'svgClass'" :iconName="theme" />
        <span v-show="open">{{ theme == 'dark' ? 'Dark Theme' : 'Light Theme' }}</span>
        <span v-show="!open" class="hoverText">{{ theme == 'dark' ? 'Dark Theme' : 'Light Theme' }}</span>
      </div>
    </div>
    <div class="menu-bot">
      <div :class="open ? 'botIcon1' : 'botIcon2'">
        <SvgIcon className="svgClass pointer" iconName="Twitter" />
        <SvgIcon className="svgClass pointer" iconName="Telegram" />
      </div>
      <div class="botText">
        <span>Powered By</span><br v-if="!open" />
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
        { index: 7, name: 'PARATIMES', path: '/paratimes', iconName: 'paratimes', children: [{ name: 'Emerald', path: '/emerald' }, { name: 'Cipher', path: '/cipher' }, { name: 'Sapphire', path: '/sapphire' }], open: false }
      ]
    }
  },
  props: {
    open: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    className(index) {
      if (this.open) {
        return this.active === index ? 'menu-item menu-item-open menu-item-active' : 'menu-item menu-item-open'
      } else {
        return this.active === index ? 'menu-item menu-item-close menu-item-active' : 'menu-item menu-item-close'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/common';
@import '../assets/css/utils';
.menu-list {
  border-radius: 8px;
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
.menu-bot {
  margin: rem(30) 0;
  font-size: rem(14);
  color: $theme-color;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  .botIcon1 {
    text-align: center;
    margin: rem(4) 0;
  }
  .botIcon2 {
    margin: rem(4) 0;
    height: rem(68);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .botText {
    text-align: center;
    font-size: rem(12);
  }
}
</style>
