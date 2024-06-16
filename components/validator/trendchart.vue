<template>
  <div class="chart-wrapper">
    <highcharts ref="chart" class="chart-con" :options="chartOptions"></highcharts>
  </div>
</template>

<script>
import { getMonth, readable } from '../../utils'

export default {
  name: 'TrendChart',
  props: {
    trends: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    // const days = this.trends.length
    // const daysArray = []
    // const latest = days > 0 ? this.trends[days - 1].timestamp : +new Date()
    // for (let day = 0; day < days; day++) {
    //   const thatDay = new Date(latest)
    //   thatDay.setDate(new Date(latest).getDate() - day)
    //   daysArray.push(thatDay.getDate() + '<br/>' + getMonth(thatDay.getMonth()))
    // }
    // daysArray.reverse()
    const values = this.trends.map(h => +h.escrow).sort((a, b) => a - b)
    let daysArray = []
    for (let i = 0; i < this.trends.length; i++) {
      let thatDay = new Date(this.trends[i].timestamp)
      daysArray.push(thatDay)
    }
    // let values = this.trends.map(h => h.value)
    const min = values[0]
    const max = values[values.length - 1]
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
            step: 3,
            formatter: function() {
              let day = this.value.getDate()
              let month = getMonth(this.value.getMonth())
              return day + `<br/>` + month
            },
            style: {
              color: '#98A2B3'
            }
          },
          crosshair: {
            width: 1,
            dashStyle: 'LongDash',
            color: '#D0D5DD'
          }
        },
        yAxis: {
          title: {
            text: ''
          },
          minPadding: 0.2,
          floor: 0,
          min: min - (max - min) * 0.02,
          max: max + (max - min) * 0.02,
          labels: {
            style: {
              color: '#53B1FD'
            }
          },
          gridLineColor: '#F2F4F7'
        },
        tooltip: {
          shared: true,
          backgroundColor: 'rgba(52, 64, 84, 0.7)',
          borderWidth: 0,
          shadow: false,
          borderRadius: 10,
          formatter: function() {
            let date = getMonth(this.x.getMonth()) + ' ' + this.x.getDate() + ' ' + this.x.getFullYear()
            return `<span style="font-size:12px;color:#E4E7EC">${date}</span>
            <br/>
            <span style="font-size:12px;font-weight:600;color:#53B1FD">|</span>
            <span style="font-size:12px;font-weight:600;color:#fff">${readable(this.y)}</span>`
          }
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          areaspline: {
            fillOpacity: 0.2,
            color: '#53B1FD',
            marker: {
              enabled: false
            }
          }
        },
        series: [
          {
            name: '',
            data: this.trends.map(h => +h.escrow)
          }
        ]
      }
    }
  },
  mounted() {
    // console.log('this.$refs.chart',this.$refs, this.trends)
  }
}
</script>

<style lang="scss" scoped>
.chart-wrapper {
  margin-top: rem(12);
}
.chart-con {
  width: 100%;
  height: rem(200);
}
</style>
