<template>
  <div class="menu-list">
    <div class="menu-item1">
      <Icon type="ios-home icon"></Icon>
      <span v-show="open">DASHBOARD</span>
    </div>
    <div class="menu-item2">
      <Icon type="ios-home icon"></Icon>
      <span v-show="open">FAQ</span>
    </div>
    <div class="menu-bot">
      <div :class="open ? 'botIcon1' : 'botIcon2'">
        <Icon type="ios-home icon"></Icon><br v-if="!open" />
        <Icon type="ios-home icon"></Icon>
      </div>
      <div class="botText">
        <span>Powered By</span><br v-if="!open" />
        <span>Bit Cat</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['open']
}
</script>

<style lang="scss" scoped>
.menu-list {
  // border: 1px solid #000;
  [class^='menu-item'] {
    // border: 1px solid #000;
    height: 50px;
    line-height: 50px;
    margin: 0 14px;
    padding: 0 14px;
    text-align: left;
    font-size: 14px;
    color: #1849a9;
  }
  .icon {
    font-size: 30px;
  }
  .menu-item1 {
    border-bottom: 1px solid #e0dff0;
  }
  .menu-item2 {
  }
  .menu-bot {
    height: 100px;
    margin: 30px 0;
    font-size: 14px;
    color: #1849a9;
    display: flex;
    flex-direction: column;
    justify-content: end;
    .botIcon1 {
      text-align: center;
    }
    .botIcon2 {
      margin: 0 14px;
      padding: 0 14px;
      text-align: left;
    }
    .botText {
      text-align: center;
      font-size: 12px;
    }
  }
}
</style>
