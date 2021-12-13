<template>
  <div class="chart-wrapper">
    <highcharts ref="chart" class="chart-con" :options="chartOptions"></highcharts>
  </div>
</template>

<script>
  import { getMonth } from '../../utils';

  export default {
    name: 'TrendChart',
    props: {
      trends: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data() {
      const days = this.trends.length
      const daysArray = []
      const latest = days > 0 ? this.trends[days - 1].timestamp : +new Date()
      for (let day = 0; day < days; day++) {
        const thatDay = new Date(latest)
        thatDay.setDate(new Date(latest).getDate() - day)
        daysArray.push(thatDay.getDate() + '<br/>' + getMonth(thatDay.getMonth()))
      }
      daysArray.reverse()
      const values = this.trends.map(h => +h.escrow).sort((a, b) => (a - b))
      const min = values[0]
      const max = values[values.length - 1]
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
            },
            minPadding: 0.2,
            // maxPadding: 0.2,
            floor: 0,
            min: min - (max - min) * 0.02,
            max: max + (max - min) * 0.02
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
            data: this.trends.map(h => +h.escrow)
          }]
        }
      }
    },
    mounted() {
      // console.log('this.$refs.chart',this.$refs, this.trends)
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/common";
  .chart-wrapper {
    margin-top: rem(12);
  }
  .chart-con{
    width: rem(554);
    height: rem(142);
  }
</style>
