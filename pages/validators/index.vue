<template>
  <div id="validators">
    <Head title="VALIDATORS">
      <template #HeadLeft>
        <span class="HeadLeft">({{ list.length | readable }})</span>
      </template>
      <template #HeadRight>
        <div class="validator-info">
          <div class="info-item">
            <div class="info-name">Active validators</div>
            <div class="active-count">{{ active | readable }}</div>
          </div>
          <div class="info-item">
            <div class="info-name">Delegators</div>
            <div class="active-count">{{ delegators | readable }}</div>
          </div>
        </div>
      </template>
    </Head>
    <Panel class="panel">
      <template slot="headerLeft">
        <div class="tag-con">
          <div :class="['type active', type === 'active' ? 'sel' : '']" @click="type = 'active'">Active</div>
          <div :class="['type inactive', type === 'inactive' ? 'sel' : '']" @click="type = 'inactive'">Inactive</div>
        </div>
      </template>
      <template slot="headerRight">
        <Input v-model="name" prefix="ios-search" placeholder="Validator Filter" />
      </template>
      <BlockTable :columns="columns" :data="showList" @sort="sort">
        <template v-slot:status="{ data }">
          <span v-if="data" class="success">Online</span>
          <span v-else class="error">Offline</span>
        </template>
        <template v-slot:escrow="{ data: { escrow, escrowPercent } }">
          <span>{{ escrow.toFixed(0) | readable  }} ({{ escrowPercent | percentFormat }})</span>
        </template>
        <template v-slot:uptime="slotData">
          <ColourDiv :color="+slotData.data.replace('%', '') >= 80 ? 'success' : +slotData.data.replace('%', '') >= 50 ? 'warning' : 'error'">{{ slotData.data }} </ColourDiv>
        </template>
        <template v-slot:name="slotData">
          <div class="validator-name">
            <img v-if="slotData.data.icon" class="name-icon" :src="slotData.data.icon" />
            <img v-else class="name-icon" src="../../assets/validator_dafult_icon.svg" />
            <router-link :to="slotData.data.link" :class="slotData.data.type === 'hash-link' ? 'hash-link' : ''">{{ slotData.data.type === 'hash-link' ? hashFormat(slotData.data.text) : slotData.data.text }}</router-link>
          </div>
        </template>
        <template v-slot:escrowChange24="slotData">
          <div class="escrow-change24" :class="slotData.data > 0 ? 'success' : slotData.data < 0 ? 'error' : ''">{{ showChangeSign(slotData.data) }} {{ slotData.data | readable }}</div>
        </template>
        <template v-slot:rank="slotData">
          <div class="rank">
            {{ slotData.data.rank }}
          </div>
        </template>
      </BlockTable>
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
import ColourDiv from '~/components/colourDiv/colourDiv'
export default {
  components: { BlockTable, Head, Panel, ColourDiv },
  data() {
    return {
      staredValidators: [],
      list: [],
      name: '',
      type: 'active',
      currentSortKey: '',
      columns: [
        {
          title: '#',
          key: 'rank',
          slot: true,
          width: '5%'
        },
        {
          title: 'Name',
          key: 'name',
          slot: true,
          width: '22%'
        },
        {
          title: 'Escrow',
          key: 'escrow',
          sortable: true,
          slot: true,
          width: '18%'
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
          slot: true,
          textAlign: 'center'
        },
        {
          title: 'Sign',
          key: 'uptime',
          slot: true,
          iconName: 'question',
          iconTip: 'Last 1000 blocks'
        }
      ]
    }
  },
  async asyncData({ $axios, store: $store }) {
    const { list, active, inactive, delegators } = await fetchValidatorsList({ $axios, $store }, 'escrow')
    // console.log('list', list)
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
  .success {
    color: $success500;
  }
  .error {
    color: $error500;
  }
  .HeadLeft {
    color: $gray500;
    font-size: rem(16);
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
  .panel {
    /deep/.ivu-input {
      width: rem(320);
      font-size: 1rem;
      color: $gray500;
      background-color: $gray100;
      border: 0;
      border-radius: rem(8);
    }
    /deep/.ivu-input:focus {
      box-shadow: none;
    }
    .tag-con {
      display: flex;
      flex-direction: row;
      .type {
        display: flex;
        align-items: center;
        text-align: center;
        height: rem(28);
        font-size: rem(14);
        padding: 0 0.75rem;
        border: 1px solid $gray200;
        border-radius: rem(8);
        color: $gray500;
        margin-left: rem(8);
        cursor: pointer;
        background-color: white;
        &.sel {
          color: white;
          background-color: $theme-color;
        }
        .inactive {
          margin-left: 1.06rem;
        }
        &:first-child {
          margin-left: 0;
        }
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
  }
}
</style>
