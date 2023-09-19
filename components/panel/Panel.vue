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
    <div :class="['panel-content', hasTitle ? 'height' : 'height1']">
      <slot>
        <NoRecord></NoRecord>
      </slot>
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
      hasTitle: false
    }
  },
  methods: {},
  mounted() {
    this.hasTitle = this.$refs.paneltitleleft.hasChildNodes() || this.$refs.paneltitleright.hasChildNodes()
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
      height: calc(100% - #{rem(30)});
    }
    &.height1 {
      height: 100%;
    }
  }
}
</style>
