<template>
  <div class="panel-wrapper">
    <div class="panel-title">
      <div class="panel-title-left">
        <slot name="icon"></slot>
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
  padding: rem(20);
}
.panel-title {
  @extend .flexRow;
  margin-bottom: rem(25);
}
.panel-title-left {
  font-size: 1rem;
}
.panel-title-right {
  font-size: rem(14);
}
</style>
