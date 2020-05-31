<template>
  <div :class="rootClasses">
    <div class="panel-title">
      <slot name="icon"></slot>
      <slot v-if="!title" name="header"></slot>
      <span v-else>{{title}}</span>
    </div>
    <div class="panel-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import cls from 'classnames'
  export default {
    name: 'Panel',
    props: {
      className: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        rootClasses: 'panel-wrapper'
      }
    },
    created() {
      this.rootClasses = cls('panel-wrapper', this.className)
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/common";
  .panel-wrapper{
    background-color: white;
    padding: rem(20);
    border-radius: rem(8);
  }
  .panel-title{
    position: relative;
    height: 3rem;
    font-size: 1rem;
    @include regular;
    color: #3C3C3C;
    line-height: 1;
    display: flex;
    align-items: center;
  }
</style>
