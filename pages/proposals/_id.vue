<template>
  <div class="root">
    <Head title="PROPOSAL DETAILS"></Head>
    <Panel class="margin-bottom">
      <div class="overview-content">
        <Description :list="descriptionList" :span="[8, 16]" class="info-list"></Description>
        <pie-chart :data="pieChartData" :descList="descList" :colors="['#B692F6', '#36BFFA80', '#016AA3']" class="chart"></pie-chart>
      </div>
    </Panel>
    <Panel title="Votes" class="block-list-wrapper" v-if="!isRequesting">
      <BlockTable :data="data.votes" :columns="columns"> </BlockTable>
    </Panel>
  </div>
</template>

<script>
import Head from '~/components/Head'
import Panel from '../../components/panel/Panel'
import BlockTable from '../../components/Table/index'
import Page from '../../components/Page'
import Description from '~/components/description/index.vue'
import PieChart from '../../components/charts/piechart'
import { fetchProposalDetail, fetchVotes } from '../../fetch'
import { decimalConvert, percent, readable, capitalize } from '~/utils'
export default {
  name: 'proposalDetail',
  components: { Head, Panel, BlockTable, Page, Description, PieChart },
  async asyncData({ $axios, store: $store, params }) {
    const data = await fetchProposalDetail({ $axios, $store }, params.id)
    return {
      data
    }
  },
  data() {
    return {
      isRequesting: false,
      list: [],
      total: 0,
      sizer: 10,
      page: 1,
      columns: [
        // TODO
        {
          title: 'Validator',
          key: 'voter'
        },
        {
          title: 'Answer',
          key: 'vote',
          textAlign: 'right'
        }
      ]
    }
  },
  computed: {
    descriptionList() {
      return [
        {
          title: 'ID',
          content: this.data.id || ''
        },
        {
          title: 'Title',
          content: this.data.handler || ''
        },
        {
          title: 'Type',
          content: this.data.type || ''
        },
        {
          title: 'Submitter',
          content: this.data.submitter || ''
        },
        {
          title: 'Deposit',
          content: this.data.deposit || ''
        },
        {
          title: 'Status',
          content: this.data.state || ''
        }
      ]
    },
    pieChartData() {
      const data = this.data.options
      const list = data.map(item => {
        return item.percent
      })
      return list
    },
    descList() {
      const data = this.data.options
      const list = data.map(item => {
        return {
          title: capitalize(item.name)
          // value:parseFloat(decimalConvert(item.amount))
        }
      })
      return list
    }
  },
  async mounted() {
    // await this.fetchList()
    // this.isRequesting = false
  },
  methods: {
    goto() {
      // this.fetchList()
    },
    async fetchList() {
      const $axios = this.$axios
      const $store = this.$store
      const { list } = await fetchVotes({ $axios, $store }, this.$route.params.id)
      this.list = list
    }
  }
}
</script>

<style scoped lang="scss">
.margin-bottom {
  margin-bottom: rem(20);
}
.page-navigation {
  padding-top: 30px;
  display: flex;
  justify-content: center;
}
.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 14px;
  color: rgba(55, 65, 107, 1);
  padding: rem(80) 0;
  .empty-icon {
    width: rem(80);
    margin-bottom: rem(11);
  }
}
.status-fail,
.status-success {
  padding: rem(4) rem(10);
  color: white;
  border-radius: rem(4);
  font-size: rem(12);
}
.status-fail {
  background-color: #f7685b;
}
.status-success {
  background-color: #2ed47a;
}
.overview-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .info-list {
    flex: 3;
  }
  .chart {
    flex: 1;
  }
}
.block-list-wrapper{
  /deep/.hash-link{
    color: $gray500 !important;
  }

}
</style>
