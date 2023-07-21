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

    let data = this.tx.map(h => h.value)
    let data1 = this.escrow.map(h => h.value)
    let yMin = Math.floor(Math.min(...data))
    let yMax = Math.ceil(Math.max(...data))
    let yMin1 = Math.floor(Math.min(...data1))
    let yMax1 = Math.ceil(Math.max(...data1))
    // let yStep = Math.round((yMax - yMin)/4)
    // let yStep1 = Math.round((yMax1 - yMin1)/4)
    console.log(yMax,yMin,yStep, yStep1)

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
        yAxis: [
          {
            title: "",
            min: yMin,
            max: yMax,       
            // labels: {
            //   step: 300
            // }
          },
          {
            title: "",
            min: yMin1,
            max: yMax1,
            // x: 0,
            // y: 0
            // linkedTo: 0
            // tickPositioner
          }
        ],
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
            data:data1,
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
