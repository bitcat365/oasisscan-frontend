<template>
  <div>
    <Head title="ACCOUNTS">
      <template #HeadLeft>
        <span class="HeadLeft">({{ total | readable }})</span>
      </template>
    </Head>
    <Panel>
      <BlockTable v-if="list && list.length > 0" :loading="loading" :columns="columns" :data="list">
        <template v-slot:address="{ data }">
          <div class="account-item">
            <router-link :to="data.link">{{ data.text }}</router-link>
          </div>
        </template>
      </BlockTable>
      <Page v-if="list && list.length > 0" :page="page" :sizer="sizer" :records-count="total" root-class="block-page" @goto="goto"></Page>
    </Panel>
  </div>
</template>

<script>
import LS from 'local-storage'
import { fetchAccountsList } from '../../fetch/index'
import Panel from '~/components/panel/Panel'
import BlockTable from '../../components/Table/index'
import Head from '~/components/Head'
import Page from '../../components/Page'

export default {
  name: 'index',
  components: {
    Panel,
    Head,
    BlockTable,
    Page
  },
  async asyncData({ $axios, store: $store }) {
    const { list, totalSize } = await fetchAccountsList({ $axios, $store }, 1, 20)
    // console.log('list', list)
    return { list, total: totalSize }
  },
  methods: {
    async goto(pageNumber, pageSize) {
      const $axios = this.$axios
      const $store = this.$store
      this.loading = true
      const { list, totalSize } = await fetchAccountsList({ $axios, $store }, pageNumber, pageSize)
      this.loading = false
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
          textAlign: 'left',
          width: '5%'
        },
        {
          title: 'Account',
          key: 'address',
          slot: true,
          width: '35%'
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
      ],
      loading: false
    }
  }
}
</script>

<style scoped lang="scss">
.HeadLeft {
  color: $gray500;
  font-size: rem(16);
}
.account-item {
  display: flex;
  align-items: center;
}
</style>
