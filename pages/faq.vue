<template>
  <div id="faq-root">
    <Head title="FAQ"></Head>
    <Panel>
      <div class="faq-list">
        <p class="title">API</p>
        <p>
          <a href="https://api.oasisscan.com/v2/swagger/" target="_blank"> https://api.oasisscan.com/v2/swagger/ </a>
        </p>
      </div>
      <div class="faq-list">
        <p class="title">Open Source</p>
        <p>
          <a href="https://github.com/bitcat365/oasisscan-frontend" target="_blank"> https://github.com/bitcat365/oasisscan-frontend </a>
        </p>
        <p>
          <a href="https://github.com/bitcat365/oasisscan-backend" target="_blank"> https://github.com/bitcat365/oasisscan-backend </a>
        </p>
      </div>
      <div class="faq-list">
        <p class="title">Cryptocurrency data API</p>
        <p>
          <a href="https://www.coingecko.com" target="_blank"> https://www.coingecko.com </a>
        </p>
      </div>
    </Panel>
  </div>
</template>

<script>
import Head from '~/components/Head'
import Panel from '~/components/panel/Panel'
export default {
  components: {
    Head,
    Panel
  },
  mounted() {},
  beforeDestroy() {},
  methods: {},
  data() {
    return {}
  }
}
</script>

<style scoped lang="scss">
#faq-root {
  .faq-list {
    padding: 0 rem(10);
    &:nth-child(n-1) {
      margin-bottom: rem(20);
    }
    > p {
      margin-bottom: rem(10);
    }
    a {
      margin-left: rem(10);
      font-size: rem(14);
      font-weight: 400;
      color: $gray500;
      text-decoration: none;
    }
  }
}
</style>
