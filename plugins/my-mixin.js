import Vue from 'vue'
import Config from '../config'
if (!Vue.__my_mixin__) {
  Vue.__my__mixin__ = true
  Vue.mixin({
    computed: {
      isTest() {
        return this.$store.state.net === Config.testnetChainId
      }
    }
  }) // Set up your mixin then
}
