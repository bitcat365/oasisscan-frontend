<template>
  <div class="root">
    <Head title="EVENT DETAILS"></Head>
    <panel>
      <Description :list="descriptionList" class="info-list">
        <template #timestamp>
          <span>{{ data.timestamp.value | timeFormat }} ({{ data.timestamp.value | timeFormat2 }})</span>
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
.info-list{
  padding: 0 rem(10);
}
.trx-panel {
  margin-top: rem(20);
  .raw-data {
    color: $gray500;
    background: $gray50;
    font-size: rem(14);
    border-radius: rem(8);
    max-height: rem(400);
    overflow-y: auto;
    padding: rem(10);
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
}
</style>
