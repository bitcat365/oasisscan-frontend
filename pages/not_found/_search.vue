<template>
  <div>
    <nav-bar />
    <div class="page-container container">
      <div class="not_found_wrapper">
        <div class="not_found_icon"></div>
        <div class="search_string">{{$t('searchString',{query:query})}}</div>
        <div class="no_result">{{$t('noResult')}}</div>
        <div class="confirm_query">{{$t('confirmQuery')}}</div>
      </div>
    </div>
  </div>

</template>

<script>
  import NavBar from '../../components/NavigationBar'
  export default {
    name: 'not_fount',
    components: {
      NavBar
    },
    data() {
      return {
        query: this.$route.params.search
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/css/common";

  .container {
  }
  .not_found_wrapper {
    margin: 0px auto 0;
    padding-top: 90px;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
    font-family:PingFangSC-Regular;
    .not_found_icon {
      width:269px;
      height:201px;
      background:rgba(18,83,252,1);
      border-radius:10px;
      opacity:0.1246;
    }
    .search_string{
      margin-top: 40px;
      font-size:14px;
      font-weight:400;
      color:rgba(55,65,107,1);
    }
    .no_result{
      margin-top: 40px;
      font-size:18px;
      font-weight:400;
      color:rgba(55,65,107,1);
    }
    .confirm_query{
      margin-top: 12px;
      font-size:14px;
      font-weight:400;
      color:rgba(55,65,107,0.7);
    }
  }
</style>
