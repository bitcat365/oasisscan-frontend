<template>
  <div>
    <nav-bar />
    <tab-menu :active="2"></tab-menu>
    <div class="page-container container">
      <block-info :blockInfo="blockInfo"></block-info>
      <div class="title">
        <h1>VALIDATORS</h1>
        <div class="operate">
          <input v-model="name" placeholder="Search Validator" type="text"></input>
          <div :class="['type active', type === 'active'? 'sel' : '']" @click="type='active'">active</div>
          <div :class="['type inactive', type === 'inactive'? 'sel' : '']" @click="type='inactive'">inactive</div>
        </div>
      </div>
      <div class="block-list-wrapper">
        <block-table root-class="block-total-list" cell-class="block-total-list-cell" :columns="columns" :data="showList" />
      </div>
    </div>
  </div>
</template>

<script>
  import { fetchValidatorsList, fetchBlockInfo } from '../../fetch/index'
  import BlockTable from '../../components/Table/index'
  import NavBar from '../../components/NavigationBar'
  import TabMenu from '../../components/TabMenu'
  import BlockInfo from '../../components/index/BlockInfo'

  export default {
    name: 'index',
    components: {
      NavBar,
      BlockTable,
      TabMenu,
      BlockInfo
    },
    async asyncData({ $axios }) {
      const { list } = await fetchValidatorsList($axios)
      const blockInfo = await fetchBlockInfo($axios)
      return { list, blockInfo }
    },
    methods: {
      async goto(pageNumber) {
        const $axios = this.$axios
        const { list } = await fetchValidatorsList($axios)
        this.list = list
      }
    },
    computed: {
      showList() {
        return this.list.filter((item) => {
          let filter1 = true
          let filter2 = true
          if (this.name) {
            filter1 = !!item.name && !!item.name.text && item.name.text.toLowerCase().indexOf(this.name.toLowerCase()) >= 0
          }
          if (this.type) {
            filter2 = item.active === (this.type === 'active')
          }
          return filter1 && filter2
        })
      }
    },
    created() {
    },
    mounted() {

    },
    data() {
      return {
        list: [],
        name: '',
        type: 'active',
        columns: [
          {
            title: 'Rank',
            key: 'rank'
          },
          {
            title: 'Validator',
            key: 'name'
          },
          {
            title: 'Signatures',
            key: 'signs'
          },
          {
            title: 'Proposals',
            key: 'proposals'
          },
          {
            title: 'Escrow',
            key: 'escrow'
          },
          {
            title: 'Uptime',
            key: 'uptime'
          },
          {
            title: 'Score',
            key: 'score'
          }
        ]
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/css/common";

  .container {
    padding-top: 30px;
  }
  .title {
    height: 4.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    h1 {
      font-size: 1.5rem;
      padding: 0;
      margin: 0;
      @include regular;;
      color: black;
      font-weight: normal;
    }
    .operate {
      display: flex;
      flex-direction: row;
      input[type=text] {
        width: 16.75rem;
        height: 2.25rem;
        border: 1px solid #979797;
        box-shadow: inset 0 1px 3px 0 rgba(0,0,0,0.50);
        border-radius: 3px;
        padding:0 0.44rem;
        outline: none;
      }
      .type {
        display: flex;
        align-items: center;
        text-align: center;
        height: 2.38rem;
        font-size: 1.25rem;
        padding: 0 0.75rem;
        border: 1px solid #979797;
        border-radius: 6px;
        color: #BABABA;
        margin-left: 0.63rem;
        cursor: pointer;
        &.sel {
          color: white;
          background-color: #808080;
        }
        .inactive{
          margin-left: 1.06rem;
        }
      }
    }
  }
  .block-list-wrapper {
    background-color: white;
    padding:0 1.13rem;
    border: 1px solid #979797;
    .block-total-list{
      padding: 0;
      width: 100%;
      margin-left: 0;
      border-radius: 1px;
      /deep/ td, /deep/ th {
        padding: 18px 10px;
      }
      /deep/ tr th, /deep/ tr td{
        &:nth-child(1) {
          width: 50px;
        }
        &:nth-child(6) {
          width: 110px;
        }
        &:last-child {
          padding-left: 0;
          width: 110px;
        }
      }
    }
    .title {
      margin-left: 0px;
      margin-top: 6px;
      font-size:18px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(55,65,107,1);
      line-height: 1;
      display: flex;
      align-items: center;
      > .icon {
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }
    }
    .total-records{
      margin-left: 40px;
      margin-top: 9px;
      font-size:12px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(55,65,107,0.5);
      line-height: 1;
    }
  }
  .page-navigation {
    display: flex;
    justify-content: flex-end;
    padding: 30px;
  }
</style>
