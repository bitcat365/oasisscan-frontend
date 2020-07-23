<template>
  <div class="faq-root">
    <nav-bar :active="1" />
    <div class="page-container container">
      <div class="title">
        <h1>FAQ</h1>
      </div>
      <div class="faq-panel">
        <ul class="faq-list">
          <li>
            <a href="/" target="_blank">此处文字和html可以通过改</a>
          </li>
          <li>
            <a href="/" target="_blank">此处文字和html可以通过改</a>
          </li>
          <li>
            <a href="/" target="_blank">此处文字和html可以通过改</a>
          </li>
          <li>
            <a href="/" target="_blank">此处文字和html可以通过改</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import NavBar from '../components/NavigationBar'
  import Panel from '../components/Panel'
  export default {
    components: {
      NavBar,
      Panel
    },
    mounted() {

    },
    beforeDestroy() {
    },
    methods: {
    },
    data() {
      return {
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/common";
  .container {
    padding-bottom: rem(50);
  }
  .faq-root{
    background-color: #f7f7f7;
    min-height: calc(100vh - #{rem(100)});
  }
  .title {
    padding-top: rem(20);
    display: flex;
    align-items: center;
    justify-content: space-between;
    h1 {
      font-size: rem(20);
      padding: 0;
      margin: 0;
      @include regular;
      color: black;
      font-weight: normal;
      span {
        font-size: rem(14);
        color: rgba(0, 0, 0, 0.5);
      }
    }
  }
  .faq-panel {
    background: #FFFFFF;
    border-radius: rem(8);
    min-height: rem(360);
    margin-top: rem(16);
    padding: rem(73) rem(48);
    @include regular;
  }
  .faq-list {
    font-size: rem(14);
    li {
      padding: rem(6) 0;
      line-height: rem(20);
      a {
        color: #3273DC;
        text-decoration: none;
      }
    }
  }
</style>
