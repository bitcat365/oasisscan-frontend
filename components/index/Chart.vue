<template>
  <div class="chart-wrapper">
    <highcharts class="chart-con" refs="chart" :options="chartOptions"></highcharts>
  </div>
</template>

<script>
import {getMonth, readable} from '../../utils';

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
      const latest = days > 0 ? this.txHistory[days - 1].key * 1000 : +new Date();
      for (let day = 0; day < days; day++) {
        const thatDay = new Date(latest)
        thatDay.setDate(new Date(latest).getDate() - day)
        daysArray.push(thatDay.getDate() + '<br/>' + getMonth(thatDay.getMonth()))
      }
      daysArray.reverse()

      const lastDayFinished = new Date(latest).setHours(23, 59, 59, 999) < Date.now()
      let data = this.txHistory.map(h => h.value)
      let finishedDaysLength = days
      if (!lastDayFinished && days > 0) {
        const unfinishedDayFraction = (latest - new Date(latest).setHours(0, 0, 0, 0)) / (24 * 60 * 60 * 1000)
        const lastFinishedDayData = data[data.length - 2]
        const unfinishedDayData = data.pop()
        const extrapolated = unfinishedDayData + lastFinishedDayData * (1 - unfinishedDayFraction)

        finishedDaysLength = days - 1
        data.push({
          x: finishedDaysLength,
          y: extrapolated,
          tooltip: `Extrapolated to ~${extrapolated.toFixed(0)} from ${unfinishedDayData}`
        })
        data.push(null) // Break line and draw unextrapolated marker too
        data.push({
          x: finishedDaysLength,
          y: unfinishedDayData,
          marker: { enabled: true }
        })
      }

      // console.log('daysArray', daysArray)
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
              return this.point.tooltip || readable(this.y)
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
            data: data,
            zoneAxis: 'x',
            zones: [{ value: finishedDaysLength - 1 }, { dashStyle: 'shortdot', fillColor: 'transparent' }]
          }]
        }
      }
    },
    mounted() {
      // console.log('this.$refs.chart',this.$refs, this.txHistory)
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
