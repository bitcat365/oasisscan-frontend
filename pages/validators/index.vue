<template>
  <div id="validators">
    <Head title="VALIDATORS">
      <template #HeadLeft>
        <span class="HeadLeft">({{ list.length | readable }})</span>
      </template>
      <template #HeadRight>
        <div class="validator-info">
          <div class="info-item">
            <div class="info-name">active validators</div>
            <div class="active-count">{{ active | readable }}</div>
          </div>
          <div class="info-item">
            <div class="info-name">delegators</div>
            <div class="active-count">{{ delegators | readable }}</div>
          </div>
        </div>
      </template>
    </Head>
    <Panel>
      <template slot="headerLeft">
        左侧自定义
      </template>
      <template slot="headerRight">
        右侧tab切换
      </template>
      <div class="block-list-wrapper">
        <block-table root-class="block-total-list" cell-class="block-total-list-cell" :columns="columns" :data="showList" primary-key="entityId" @sort="sort">
          <template v-slot:status="{ data }">
            <div :class="data ? 'validator-status-success' : 'validator-status-error'"></div>
          </template>
          <template v-slot:escrow="{ data: { escrow, escrowPercent } }">
            <span>{{ escrow | readable }} ({{ escrowPercent | percentFormat }})</span>
          </template>
          <template v-slot:uptime="slotData">
            <div class="uptime-item green" v-if="+slotData.data.replace('%', '') >= 80">
              {{ slotData.data }}
            </div>
            <div class="uptime-item yellow" v-else-if="+slotData.data.replace('%', '') >= 50">
              {{ slotData.data }}
            </div>
            <div class="uptime-item red" v-else>{{ slotData.data }}</div>
          </template>
          <template v-slot:name="slotData">
            <div class="validator-name">
              <img v-if="slotData.data.icon" class="name-icon" :src="slotData.data.icon" />
              <img v-else class="name-icon" src="../../assets/validator_dafult_icon.svg" />
              <router-link :to="slotData.data.link" :class="slotData.data.type === 'hash-link' ? 'hash-link' : ''">{{ slotData.data.type === 'hash-link' ? hashFormat(slotData.data.text) : slotData.data.text }}</router-link>
            </div>
          </template>
          <template v-slot:escrowChange24="slotData">
            <div class="escrow-change24" :class="slotData.data > 0 ? 'positive' : slotData.data < 0 ? 'negative' : ''">{{ showChangeSign(slotData.data) }} {{ slotData.data | readable }}</div>
          </template>
          <template v-slot:rank="slotData">
            <div class="rank">
              {{ slotData.data.rank }}
              <img @click="star(slotData.data.entityId, false)" v-if="slotData.data.stared" class="star" src="../../assets/star.svg" />
              <img @click="star(slotData.data.entityId, true)" v-else class="star unstar" src="../../assets/unstar.svg" />
            </div>
          </template>
        </block-table>
      </div>
    </Panel>
  </div>
</template>

<script>
import LS from 'local-storage'
import { fetchValidatorsList } from '../../fetch/index'
import { hashFormat } from '../../utils'
import BlockTable from '~/components/Table/index'
import Head from '~/components/Head'
import Panel from '~/components/panel/Panel'
export default {
  components: { BlockTable, Head, Panel },
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
  },
  async asyncData({ $axios, store: $store }) {
    const { list, active, inactive, delegators } = await fetchValidatorsList({
      $axios,
      $store
    })
    // const blockInfo = await fetchBlockInfo($axios)
    console.log('list', list)
    return { list, active, inactive, delegators }
  },
  computed: {
    showList() {
      const validators = this.staredValidators
      const staredArray = [...this.list]
        .filter(a => validators.findIndex(v => v === a.entityId) >= 0)
        .sort((a, b) => {
          const aIndex = validators.findIndex(v => v === a.entityId)
          const bIndex = validators.findIndex(v => v === b.entityId)
          return bIndex - aIndex
        })
      const unStaredArray = [...this.list].filter(a => validators.findIndex(v => v === a.entityId) === -1)
      const res = [...staredArray, ...unStaredArray]
        .map(item => {
          return {
            ...item,
            rank: {
              rank: item.rank,
              stared: !!validators.find(v => v === item.entityId),
              entityId: item.entityId
            }
          }
        })
        .filter(item => {
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
  mounted() {
    // this.timer && clearTimeout(this.timer);
    // this.timer = setTimeout(() => {
    //   this.repool();
    // }, 6000);
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
  }
}
</script>

<style lang="scss" scoped>
#validators {
  .HeadLeft {
    color: $gray500;
    font-size: rem(18);
  }
  .validator-info {
    background-color: $theme-background;
    border-radius: rem(8);
    height: rem(40);
    width: rem(386);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    padding: 0 rem(20);
    > .info-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      .info-name {
        color: $gray500;
      }
      .active-count {
        color: $blue600;
        margin-left: rem(12);
      }
    }
  }
  .escrow-change24 {
    &.positive {
      color: #12b76a;
    }
    &.negative {
      color: #f04438;
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
      transition: all 0.3s;
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
  .validator-status-success {
    width: rem(10);
    height: rem(10);
    border-radius: rem(5);
    background-color: #12b76a;
    margin: auto;
  }
  .validator-status-error {
    width: rem(10);
    height: rem(10);
    border-radius: rem(5);
    background-color: #f04438;
  }
  .uptime-item {
    color: white;
    text-align: center;
    height: rem(30);
    border-radius: rem(4);
    display: flex;
    align-items: center;
    justify-content: center;
    &.green {
      color: #12b76a;
      background-color: #a6f4c5;
    }
    &.yellow {
      color: #f79718;
      background-color: #fef0c7;
    }
    &.red {
      color: #f15045;
      background-color: #fee4e2;
    }
  }
  .block-list-wrapper {
    background-color: white;
    padding-bottom: rem(20);
    border-radius: rem(8);
    .block-total-list {
      padding: 0;
      width: 100%;
      margin-left: 0;
      border-radius: 1px;
      /deep/ .table-row:hover {
        .unstar {
          display: block;
          opacity: 1;
        }
      }
      /deep/ td,
      /deep/ th {
        vertical-align: middle;
        padding: 18px 10px;
      }
      /deep/ td {
        padding: rem(10);
      }
      /deep/ tr th,
      /deep/ tr td {
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
      font-size: 18px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(55, 65, 107, 1);
      line-height: 1;
      display: flex;
      align-items: center;
      > .icon {
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }
    }
    .total-records {
      margin-left: 40px;
      margin-top: 9px;
      font-size: 12px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(55, 65, 107, 0.5);
      line-height: 1;
    }
  }
}
</style>
