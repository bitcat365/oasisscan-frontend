<template>
  <div class="chart-wrapper">
    <!-- {{ escrow }} -->
    <highcharts class="chart-con" ref="chart" :options="chartOptions"></highcharts>
  </div>
</template>

<script>
import { getMonth, readable } from '../../utils'

export default {
  name: 'Chart',
  props: {
    tx: {
      type: Array,
      default: function() {
        return []
      }
    },
    escrow: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    const days = this.tx.length
    const daysArray = []
    const latest = days > 0 ? this.tx[days - 1].key * 1000 : +new Date()
    for (let day = 0; day < days; day++) {
      const thatDay = new Date(latest)
      thatDay.setDate(new Date(latest).getDate() - day)
      daysArray.push(thatDay.getDate() + '<br/>' + getMonth(thatDay.getMonth()))
    }
    daysArray.reverse()

    const lastDayFinished = new Date(latest).setHours(23, 59, 59, 999) < Date.now()
    let data = this.tx.map(h => h.value)
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
          type: 'areaspline'
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
          categories: [...daysArray],
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
          backgroundColor: 'rgba(52, 64, 84, 0.7)',
          borderWidth: 0,
          shared: false,
          borderRadius: 10,
          formatter: function() {
            return this.point.tooltip || readable(this.y)
            // return `<span style="font-size:12px;font-weight:600;color:#fff">${this.x}</span>
            // <br/>
            // <span style="font-size:12px;color:#E4E7EC">$${readable(this.y)}</span>`
          }
        },
        credits: {
          enabled: false
        },
        colors: ['#7A5AF8', '#53B1FD'],
        // plotOptions: {
        //   areaspline: {
        //     color: '#7A5AF8',
        //     marker: {
        //       enabled: false
        //     }
        //     // TODO #53B1FD
        //   }
        // },
        series: [
          {
            name: '',
            data: data,
            marker: {
              enabled: false
            },
            // zoneAxis: 'x',
            // zones: [{ value: finishedDaysLength - 1 }, { dashStyle: 'shortdot', fillColor: 'transparent' }],
            fillColor: {
              linearGradient: [0, 0, 0, 300],
              stops: [
                // [0, Highcharts.getOptions().colors[0]],
                [0, 'rgba(122,90,248,0.3)'],
                [0.6, 'rgba(122,90,248,0)']
              ]
            }
          },
          {
            name: '',
            data: [10000, 80000, 100000, 60000, 200000, 160000, 180000, 120000],
            marker: {
              enabled: false
            },
            fillColor: {
              linearGradient: [0, 0, 0, 300],
              stops: [
                [0, 'rgba(83,177,253,0.3)'],
                [0.6, 'rgba(83,177,253,0)']
              ]
            }
          }
        ]
      }
    }
  },
  mounted() {
    // console.log('this.$refs.chart',this.$refs, this.tx)
  }
}
</script>

<style lang="scss" scoped>
.chart-wrapper {
  padding-top: rem(40);
}
.chart-con {
  width: 100%;
  height: rem(240);
}
</style>
