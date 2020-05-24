<template>
  <ul class="info-list">
    <li v-for="item in uiHeaders" :key="item.key">
      <span class="label">{{$t(item.label)}}</span>
      <span v-if="typeof data[item.key] === 'object' && data[item.key].type ==='time'" class="value">{{data[item.key].value|timeFormat}}</span>
      <span v-else-if="typeof data[item.key] === 'object' && data[item.key].type ==='link'" class="value"><router-link :to="$i18n.path(data[item.key].link)">{{data[item.key].text}}</router-link></span>
      <span v-else-if="typeof data[item.key] === 'object' && data[item.key].type ==='raw-link'" class="value"><a :href="data[item.key].link" target="_blank">{{data[item.key].text}}</a></span>
      <span v-else-if="typeof data[item.key] === 'object' && data[item.key].type ==='int'" class="value">{{data[item.key].value|intFormat}}</span>
      <span v-else class="value">{{data[item.key]}}</span>
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

<style scoped lang="less">
  @import "../../assets/css/common";
  .info-list {
    list-style: none;
    > li {
      min-height: 50px;
      font-size:14px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(55,65,107,1);
      line-height: 1.5;
      display: flex;
      align-items: center;
      padding: 12px 0;
      &:nth-child(odd){
        background:rgba(55,65,107,0.03);
      }
      > .label {
        padding-left: 20px;
        width: 180px;
      }
      > .value {
        color:rgba(55,65,107,0.7);
        padding-right: 20px;
        word-break: break-all;
        > a {
          color: @theme-color;
        }
      }
    }
  }
</style>
