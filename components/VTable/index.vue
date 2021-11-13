<template>
  <ul class="info-list">
    <li v-for="item in uiHeaders" :key="item.key">
      <span class="label">{{item.label}}</span>
      <span v-if="item.slot" class="value">
        <slot :name="item.key" :data="data[item.key]" :detail="data"></slot>
      </span>
      <span v-else-if="data[item.key] && typeof data[item.key] === 'object' && data[item.key].type ==='time'" class="value">{{data[item.key].value|timeFormat}}</span>
      <span v-else-if="data[item.key] && typeof data[item.key] === 'object' && data[item.key].type ==='link'" class="value"><router-link :to="data[item.key].link">{{data[item.key].text}}</router-link></span>
      <span v-else-if="data[item.key] && typeof data[item.key] === 'object' && data[item.key].type ==='raw-link'" class="value"><a :href="data[item.key].link" target="_blank">{{data[item.key].text}}</a></span>
      <span v-else-if="data[item.key] && typeof data[item.key] === 'object' && data[item.key].type ==='int'" class="value">{{data[item.key].value|intFormat}}</span>
      <span v-else class="value">{{data[item.key] === null ? 'null' : data[item.key] }}</span>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'index',
    props: {
      headers: {
        type: Array,
        required: true
      },
      data: {
        type: Object,
        required: true
      }
    },
    computed: {
      uiHeaders() {
        return this.headers.filter(item => typeof this.data[item.key] !== 'undefined')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/css/common";
  .info-list {
    list-style: none;
    > li {
      font-size: rem(14);
      font-family:PingFangSC-Regular;
      font-weight:400;
      line-height: rem(20);
      display: flex;
      align-items: center;
      padding: rem(8) 0;
      &:nth-child(odd){
        /*background:rgba(55,65,107,0.03);*/
      }
      > .label {
        padding-left: 20px;
        width: 180px;
        color: #3E3E3E;
        font-family: PingFangSC-Medium;
      }
      > .value {
        color: #5F5F5F;
        padding-right: 20px;
        word-break: break-all;
        > a {
          color: #3273DC;
        }
      }
    }
  }
</style>
