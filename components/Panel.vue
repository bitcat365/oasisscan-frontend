<template>
  <div class="panel-wrapper">
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
  export default {
    name: 'Panel',
    props: {
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
    }
  }
</script>

<style lang="scss" scoped>
  .panel-wrapper{
    background-color: white;
    padding: rem(20);
    border-radius: rem(8);
  }
  .panel-title{
    position: relative;
    font-size: 1rem;
    @include regular;
    color: #3C3C3C;
    line-height: 1;
    display: flex;
    align-items: center;
  }
</style>
