<template>
  <div class="chart-wrapper">
    <highcharts class="chart-con" refs="chart" :options="chartOptions"></highcharts>
  </div>
</template>

<script>
  import {getMonth} from '../../utils';

  export default {
    name: 'Chart',
    data() {
      const days = 31
      const daysArray = []
      for (let day = 0; day < days; day++) {
        if (day % 3 === 0) {
          const thatDay = new Date(new Date().setDate(1 - day))
          daysArray.push(thatDay.getDate() + '<br/>' + getMonth(thatDay.getMonth()))
          continue
        }
        daysArray.push('')
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
            data: [1, 3, 4, 3, 3, 5, 4, 7, 21, 8, 1, 3, 4, 3, 3, 5, 4, 7, 21, 8, 1, 3, 4, 3, 3, 5, 4, 7, 21, 8, 21, 17]
          }]
        }
      }
    },
    mounted() {
      console.log('this.$refs.chart',this.$refs)
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
