<template>
  <section class="footer">
    <div class="page-container">
      <div class="logo">
        <img src="../assets/oasis-logo.png" />
        Power By Bit Cat
      </div>
      <div class="social-con">
        <div class="social">
          <a href="https://twitter.com/BitCat365" target="_blank" class="social-item twitter">
            <img src="../assets/twitter.png">
          </a>
          <a href="https://t.me/joinchat/LBbAfRU0nlwushyr9sfJAQ" target="_blank" class="social-item telegram">
            <img src="../assets/telegram.png">
          </a>
        </div>
        Need help? FAQ
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'Footer',
    components: {
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
    background-color: #595959;
    height: rem(100);
    color: white;
    font-size: 1.13rem;
    display: flex;
    align-items: center;
    justify-content: center;
    @include medium;
    .logo {
      display: flex;
      flex-direction: column;
      font-size: rem(14);
      padding-top: rem(15);
      img {
        width: rem(61);
        margin-bottom: rem(10);
      }
    }
    .social-con {
      position: absolute;
      top: rem(35);
      right: rem(0);
      font-size: rem(14);
      line-height: rem(20);
      text-align: right;
      .social {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        font-size: 0;
        line-height: 1;
        margin-bottom: rem(5);
        > .social-item {
          margin-left: rem(10);
          img {
            width: rem(30);
          }
        }
      }
    }
  }
</style>
