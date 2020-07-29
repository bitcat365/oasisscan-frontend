<template>
  <form @submit.stop.prevent="onsubmit" class="search-box">
    <div class="form-inner">
      <input v-model="text" type="text" placeholder="Search by Address/Block/Block hash/Tx hash"></input>
      <a class="search-button" @click.stop.prevent="onsubmit">Search</a>
    </div>
  </form>
</template>

<script>
  import { search, onSearch } from '../../fetch'

  export default {
    name: 'SearchBox',
    data() {
      return {
        text: ''
      }
    },
    methods: {
      async onsubmit() {
        onSearch(this, this.text)
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "../../assets/css/common";
  .search-box {
    margin: 0 auto;
    padding: rem(60) 0 rem(60);
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    > .form-inner{
      width: rem(600);
      position: relative;
      > input[type="text"] {
        display: inline-block;
        width: 100%;
        height: rem(50);
        padding:rem(17) rem(134) rem(17) rem(17);
        font-size: rem(16);
        line-height: 1;
        color: rgba(55, 65, 107, 1);
        background-color: rgba(248,248,248,1);
        border-radius: rem(6);
        border:1px solid #959595;
        border-right: 0;
        &:focus{
          outline: 0;
        }
      }
      > .search-button {
        position: absolute;
        top: 0px;
        right: 0px;
        height: 100%;
        width: rem(107);
        font-size: rem(14);
        line-height: 1;
        padding:0 36px;
        border-radius: rem(6);
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
        display: flex;
        align-items: center;
        color: white;
        @include medium;
        background: rgba(149,149,149,1);
      }
    }
  }
</style>
