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
#page-container {
  min-width: 1512px;
  min-height: 100vh;
  @include fontFamily;
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
</style>
