<template>
  <div class="panel-wrapper">
    <div class="panel-title">
      <div class="panel-title-left">
        <slot name="icon" class="icon"></slot>
        <slot v-if="!title" name="header"></slot>
        <span v-else>{{ title }}</span>
      </div>
      <div class="panel-title-right">
        <slot name="headerRight"></slot>
      </div>
    </div>
    <div class="panel-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import NoRecord from '../NoRecord.vue'
export default {
  components: { NoRecord },
  name: 'PanelSmall',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  created() {}
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/utils';
.panel-wrapper {
  background-color: #fff;
  border-radius: rem(15);
  padding: rem(15) rem(20);
  display: flex;
  flex-direction: column;
  height: 100%;
}
.panel-title {
  @extend .flexRow;
  margin-bottom: rem(30);
  .panel-title-left {
    font-size: rem(14);
    color: $gray500;
    display: flex;
    flex-direction: row;
    align-items: center;
    .icon {
      margin-right: rem(8);
    }
  }
  .panel-title-right {
    font-size: rem(20);
  }
}
.panel-content {
  border-top: 1px solid $gray100;
}
</style>
