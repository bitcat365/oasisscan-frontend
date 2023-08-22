<template>
  <div>
    <Row v-for="item in list" :key="item.title" class="description">
      <Col :span="span[0]" class="title">{{ item.title }}</Col>
      <Col :span="span[1]" class="content">
        <slot v-if="item.name" :name="item.name"></slot>
        <span v-else-if="item.content && typeof item.content === 'object' && item.content.type ==='time'">{{item.content.value|timeFormat}}</span>
        <span v-else-if="item.content && typeof item.content === 'object' && item.content.type ==='link'"><router-link :to="item.content.link">{{item.content.text}}</router-link></span>
        <span v-else-if="item.content && typeof item.content === 'object' && item.content.type ==='raw-link'"><a :href="item.content.link" target="_blank">{{item.content.text}}</a></span>
        <span v-else-if="item.content && typeof item.content === 'object' && item.content.type ==='int'">{{item.content.value|intFormat}}</span>
        <span v-else>{{ item.content }}</span>
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
    },
    span: {
      type: Array,
      default: () => ['6', '18']
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
    a{
      color: $blue500;
    }
  }
}
</style>
