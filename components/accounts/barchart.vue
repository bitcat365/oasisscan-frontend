<template>
  <div class="chart-wrapper">
    <highcharts ref="chart" class="chart-con" :options="chartOptions"></highcharts>
  </div>
</template>

<script>
import { getMonth, readable, hashFormat } from '../../utils'

export default {
  name: 'barchart',
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    time: {
      type: Array,
      default: () => []
    },
    colors: {
      type: Array,
      default: () => ['#B692F6', '#36BEF8', '#FDB022', '#32D583', '#FDA29B', '#98A2B3']
    }
  },
  data() {
    const data = this.data;
    const time = this.time;
    // console.log(data, "data");
    // console.log(time, "time");
    let daysArray = [];
    let count = 0;
    let series = [];

    for (var key in data) {
      const name = data[key].validatorName ? data[key].validatorName : hashFormat(key);
      let seriesData = [];
      for (let index = 0; index < time.length; index++) {
        if (!count) {
          let thatDay = new Date(time[index] * 1000);
          daysArray.push(thatDay);
        }
        const item = data[key].rewardList.find(
          ele => ele.dateTime === time[index]
        );
        const value = Number(Number(item.reward).toFixed(2))
        seriesData.push(value);
      }
      const color = this.colors[(Object.keys(data).length - 1- count) % 6]
      series.push({ name: name, data: seriesData, color: color, stack: 0, pointWidth: 20 })
      count++;
    }
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
          allowDecimals: false,
          min: 0,
          minPadding: 0.2,
          floor: 0,
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
          outside: true,
          useHTML: true,
          hideDelay:5000,
          style: {
              pointerEvents: 'auto',
          },
          formatter: function() {
            // console.log(this)
            let date = getMonth(this.x.getMonth()) + ' ' + this.x.getDate() + ' ' + this.x.getFullYear()
            let desc = `<span style="font-size:12px;font-weight:600;color:#fff;">${this.points[0].total} ROSE</span>
            <span style="font-size:12px;color:#F2F4F7;margin-left:16px">${date}</span>`
            let content = ''
            for (let i = 0; i < this.points.length; i++) {
              content += `<br/>
            <span style="font-size:12px;font-weight:600;color:${this.points[i].color}">|</span>
            <span style="font-size:12px;font-weight:600;color:#98A2B3">${this.points[i].series.name}  </span>
            <span style="font-size:12px;color:#fff">${readable(this.points[i].y)}</span>`
            }
            const contentStyle ="max-height: 260px;overflow: auto;scrollbar-width: thin;scrollbar-color: #888 #f1f1f1;"
            return  desc+`<div style="${contentStyle}">${content}</div>`
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
