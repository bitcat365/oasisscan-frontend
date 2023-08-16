<template>
  <div>
    <Row v-for="item in list" :key="item.title" class="description">
      <Col span="6" class="title">{{ item.title }}</Col>
      <Col span="18" class="content">
        <span v-if="item.content">{{ item.content }}</span>
        <slot v-else :name="item.name"></slot>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => {}
    }
  }
}
</script>

<style scoped lang="scss">
.description {
  .title {
    padding: rem(10) 0;
  }
  .content {
    color: $gray500;
    padding: rem(10) 0;
  }
}
</style>
