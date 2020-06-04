<template>
  <div>
    <section class="main-content">
      <nuxt />
    </section>
    <Footer />
  </div>
</template>
<script>
  import Footer from '../components/Footer'
  export default {
    components: {
      Footer
    }
  }
</script>
<style lang="scss">
  @import "../assets/css/common";
  .page-container {
    position: relative;
    margin: 0 auto;
    width: rem(1200);
  }
  body, button, input, select, textarea, a {
    color: $n-color;
  }
  a:visited,a:active{
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
  @media
  (-webkit-min-device-pixel-ratio: 2),
  (min-resolution: 192dpi) {
    /* Retina-specific stuff here */
    html {
      font-size: $rem-base/1 + px;
    }
  }
body{
}
#__layout {
  position: relative;
  min-height: 100vh;
  padding-bottom: rem(100);
  min-width: 1000px;
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
</style>
