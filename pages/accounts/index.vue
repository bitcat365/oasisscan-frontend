<template>
  <div>
    <Head title="ACCOUNTS">
      <template #HeadLeft>
        <span class="HeadLeft">({{ total | readable }})</span>
      </template>
    </Head>
    <div class="block-list-wrapper">
      <BlockTable root-class="block-total-list" cell-class="block-total-list-cell" :columns="columns" :data="list">
        <template v-slot:address="{ data }">
          <div class="account-item">
            <emoji :amount="data.total"></emoji>
            <a :href="data.link" target="_self">{{ data.text }}</a>
          </div>
        </template>
      </BlockTable>
      <Page :page="page" :sizer="sizer" :records-count="total" root-class="block-page" @goto="goto"></Page>
    </div>
  </div>
</template>

<script>
import LS from 'local-storage'
import { fetchAccountsList } from '../../fetch/index'
import Emoji from '../../components/emoji'
import BlockTable from '../../components/Table/index'
import Head from '~/components/Head'
import Page from '../../components/Page'

export default {
  name: 'index',
  components: {
    Head,
    BlockTable,
    Page,
    Emoji
  },
  async asyncData({ $axios, store: $store }) {
    const { list, totalSize } = await fetchAccountsList({ $axios, $store }, 1, 20)
    console.log('list', list)
    return { list, total: totalSize }
  },
  methods: {
    async goto(pageNumber, pageSize) {
      const $axios = this.$axios
      const $store = this.$store
      const { list, totalSize } = await fetchAccountsList({ $axios, $store }, pageNumber, pageSize)
      this.page = pageNumber
      this.sizer = pageSize
      this.list = list
      this.total = totalSize
      document.documentElement.scrollTop = document.body.scrollTop = 0
    },
    star(id, star) {
      let accounts = LS('StaredAccounts')
      if (!accounts) {
        accounts = []
      }
      const index = accounts.findIndex(v => v === id)
      if (star) {
        if (index >= 0) {
          accounts.splice(index, 1)
        }
        if (accounts.length >= 20) {
          accounts.shift()
        }
        accounts.push(id)
      } else {
        accounts.splice(index, 1)
      }
      LS('staredAccounts', accounts)
      this.staredAccounts = accounts
    }
  },
  computed: {},
  created() {},
  mounted() {
    const $axios = this.$axios
  },
  data() {
    return {
      sizer: 20,
      page: 1,
      list: [],
      columns: [
        {
          title: '#',
          key: 'rank',
          textAlign: 'center'
        },
        {
          title: 'Account',
          key: 'address',
          slot: true
        },
        {
          title: 'Available',
          key: 'available'
        },
        {
          title: 'Escrow',
          key: 'escrow'
        },
        {
          title: 'Debonding',
          key: 'debonding'
        },
        {
          title: 'Amount',
          key: 'total',
          textAlign: 'right'
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.HeadLeft {
  color: $gray500;
  font-size: rem(18);
}
.block-list-wrapper {
  min-height: calc(100vh - #{rem(100)});
  background-color: white;
  padding: 0 rem(10);
  border-radius: rem(8);
  .block-total-list {
    padding: 0;
    width: 100%;
    margin-left: 0;
    border-radius: 1px;
    /deep/ td,
    /deep/ th {
      vertical-align: middle;
      padding: 18px 10px;
    }
    /deep/ td {
      padding: 0 10px;
      height: rem(57);
    }
    /deep/ tr th,
    /deep/ tr td {
      &:nth-child(1) {
        width: 60px;
        text-align: center;
      }
      &:nth-child(2) {
        width: 400px;
      }
      &:last-child {
        padding-left: 0;
        width: 110px;
      }
    }
  }
  .account-item {
    display: flex;
    align-items: center;
  }
}
</style>
