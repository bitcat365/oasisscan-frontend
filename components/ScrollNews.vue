<template>
  <div>
    <div class="textBox">
      <transition name="slide">
        <p class="text" :key="text.id">
          <a :href="text.link">
            <img class="laba" src="../assets/laba.png">
            {{text.val}}
          </a>
        </p>
      </transition>
    </div>
  </div>
</template>

<script>
  import Config from '../config/index'
  export default {
    name: 'scroll',
    data() {
      return {
        textArr: Config.news,
        number: 0
      }
    },
    computed: {
      text() {
        const news = Config.news[this.number]
        return {
          id: this.number,
          link: news.url,
          val: news.content
        }
      }
    },
    mounted() {
      this.startMove()
    },
    methods: {
      startMove() {
        // eslint-disable-next-line
        let timer = setTimeout(() => {
          if (this.number === 2) {
            this.number = 0
          } else {
            this.number += 1
          }
          this.startMove()
        }, 2000) // 滚动不需要停顿则将2000改成动画持续时间
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/common";
  .laba{
    width: rem(20);
    margin-right: rem(10);
  }
  .textBox {
    width: 100%;
    height: rem(30);
    margin: 0 auto;
    overflow: hidden;
    position: relative;
  }
  .text {
    width: 100%;
    position: absolute;
    bottom: 0;
  }
  a {
    align-items: center;
    display: flex;
    font-size: rem(16);
    justify-content: center;
  }
  .slide-enter-active, .slide-leave-active {
    transition: all 0.5s linear;
  }
  .slide-enter{
    transform: translateY(rem(20)) scale(1);
    opacity: 1;
  }
  .slide-leave-to {
    transform: translateY(rem(-20)) scale(0.8);
    opacity: 0;
  }
</style>
