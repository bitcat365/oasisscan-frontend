import Vue from 'vue'
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
export default () => {
  if (Highcharts.setOptions) {
    Highcharts.setOptions({
      lang: {
        thousandsSep: ','
      }
    })
  }
  Vue.use(HighchartsVue, {
    highcharts: Highcharts
  })
}
