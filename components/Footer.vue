<template>
  <section class="footer">
    Power By OASIS SCAN
  </section>
</template>

<script>
  import Logo from './Logo'
  export default {
    name: 'Footer',
    components: {
      Logo
    },
    methods: {
      languageClick(name) {
        if (name === this.$store.state.locale) {
          return
        }
        let path = location.pathname
        path = path[path.length - 1] !== '/' ? path + '/' : path
        const regStr = '^\\/(' + this.$store.state.locales.join('|') + ')\\/'
        const matched = path.match(new RegExp(regStr))
        let newPath = ''
        if (matched) {
          newPath = path.replace(new RegExp(regStr), `/${name}/`)
          this.$router.replace(newPath)
        } else {
          newPath = '/' + name + path
          this.$router.replace(newPath)
        }
      }
    },
    data() {
      return {
      }
    },
    computed: {

    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/common";
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: linear-gradient(269deg, #FF7322 0%, #FF3F0F 100%);
    border: 1px solid #979797;
    height: 5.75rem;
    color: white;
    font-size: 1.13rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1.88rem;
    @include medium;;
  }
</style>
