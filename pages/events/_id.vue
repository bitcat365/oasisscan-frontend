<template>
  <div class="root">
    <Head title="EVENT DETAILS"></Head>
    <panel>
      <Description :list="descriptionList" class="info-list">
        <template #timestamp>
          <span>{{ data.value | timeFormat }} ( {{ data.value | timeFormat2 }} )</span>
        </template>
      </Description>
    </panel>
    <panel class="trx-panel" title="Contents">
      <div class="raw-data">
        <pre> {{ data.raw | pretty }}</pre>
      </div>
    </panel>
  </div>
</template>

<script>
import Head from '~/components/Head'
import Panel from '../../components/panel/Panel'
import Description from '~/components/description/index.vue'
import { fetchEventDetail } from '~/fetch/index'
export default {
  name: 'eventDetail',
  components: { Head, Panel, Description },
  async asyncData({ $axios, store: $store, params }) {
    const data = await fetchEventDetail({ $axios, $store }, params.id)
    return {
      data
    }
  },
  data() {
    return {}
  },
  computed: {
    descriptionList() {
      return [
        {
          title: 'Tx Hash',
          content: this.data.txHash || ''
        },
        {
          title: 'Type',
          content: this.data.type || ''
        },
        {
          title: 'Height',
          content: this.data.height || ''
        },
        {
          title: 'Time',
          name: 'timestamp'
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.trx-panel {
  margin-top: rem(12);
  .raw-data {
    background: #f8f9fa;
    border: 1px solid #b2b2b2;
    border-radius: rem(4);
    max-height: rem(400);
    overflow-y: scroll;
    padding: rem(15) rem(20);
    margin-top: rem(30);
    margin-left: rem(20);
    margin-right: rem(20);
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
}
</style>
