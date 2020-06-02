<template>
  <div class="chart-wrapper">
    <highcharts class="chart-con" refs="chart" :options="chartOptions"></highcharts>
  </div>
</template>

<script>
  import { getMonth } from '../../utils';

  export default {
    name: 'Chart',
    props: {
      txHistory: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data() {
      const days = this.txHistory.length
      const daysArray = []
      const latest = this.txHistory[days - 1].key * 1000;
      for (let day = 0; day < days; day++) {
        const thatDay = new Date(new Date(latest).setDate(1 - day))
        daysArray.push(thatDay.getDate() + '<br/>' + getMonth(thatDay.getMonth()))
      }
      daysArray.reverse()
      console.log('daysArray', daysArray)
      return {
        chartOptions: {
          chart: {
            type: 'areaspline',
          },
          title: {
            text: ''
          },
          legend: {
            enabled: false
          },
          xAxis: {
            title: {
              text: ''
            },
            categories: [
              ...daysArray
            ],
            labels: {
              step: 3
            }
          },
          yAxis: {
            title: {
              text: ''
            }
          },
          tooltip: {
            shared: false,
            valueSuffix: '',
            formatter: function () {
              return this.y
            }
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            areaspline: {
              fillOpacity: 0.2,
              color: '#F86E49',
              marker: {
                enabled: false
              }
            }
          },
          series: [ {
            name: '',
            data: this.txHistory.map(h => h.value)
          }]
        }
      }
    },
    mounted() {
      console.log('this.$refs.chart',this.$refs, this.txHistory)
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/common";
  .chart-wrapper {
    padding-top: rem(40);
  }
  .chart-con{
    width: rem(554);
    height: rem(220);
  }
</style>
