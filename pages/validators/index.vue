<template>
  <div class="validators-root">
    <nav-bar :active="2"/>
    <div class="page-container container">
      <div class="title">
        <h1>VALIDATORS<span class="total-count"> ({{this.list.length | readable}})</span></h1>
        <div class="validator-info">
          <div class="info-item">
            <div class="active-count">{{active | readable}}</div>
            <div class="info-name">active validators</div>
          </div>
          <div class="info-item">
            <div class="active-count">{{inactive | readable}}</div>
            <div class="info-name">inactive validators</div>
          </div>
          <div class="info-item">
            <div class="active-count">{{delegators | readable}}</div>
            <div class="info-name">delegators</div>
          </div>
        </div>
      </div>
      <div class="operate">
        <div class="tag-con">
          <div :class="['type active', type === 'active'? 'sel' : '']" @click="type='active'">Active</div>
          <div :class="['type inactive', type === 'inactive'? 'sel' : '']" @click="type='inactive'">Inactive</div>
        </div>
        <input v-model="name" placeholder="Validator Filter" type="text"></input>
      </div>
      <div class="block-list-wrapper">
        <block-table
          root-class="block-total-list"
          cell-class="block-total-list-cell"
          :columns="columns"
          :data="showList"
          primary-key="entityId"
          @sort="sort">
          <template v-slot:status="{ data }">
            <img v-if="data" class="validator-status" src="../../assets/status-success.svg" />
            <img v-else class="validator-status" src="../../assets/status-fail.svg" />
          </template>
          <template v-slot:escrow="{data:{escrow, escrowPercent}}">
            <span>{{escrow | readable}} ({{escrowPercent | percentFormat }})</span>
          </template>
          <template v-slot:uptime="slotData">
            <div class="uptime-item green" v-if="+slotData.data.replace('%', '') >=80">{{slotData.data}}</div>
            <div class="uptime-item yellow" v-else-if="+slotData.data.replace('%', '') >=50">{{slotData.data}}</div>
            <div class="uptime-item red" v-else>{{slotData.data}}</div>
          </template>
          <template v-slot:name="slotData">
            <div class="validator-name">
              <img v-if="slotData.data.icon" class="name-icon" :src="slotData.data.icon">
              <img v-else class="name-icon" src="../../assets/validator_dafult_icon.svg">
              <router-link :to="slotData.data.link" :class="slotData.data.type === 'hash-link' ? 'hash-link' : ''">{{ slotData.data.type === 'hash-link' ? hashFormat(slotData.data.text) : slotData.data.text }}</router-link>
            </div>
          </template>
          <template v-slot:escrowChange24="slotData">
            <div class="escrow-change24" :class="slotData.data > 0 ? 'positive' : (slotData.data < 0 ? 'negative' : '')">
              {{showChangeSign(slotData.data)}} {{slotData.data | readable}}
            </div>
          </template>
          <template v-slot:rank="slotData">
            <div class="rank">
              {{slotData.data.rank}}
              <img @click="star(slotData.data.entityId, false)" v-if="slotData.data.stared" class="star" src="../../assets/star.svg">
              <img @click="star(slotData.data.entityId, true)" v-else class="star unstar" src="../../assets/unstar.svg">
            </div>
          </template>
        </block-table>
      </div>
    </div>
  </div>
</template>

<script>
  import LS from 'local-storage'
  import Vue from 'vue'
  import { fetchValidatorsList } from '../../fetch/index'
  import { hashFormat } from '../../utils'
  import BlockTable from '../../components/Table/index'
  import NavBar from '../../components/NavigationBar'

  export default {
    name: 'index',
    components: {
      NavBar,
      BlockTable,
    },
    async asyncData({ $axios, store: $store }) {
      const { list, active, inactive, delegators } = await fetchValidatorsList({ $axios, $store })
      // const blockInfo = await fetchBlockInfo($axios)
      console.log('list', list)
      return { list, active, inactive, delegators }
    },
    methods: {
      async goto(pageNumber) {
        const { $axios, $store } = this
        const { list } = await fetchValidatorsList({ $axios, $store })
        this.list = list
      },
      async sort({ key, sortType }) {
        console.log(key, sortType)
        const { $axios, $store } = this
        if (this.currentSortKey) {
          const currentSortColumn = this.columns.find(c => c.key === this.currentSortKey)
          currentSortColumn.sortType = ''
        }
        const { list } = await fetchValidatorsList({ $axios, $store }, key, sortType === 'up' ? 'asc' : 'desc')
        this.list = list
        const co = this.columns.find(c => c.key === key)
        co.sortType = sortType
        this.columns = [...this.columns]
        this.currentSortKey = key
      },
      star(id, star) {
        let validators = LS('StaredValidators')
        if (!validators) {
          validators = []
        }
        const index = validators.findIndex(v => v === id)
        if (star) {
          if (index >= 0) {
            validators.splice(index, 1)
          }
          if (validators.length >= 20) {
            validators.shift()
          }
          validators.push(id)
        } else {
          validators.splice(index, 1)
        }
        LS('StaredValidators', validators)
        this.staredValidators = validators
      },
      showChangeSign(value) {
        if (value > 0) {
          return '+'
        } else if (value < 0) {
  //        return '-' + value
          return ''
        }
        return ''
      },
      hashFormat(val) {
        return hashFormat(val)
      }
    },
    computed: {
      showList() {
        const validators = this.staredValidators
        const staredArray = [...this.list].filter(a => validators.findIndex(v => v === a.entityId) >= 0).sort((a, b) => {
          const aIndex = validators.findIndex(v => v === a.entityId)
          const bIndex = validators.findIndex(v => v === b.entityId)
          return bIndex - aIndex
        })
        const unStaredArray = [...this.list].filter(a => validators.findIndex(v => v === a.entityId) === -1)
        const res = [...staredArray, ...unStaredArray].map((item) => {
          return {
            ...item,
            rank: { rank: item.rank, stared: !!validators.find(v => v === item.entityId), entityId: item.entityId }
          }
        }).filter((item) => {
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
        return res
      }
    },
    created() {
    },
    mounted() {
      this.staredValidators = [...(LS('StaredValidators')) || []]
    },
    data() {
      return {
        staredValidators: [],
        list: [],
        name: '',
        type: 'active',
        currentSortKey: '',
        columns: [
          {
            title: 'Rank',
            key: 'rank',
            slot: true
          },
          {
            title: 'Validator',
            key: 'name',
            slot: true
          },
          {
            title: 'Escrow',
            key: 'escrow',
            sortable: true,
            slot: true
          },
          {
            title: 'Change(24h)',
            key: 'escrowChange24',
            slot: true,
            sortable: true
          },
          {
            title: 'Delegators',
            key: 'delegators',
            sortable: true
          },
          {
            title: 'Commission',
            key: 'commission',
            sortable: true
          },
          {
            title: 'Status',
            key: 'status',
            slot: true
          },
          {
            title: 'Sign(1k block)',
            key: 'uptime',
            slot: true,
            sortable: true
          }
        ]
      }
    }
  }
</script>

<style scoped lang="scss">
  .escrow-change24 {
    &.positive {
      color: #00B538;
    }
    &.negative {
      color: #B60000;
    }
  }
  .rank {
    display: flex;
    flex-direction: column;
    align-items: center;
    .star {
      width: rem(10);
      margin-top: rem(5);
      cursor: pointer;
      display: block;
      opacity: 1;
    }
    .unstar {
      display: none;
      transition: all .3s;
      opacity: 0;
    }
  }
  .validator-name {
    display: flex;
    align-items: center;
  }
  .name-icon {
    margin-right: rem(5);
    width: rem(30);
    height: rem(30);
    border-radius: rem(4);
  }
  .validator-status {
    width: rem(16);
    height: rem(16);
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
        margin-left: rem(8);
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
    input[type=text] {
      width: rem(206);
      height: rem(30);
      border: 0;
      box-shadow: 0 0 1px 0 rgba(0,0,0,0.50);
      border-radius: rem(4);
      padding:0 rem(16);
      outline: none;
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
      /deep/ .table-row:hover{
        .unstar {
          display: block;
          opacity: 1;
        }
      }
      /deep/ td, /deep/ th {
        vertical-align: middle;
        padding: 18px 10px;
      }
      /deep/ td {
        padding: rem(10)
      }
      /deep/ tr th, /deep/ tr td{
        &:nth-child(1) {
          width: 60px;
          text-align: center;
        }
        &:nth-child(2) {
          width: 280px;
          .hash-link {
            color: #5f5f5f;
          }
        }
        &:nth-child(3) {
          width: 200px;
        }
        &:nth-child(7) {
          text-align: center;
          .header-title {
            justify-content: center;
          }
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
</style>
