<template>
  <div :class="rootClasses">
    <div class="panel-title">
      <slot name="icon"></slot>
      <slot name="header"></slot>
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
      rootClass: {
        type: String,
        default: ''
      }
    },
    created() {
      this.rootClasses = cls('panel-wrapper', this.rootClass)
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/common";
  .panel-wrapper{
    background-color: white;
    padding:0;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.5);
  }
  .panel-title{
    position: relative;
    height: 3rem;
    font-size: 1rem;
    background: #E0E0E0;
    border: 1px solid #D8D8D8;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50);
    @include regular;;
    color: #3C3C3C;
    line-height: 1;
    display: flex;
    align-items: center;
    padding-left: 2.81rem;
  }
</style>
