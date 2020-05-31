<template>
  <form @submit.stop.prevent="onsubmit" class="search-box">
    <div class="form-inner">
      <input v-model="text" type="text" :placeholder="$t('home.search')"></input>
      <img class="search-icon" src="../../assets/search.png" />
      <a class="search-button" @click.stop.prevent="onsubmit">{{$t('search')}}</a>
    </div>
  </form>
</template>

<script>
  import { search } from '../../fetch'

  export default {
    name: 'SearchBox',
    data() {
      return {
        text: ''
      }
    },
    methods: {
      async onsubmit() {
        const searchText = this.text.trim()
        const res = await search(this.$axios, searchText)
        if (res.link) {
          this.$router.push(this.$i18n.path(res.link))
        } else {
          this.$router.push(this.$i18n.path(`/not_found/${searchText}`))
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/css/common";
  .search-box {
    margin: 0 auto;
    padding: 85px 0 85px;
    position: relative;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    > .form-inner{
      width: 592px;
      position: relative;
      > input[type="text"] {
        display: inline-block;
        width: 100%;
        height: 52px;
        padding:17px 198px 17px 70px;
        font-size: 18px;
        line-height: 1;
        color: rgba(55, 65, 107, 1);
        background-color: rgba(248,248,248,1);
        border-radius:26px;
        border: 0;
        &:focus{
          outline: 0;
        }
      }
      > .search-icon{
        width: 18px;
        position: absolute;
        top: 17px;
        left: 26px;
      }
      > .search-button {
        position: absolute;
        top: 5px;
        right: -145px;
        height:42px;
        font-size: 14px;
        line-height: 1;
        padding:0 36px;
        border-radius:21px;
        display: flex;
        align-items: center;
        color: white;
        @include medium;
        background: rgba(230,0,122,1);
      }
    }
  }
  @media (max-width: 960px) {
    .search-box {
      display: none;
    }
  }
</style>
