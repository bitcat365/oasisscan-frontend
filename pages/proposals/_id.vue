<template>
  <div class="root">
    <Head title="PROPOSAL DETAILS"></Head>
    <panel>
      <template v-slot:header>
        <span>Header</span>
      </template>
      <div class="overview-content">
        <Description :list="descriptionList" class="info-list"></Description>
        <pie-chart :options="data.options"></pie-chart>
      </div>
    </panel>
    <panel title="Votes" class="trx-panel" v-if="!isRequesting">
      <p v-if="data.votes.length === 0" class="no-result">
        <img class="empty-icon" src="../../assets/empty.svg" />
        {{ $t("noVotes") }}
      </p>
      <block-table
        v-if="data.votes.length > 0"
        :data="data.votes"
        :columns="columns"
        root-class="block-total-list"
        cell-class="block-total-list-cell"
      >
      </block-table>
    </panel>
  </div>
</template>

<script>
import Head from "~/components/Head";
import Panel from "../../components/panel/Panel";
import BlockTable from "../../components/Table/index";
import Page from "../../components/Page";
import Description from '~/components/description/index.vue'
import PieChart from "../../components/proposals/piechart";
import { fetchProposalDetail, fetchVotes } from "../../fetch";

export default {
  name: "proposalDetail",
  components: { Head, Panel, BlockTable, Page, Description, PieChart },
  async asyncData({ $axios, store: $store, params }) {
    const data = await fetchProposalDetail({ $axios, $store }, params.id);
    return {
      data
    };
  },
  data() {
    return {
      isRequesting: false,
      list: [],
      total: 0,
      sizer: 10,
      page: 1,
      columns: [
        {
          title: "Voter",
          key: "voter"
        },
        {
          title: "Vote",
          key: "vote"
        }
      ]
    };
  },
  computed: {
    descriptionList() {
      return [
      {
          title: "ID",
          content: this.data.id || ''
        },
        {
          title: "Submitter",
          content: this.data.submitter || ''
        },
        {
          title: "Status",
          content: this.data.state || ''
        },
        {
          title: "Deposit",
          content: this.data.deposit || ''
        },
        {
          title: "Type",
          content: this.data.type || ''
        },
        {
          title: "Handler",
          content: this.data.handler || ''
        }
      ]
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
      const $axios = this.$axios;
      const $store = this.$store;
      const { list } = await fetchVotes(
        { $axios, $store },
        this.$route.params.id
      );
      this.list = list;
    }
  }
};
</script>

<style scoped lang="scss">
.trx-panel {
  margin-top: rem(12);
  .block-total-list {
    width: 100%;
    margin-left: 0;
    /deep/ tr td {
      &:nth-child(1) {
        .hash-link {
          color: #5f5f5f;
        }
      }
    }
  }
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
}
</style>
