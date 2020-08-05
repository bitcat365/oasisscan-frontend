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
            史蒂夫·乔布斯
            <p slot="content">史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</p>
          </Panel>
          <Panel key="2">
            斯蒂夫·盖瑞·沃兹尼亚克
            <p slot="content">斯蒂夫·盖瑞·沃兹尼亚克（Stephen Gary Wozniak），美国电脑工程师，曾与史蒂夫·乔布斯合伙创立苹果电脑（今之苹果公司）。斯蒂夫·盖瑞·沃兹尼亚克曾就读于美国科罗拉多大学，后转学入美国著名高等学府加州大学伯克利分校（UC Berkeley）并获得电机工程及计算机（EECS）本科学位（1987年）。</p>
          </Panel>
          <Panel key="3">
            乔纳森·伊夫
            <p slot="content">乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人。</p>
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
