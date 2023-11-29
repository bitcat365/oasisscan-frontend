<template>
  <div class="chart-wrapper">
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
    let daysArray = []
    for (let i = 0; i < this.tx.length; i++) {
      let thatDay = new Date(this.tx[i].key * 1000)
      daysArray.push(thatDay)
    }
    let data = this.tx.map(h => h.value)
    let data1 = this.escrow.map(h => h.value)
    let yMin = Math.floor(Math.min(...data))
    let yMax = Math.ceil(Math.max(...data))
    let yMin1 = Math.floor(Math.min(...data1))
    let yMax1 = Math.ceil(Math.max(...data1))

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
            align: 'right',
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
        yAxis: [
          {
            title: '',
            min: yMin,
            max: yMax,
            labels: {
              y: 13,
              style: {
                color: '#7A5AF8'
              }
            },
            gridLineColor: '#F2F4F7'
          },
          {
            title: '',
            min: yMin1,
            max: yMax1,
            offset: 0,
            labels: {
              y: 0,
              style: {
                color: '#53B1FD'
              }
            },
            gridLineColor: '#F2F4F7'
          }
        ],
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
            <span style="font-size:12px;color:#7A5AF8">|</span>
            <span style="font-size:12px;font-weight:600;color:#fff">${readable(this.points[0].y)}</span>
            <br/>
            <span style="font-size:12px;color:#53B1FD">|</span>
            <span style="font-size:12px;font-weight:600;color:#fff">${readable(this.points[1].y)}</span>`
          }
        },
        credits: {
          enabled: false
        },
        colors: ['#7A5AF8', '#53B1FD'],
        series: [
          {
            name: '',
            data: [...data],
            marker: {
              enabled: false,
              symbol: 'circle',
              radius: 2
            },
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
            data: [...data1],
            yAxis: 1,
            shadow: false,
            marker: {
              enabled: false,
              symbol: 'circle',
              radius: 2
            },
            fillColor: {
              linearGradient: [0, 0, 0, 300],
              stops: [[0, 'rgba(83,177,253,0.3)'], [0.6, 'rgba(83,177,253,0)']]
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
