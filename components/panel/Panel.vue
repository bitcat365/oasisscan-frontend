<template>
  <div class="panel-wrapper">
    <div :class="['panel-title', hasTitle ? 'height' : '']">
      <div class="panel-title-left" ref="paneltitleleft">
        <span v-if="title">{{ title }}</span>
        <slot v-else name="headerLeft"></slot>
      </div>
      <div class="panel-title-right" ref="paneltitleright">
        <slot name="headerRight"></slot>
      </div>
    </div>
    <div :class="['panel-content', contentHeight()]">
      <slot>
        <NoRecord></NoRecord>
      </slot>
    </div>
    <div :class="['panel-footer', hasFooter ? 'height' : '']" ref="panelfooter">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import NoRecord from '../NoRecord.vue'
export default {
  components: { NoRecord },
  name: 'Panel',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      hasTitle: false,
      hasFooter: false
    }
  },
  methods: {
    contentHeight(){
      switch(true){
        case !this.hasTitle && !this.hasFooter:
          return 'height';
        case this.hasTitle && !this.hasFooter:
          return 'height1';
        case !this.hasTitle && this.hasFooter:
          return 'height2';
        case this.hasTitle && this.hasFooter:
          return 'height3';
      }
    }
  },
  mounted() {
    this.hasTitle = this.$refs.paneltitleleft.hasChildNodes() || this.$refs.paneltitleright.hasChildNodes()
    this.hasFooter = this.$refs.panelfooter.hasChildNodes()
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/utils';
.panel-wrapper {
  background-color: #fff;
  border-radius: rem(15);
  padding: rem(20);
  .panel-title {
    @extend .flexRow;
    margin-bottom: rem(10);
    &.height {
      height: rem(30);
    }
    .panel-title-left {
      font-size: rem(18);
    }
    .panel-title-right {
      font-size: rem(14);
    }
  }
  .panel-content {
    &.height {
      height: 100%;
    }
    &.height1 {
      height: calc(100% - #{rem(30)});
    }
    &.height2 {
      height: calc(100% - #{rem(60)});
    }
    &.height3 {
      height: calc(100% - #{rem(90)});
    }
  }
  .panel-footer {
    &.height {
      height: rem(60);
    }
  }
}
</style>
