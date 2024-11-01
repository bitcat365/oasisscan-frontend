<template>
  <div class="blocks-root">
    <Head title="PROPOSALS">
      <template #HeadLeft>
        <span class="HeadLeft"> ({{ list.length | readable }})</span>
      </template>
    </Head>
    <Panel>
      <BlockTable :columns="columns" :data="list">
          <template v-slot:closed="{ data }">
            <span>{{data.closed_at}}</span><br/>
            <span class="time">{{ data.closed_time | timeFormat2 }}</span>
          </template>
      </BlockTable>
    </Panel>
  </div>
</template>

<script>
import { fetchProposals } from '../../fetch/index'
import BlockTable from '../../components/Table/index'
import Head from '~/components/Head'
import Page from '../../components/Page'
import Panel from '~/components/panel/Panel'

export default {
  name: 'index',
  components: {
    Head,
    BlockTable,
    Page,
    Panel
  },
  async asyncData({ $axios, store: $store }) {
    const { list } = await fetchProposals({ $axios, $store })
    return { list }
  },
  methods: {},
  computed: {},
  created() {},
  destroyed() {},
  data() {
    return {
      sizer: 20,
      page: 1,
      list: [],
      name: '',
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: '5%'
        },
        {
          title: 'Title',
          key: 'handler',
          width: '35%'
        },
        {
          title: 'Type',
          key: 'type',
          
        },
        {
          title: 'Status',
          key: 'state'
        },
        {
          title: 'Voting End on Epoch',
          key: 'closed',
          slot: true,
          textAlign: 'right'
        },
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.HeadLeft {
  color: $gray500;
  font-size: rem(16);
}
.time{
  color: $gray400;
  font-size: rem(12);
}
</style>
