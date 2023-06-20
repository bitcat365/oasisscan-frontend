<template>
  <article id="home">
    <section :style="{ width: widthLeft + 'px' }" class="menu">
      <!-- <SvgIcon className="icon1" iconName="menulogo1" />
      <SvgIcon :iconStyle="{ width: '30px', height: '30px' }" iconName="menulogo1" /> -->
      <div class="menu-logo">
        <img class="logo-oasis" src="../assets/menulogo.svg" v-show="open" />
        <SvgIcon class="logo-oasis" :iconStyle="{ width: '50px', height: '50px' }" iconName="menulogo1" v-show="!open" />
        <SvgIcon class="menu-right" :iconStyle="{ width: '30px', height: '30px' }" iconName="menutoleft" v-show="open" @click="open = false" />
        <SvgIcon class="menu-right" :iconStyle="{ width: '30px', height: '30px' }" iconName="menutoright" v-show="!open" @click="open = true" />
      </div>
      <Menu :open="open">菜单</Menu>
    </section>
    <main class="main-right"></main>
  </article>
</template>

<script>
import Menu from '../components/Menu.vue'
export default {
  components: {
    Menu
  },
  data() {
    return {
      open: true
    }
  },
  computed: {
    widthLeft() {
      return this.open ? 256 : 100
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.icon1 {
  width: 30px;
  height: 30px;
  // color: #175cd3;
}
#home {
  min-height: 100vh;
  background-color: #f1f1f1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.menu {
  // border: 1px solid #000;
  height: 100%;
  background-color: #fff;
  border-radius: 0 15px 15px 0;
  .menu-logo {
    // border: 1px solid #000;
    height: 120px;
    padding: 30px 0;
    text-align: center;
    position: relative;
    .logo-oasis {
      margin: auto;
    }
    .menu-right {
      position: absolute;
      right: -15px;
      bottom: 0;
    }
  }
}
.main-right {
  border: 1px solid #000;
  height: 80vh;
  width: 100%;
  margin: 0 24px;
}
</style>
