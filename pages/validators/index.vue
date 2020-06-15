<template>
  <div class="validators-root">
    <nav-bar :active="2"/>
    <div class="page-container container">
      <div class="title">
        <h1>VALIDATORS<span class="total-count"> ({{this.list.length}})</span></h1>
        <div class="validator-info">
          <div class="info-item">
            <div class="active-count">75</div>
            <div class="info-name">active validators</div>
          </div>
          <div class="info-item">
            <div class="active-count">20</div>
            <div class="info-name">inactive validators</div>
          </div>
          <div class="info-item">
            <div class="active-count">12353</div>
            <div class="info-name">Delegators</div>
          </div>
        </div>
      </div>
      <div class="operate">
        <div class="tag-con">
          <div :class="['type active', type === 'active'? 'sel' : '']" @click="type='active'">active</div>
          <div :class="['type inactive', type === 'inactive'? 'sel' : '']" @click="type='inactive'">inactive</div>
        </div>
        <input v-model="name" placeholder="Search Validator" type="text"></input>
      </div>
      <div class="block-list-wrapper">
        <block-table root-class="block-total-list" cell-class="block-total-list-cell" :columns="columns" :data="showList" @sort="sort">
          <template v-slot:uptime="slotData">
            <div class="uptime-item green" v-if="slotData.data.replace('%', '') >=80">{{slotData.data}}</div>
            <div class="uptime-item yellow" v-else-if="slotData.data.replace('%', '') >=50">{{slotData.data}}</div>
            <div class="uptime-item red" v-else>{{slotData.data}}</div>
          </template>
          <template v-slot:name="slotData">
           <div class="validator-name">
             <img class="name-icon" src="../../assets/oasis-official-logo-s.png">
             <router-link :to="$i18n.path(slotData.data.link)">{{ slotData.data.text }}</router-link>
           </div>
          </template>
        </block-table>
      </div>
    </div>
  </div>
</template>

<script>
  import { fetchValidatorsList } from '../../fetch/index'
  import BlockTable from '../../components/Table/index'
  import NavBar from '../../components/NavigationBar'

  export default {
    name: 'index',
    components: {
      NavBar,
      BlockTable,
    },
    async asyncData({ $axios }) {
      const { list } = await fetchValidatorsList($axios)
      // const blockInfo = await fetchBlockInfo($axios)
      return { list }
    },
    methods: {
      async goto(pageNumber) {
        const $axios = this.$axios
        const { list } = await fetchValidatorsList($axios)
        this.list = list
      },
      async sort({ key, sortType }) {
        console.log(key, sortType)
        const $axios = this.$axios
        if (this.currentSortKey) {
          const currentSortColumn = this.columns.find(c => c.key === this.currentSortKey)
          currentSortColumn.sortType = ''
        }
        const { list } = await fetchValidatorsList($axios, key, sortType === 'up' ? 'asc' : 'desc')
        this.list = list
        const co = this.columns.find(c => c.key === key)
        co.sortType = sortType
        this.columns = [...this.columns]
        this.currentSortKey = key
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
        currentSortKey: '',
        columns: [
          {
            title: 'Rank',
            key: 'rank'
          },
          {
            title: 'Validator',
            key: 'name',
            slot: true
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
            key: 'uptime',
            slot: true,
            sortable: true
          },
          {
            title: 'Score',
            key: 'score',
            sortable: true
          }
        ]
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/css/common";
  .validator-name {
    display: flex;
    align-items: center;
  }
  .name-icon {
    margin-right: rem(5);
    width: rem(30);
  }
  .uptime-item {
    color: white;
    text-align: center;
    height: rem(22);
    border-radius: rem(4);
    display: flex;
    align-items: center;
    justify-content: center;
    &.green {
      background-color: #2ED47A ;
    }
    &.yellow {
      background-color: #FFB946;
    }
    &.red {
      background-color: #F7685B;
    }
  }
  .validators-root {
    background-color: #f7f7f7;
  }
  .container {
    padding-bottom: rem(50);
  }
  .validator-info {
    background-color: white;
    border-radius: rem(8);
    height: rem(40);
    width: rem(540);
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: space-between;
    padding: 0 rem(20);
    > .info-item{
      display: flex;
      flex-direction: row;
      align-items: center;
      .active-count {
        color: #FF7A59;
        font-size: rem(14);
      }
      .info-name {
        padding-left: rem(4);
        font-size: rem(12);
      }
    }
  }
  .title {
    padding-top: rem(20);
    display: flex;
    align-items: center;
    justify-content: space-between;
    h1 {
      font-size: rem(20);
      padding: 0;
      margin: 0;
      @include regular;;
      color: black;
      font-weight: normal;
      span {
        font-size: rem(14);
        color: rgba(0, 0, 0, 0.5);
      }
    }
  }
  .operate {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .tag-con {
      display: flex;
      flex-direction: row;
    }
    input[type=text] {
      width: rem(206);
      height: rem(30);
      border: 0;
      box-shadow: 0 0 1px 0 rgba(0,0,0,0.50);
      border-radius: rem(4);
      padding:0 rem(16);
      outline: none;
    }
    .type {
      display: flex;
      align-items: center;
      text-align: center;
      height: rem(24);
      font-size: rem(12);
      padding: 0 0.75rem;
      border: 1px solid #979797;
      border-radius: rem(4);
      color: #333333;
      margin-left: rem(12);
      margin-bottom: rem(12);
      margin-top: rem(12);
      cursor: pointer;
      background-color: white;
      &.sel {
        color: white;
        background-color: #808080;
      }
      .inactive{
        margin-left: 1.06rem;
      }
      &:first-child {
        margin-left: 0;
      }
    }
  }
  .block-list-wrapper {
    background-color: white;
    padding:0 rem(30);
    padding-bottom: rem(24);
    border-radius: rem(8);
    .block-total-list{
      padding: 0;
      width: 100%;
      margin-left: 0;
      border-radius: 1px;
      /deep/ td, /deep/ th {
        vertical-align: middle;
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
