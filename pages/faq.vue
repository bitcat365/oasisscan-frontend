<template>
  <div id="faq-root">
    <Head title="FAQ"></Head>
    <Panel>
      <div class="faq-list">
        <p class="title">API</p>
        <p>
          <a href="https://api.oasisscan.com/testnet/swagger-ui/" target="_blank"> Testnet https://api.oasisscan.com/testnet/swagger-ui/ </a>
        </p>
        <p>
          <a href="https://api.oasisscan.com/mainnet/swagger-ui/" target="_blank"> Mainnet https://api.oasisscan.com/mainnet/swagger-ui/ </a>
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
        <p>
          <a href="https://github.com/bitcat365/oasis_api_server" target="_blank"> https://github.com/bitcat365/oasis_api_server </a>
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
    &:first-child{
      margin-bottom: rem(20);
    }
    > p {
      margin-bottom: rem(10);
    }
    a {
      margin-left: rem(10);
      font-size: rem(14);
      color: $gray500;
      text-decoration: none;
    }
  }
}
</style>
