<template>
  <div id="page-container" v-if="show">
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
import 'vue2-toast/lib/toast.css'
import Menu from '../components/Menu.vue'
import Header from '../components/Header.vue'
export default {
  components: {
    Menu,
    Header
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    menuWidth() {
      return this.$store.state.menuOpen ? '14.5rem' : '4.5rem'
    }
  },
  methods: {
    changeMenuWidth(){
      // console.log(window.innerWidth);
      if(window.innerWidth <= 1440 && this.$store.state.menuOpen){
        this.$store.commit('SET_MENU_OPEN', false)
      }else if(window.innerWidth > 1440 && !this.$store.state.menuOpen){
        this.$store.commit('SET_MENU_OPEN', true)
      }
    }
  },
  mounted(){
    this.changeMenuWidth()
    this.show = true
    window.onresize = () => {
      return (() => {
        this.$nextTick(() => {
          this.changeMenuWidth()
        });
      })();
    };
  }
}
</script>
<style lang="scss">
#page-container {
  min-width: 1280px;
  min-height: 100vh;
  @include fontFamily;
  font-weight: 500;
  background-color: $page-background;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.page-right {
  padding: rem(20);
  .page-header {
    margin-bottom: rem(20);
  }
}
</style>
