<template>
  <div class="chart-wrapper">
    <highcharts ref="chart" class="chart-con" :options="chartOptions"></highcharts>
  </div>
</template>

<script>
import { getMonth, readable } from '../../utils'

export default {
  name: 'BarChart',
  props: {
   data: {
      type: Array,
      default: () => {}
    },
    time: {
      type: Array,
      default: () => []
    },
  },
  data() {
    const data = this.data
    const time = this.time
    // console.log(data, "data");
    // console.log(time, "time");
    let daysArray = []
    let series = []
    let seriesData = []
    let seriesData1 = []
    let seriesData2 = []

    for (let index = 0; index < time.length; index++) {
      // if (!count) {
        let thatDay = new Date(time[index] * 1000)
        daysArray.push(thatDay)
      // }
      const item = data.find(ele => ele.dateTime === time[index])
      seriesData.push(item.expected-item.actual)
      seriesData1.push(item.actual)
      seriesData2.push(item.expected)
    }
    series=[{ name:'Expected',data: seriesData, color: '#ffffff',borderColor:'#53B1FD', borderWidth:1, dashStyle:'Dash', stack: 0, pointWidth: 20 },
    { name:'Actual',data: seriesData1, color: '#53B1FD', stack: 0, pointWidth: 20 }]
    let max= Math.max(...seriesData2)
    
    return {
      chartOptions: {
        chart: {
          type: 'column'
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
          min: 0,
          max: max,
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
            let desc = `<span style="font-size:12px;color:#fff;">${(this.points[1].y/this.points[0].total*100).toFixed(2)}%</span>
            <span style="font-size:12px;color:#F2F4F7;margin-left:16px">${date}</span>`
            let content = `<br/>
            <span style="font-size:12px;font-weight:600;color:${this.points[0].color}">|</span>
            <span style="font-size:12px;font-weight:600;color:#98A2B3">Expected  </span>
            <span style="font-size:12px;color:#fff">${readable(this.points[0].total)}</span>
            <br/>
            <span style="font-size:12px;font-weight:600;color:${this.points[1].color}">|</span>
            <span style="font-size:12px;font-weight:600;color:#98A2B3">Actual  </span>
            <span style="font-size:12px;color:#fff">${readable(this.points[1].y)}</span>`
            return `${desc}${content}`
          }
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            borderWidth: 0
          }
        },
        series: series
      }
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.chart-wrapper {
}
.chart-con {
  width: 100%;
  height: rem(110);
}
</style>
