<template>
  <article id="home">
    <section :style="{ width: widthLeft }" class="menu">
      <div class="menu-logo">
        <router-link to="/">
          <SvgIcon class="logo-oasis" className="svgIcon" iconName="menulogo" v-show="open" />
        </router-link>
        <router-link to="/">
          <SvgIcon class="logo-oasis" className="svgIcon1" iconName="menulogo1" v-show="!open" />
        </router-link>
        <SvgIcon class="menu-right" className="svgIcon2 pointer" iconName="menutoleft" v-show="open" @click="open = false" />
        <SvgIcon class="menu-right" className="svgIcon2 pointer" iconName="menutoright" v-show="!open" @click="open = true" />
      </div>
      <Menu :open="open" />
    </section>
    <main :style="{ width: `calc(100% - ${widthLeft})` }">
      <div class="home-right">
        <Header class="page-header"></Header>
        <div class="page-content"></div>
      </div>
    </main>
  </article>
</template>

<script>
import Menu from '../components/Menu.vue'
import Header from '../components/Header.vue'
export default {
  components: {
    Menu,
    Header
  },
  data() {
    return {
      open: true,
      keywords: ''
    }
  },
  computed: {
    widthLeft() {
      return this.open ? '16rem' : '6.25rem'
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
@import '../assets/css/common';
@import '../assets/css/utils';
#home {
  min-height: 100vh;
  background-color: $page-background;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.menu {
  height: 100%;
  background-color: $theme-background;
  border-radius: 0 15px 15px 0;
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
}
.home-right {
  margin: 0 rem(24);
  .page-header {
    margin-top: rem(30);
  }
  .page-content{
    margin-top: rem(20);
  }
}
</style>
