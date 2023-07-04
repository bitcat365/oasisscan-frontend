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
export default {
  name: 'Panel',
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
}
.panel-title {
  @extend .flexRow;
  margin-bottom: rem(25);
}
.panel-title-left {
  font-size: 1rem;
  color: $gray500;
  display: flex;
  flex-direction: row;
  align-items: center;
  .icon{
    margin-right: rem(8);
  }
}
.panel-title-right {
  font-size: rem(20);
}
.panel-content {
  border-top: 1px solid $gray100;
}
</style>
