<template>
  <div
    class="popover-wrapper"
    @mouseenter="showPopover"
    @mouseleave="hidePopover"
  >
    <div class="popover-trigger">
      <slot></slot>
    </div>
    <div
      v-if="isVisible"
      class="popover-content"
      @mouseenter="cancelHide"
      @mouseleave="hidePopover"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
      hideTimer: null
    };
  },
  methods: {
    showPopover() {
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
      }
      this.isVisible = true;
    },
    hidePopover() {
      this.hideTimer = setTimeout(() => {
        this.isVisible = false;
      }, 200);
    },
    cancelHide() {
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.popover-wrapper {
  position: relative;
  display: inline-block;
  &:not(:first-child) {
    margin-left: 0.5rem;
  }
}

.popover-trigger {
  display: inline-block;
}

.popover-content {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba($color: $gray800, $alpha: 0.8);
  color: white;
  padding: rem(12);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 100;
  width: max-content;
  min-width: 300px;
}
</style>
