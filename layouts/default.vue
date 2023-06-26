<template>
  <div id="page-container">
    <Menu />
    <main :style="{ width: `calc(100% - ${menuWidth})` }">
      <div class="page-right">
        <Header class="page-header"></Header>
        <nuxt />
      </div>
    </main>
  </div>
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
    return {}
  },
  computed: {
    menuWidth() {
      return this.$store.state.menuOpen ? '16rem' : '6.25rem'
    }
  },
  methods: {}
}
</script>
<style lang="scss">
@import '../assets/css/common';
#page-container {
  min-height: 100vh;
  background-color: $page-background;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.page-right {
  margin: 0 rem(24);
  .page-header {
    margin: rem(20) 0;
  }
}
body,
button,
input,
select,
textarea,
a {
  color: $n-color;
}
a:visited,
a:active {
  color: $n-color;
}
html {
  font-size: $rem-base + px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  /* Retina-specific stuff here */
  html {
    font-size: $rem-base/1 + px;
  }
}
body {
  @include fontFamily;
}
#__layout {
  position: relative;
  min-height: 100vh;
  // padding-bottom: rem(100);
  // min-width: rem(1280);
}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
.ivu-spin-dot {
  background-color: #ff3f0f;
}
</style>
