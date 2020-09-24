<template>
  <div class="faq-root">
    <nav-bar :active="-1" />
    <div class="page-container container">
      <div class="title">
        <h1>FAQ</h1>
      </div>
      <div class="faq-panel">
        <Collapse value="0">
          <Panel key="1">
            About account emoji
            <p slot="content">
              🦐 < 1000 </br>
              🦞 < 10000 </br>
              🦀️ < 100000 </br>
              🐟 < 1000000 </br>
              🐬 < 10000000 </br>
              🐋 < 100000000 </br>
              🐳 < 10000000000 </br>
            </p>
          </Panel>
          <Panel key="2">
            Backend API
            <p slot="content">
             <a href="https://github.com/SimplyVC/oasis_api_server" target="_blank" > https://github.com/SimplyVC/oasis_api_server </a>
            </p>
          </Panel>
          <Panel key="3">
            Copyright and tools 
            <p slot="content">
            Icons made by  <a href="https://www.flaticon.com/"  target="_blank">www.flaticon.com</a> and  <a href="https://www.iconfont.cn"  target="_blank" >www.iconfont.cn</a> 
              
            </p>
          </Panel>
        </Collapse>
        <!--<ul class="faq-list">-->
          <!--<li>-->
            <!--<a href="/" target="_blank">此处文字和html可以通过改</a>-->
          <!--</li>-->
          <!--<li>-->
            <!--<a href="/" target="_blank">此处文字和html可以通过改</a>-->
          <!--</li>-->
          <!--<li>-->
            <!--<a href="/" target="_blank">此处文字和html可以通过改</a>-->
          <!--</li>-->
          <!--<li>-->
            <!--<a href="/" target="_blank">此处文字和html可以通过改</a>-->
          <!--</li>-->
        <!--</ul>-->
      </div>
    </div>
  </div>
</template>

<script>
  import NavBar from '../components/NavigationBar'
  export default {
    components: {
      NavBar,
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
    padding: rem(48);
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
