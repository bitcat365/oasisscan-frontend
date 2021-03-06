import Vue from 'vue'
import iView, { Page } from 'iview'
import locale from 'iview/dist/locale/en-US' // Change locale, check node_modules/iview/dist/locale

export default () => {
  Vue.use(iView, {
    locale
  })
  Vue.component('Ipage', Page)
}
