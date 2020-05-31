import Vue from 'vue'
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
export default () => {
  Vue.use(HighchartsVue, {
    highcharts: Highcharts
  })
}
