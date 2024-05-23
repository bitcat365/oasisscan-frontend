<template>
  <div class="chart-wrapper">
    <highcharts
      ref="chart"
      class="chart-con"
      :options="chartOptions"
    ></highcharts>
  </div>
</template>

<script>
import { getMonth, readable } from "../../utils";

export default {
  name: "barchart",
  props: {
    data: {
      type: Object,
      default: ()=>{}
    }
  },
  data() {
    const data = this.data;
    let daysArray = [];
    let daysNum = 0
    let series = [];
    // console.log("data", this.data);
    for (var key in data) {
      const name = data[key].validatorName ? data[key].validatorName : key;
      let seriesData = []
      for (let i = 0; i < data[key].rewardList.length; i++) {
        const ele = data[key].rewardList[i];
        seriesData.push(Number(ele.reward))
        if(!daysNum){
          let thatDay = new Date(ele.dateTime * 1000)
          daysArray.push(thatDay)
        }
      }
      daysNum++
      series.push({name: name, data: seriesData, stack: 0, pointWidth: 20})
    }
    // console.log("series:", series);

    // const values = this.data.map(h => +h.escrow).sort((a, b) => a - b)
    // const min = values[0];
    // const max = values[values.length - 1];
    return {
      chartOptions: {
        chart: {
          type: "column"
        },
        title: {
          text: ""
        },
        legend: {
          enabled: false
        },
        colors: [
          "#B692F6",
          "#36BEF8",
          "#FDB022",
          "#32D583",
          "#FDA29B",
          "#98A2B3"
        ],
        xAxis: {
          title: {
            text: ""
          },
          categories: [...daysArray],
          labels: {
            formatter: function() {
              let day = this.value.getDate();
              let month = getMonth(this.value.getMonth());
              return day + `<br/>` + month;
            },
            style: {
              color: "#98A2B3"
            }
          },
          crosshair: {
            width: 1,
            dashStyle: "LongDash",
            color: "#D0D5DD"
          }
        },
        yAxis: {
          title: {
            text: ""
          },
          allowDecimals: false,
          min: 0,
          minPadding: 0.2,
          floor: 0,
          // min: min - (max - min) * 0.02,
          // max: max + (max - min) * 0.02,
          labels: {
            style: {
              color: "#53B1FD"
            }
          },
          gridLineColor: "#F2F4F7"
        },
        tooltip: {
          shared: true,
          backgroundColor: "rgba(52, 64, 84, 0.7)",
          borderWidth: 0,
          shadow: false,
          borderRadius: 10
          // formatter: function() {
          //   let date = getMonth(this.x.getMonth()) + ' ' + this.x.getDate() + ' ' + this.x.getFullYear()
          //   return `<span style="font-size:12px;color:#E4E7EC">${date}</span>
          //   <br/>
          //   <span style="font-size:12px;color:#53B1FD">|</span>
          //   <span style="font-size:12px;font-weight:600;color:#fff">${readable(this.y)}</span>`
          // }
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          column: {
            stacking: "normal"
          }
          // areaspline: {
          //   fillOpacity: 0.2,
          //   color: '#53B1FD',
          //   marker: {
          //     enabled: false
          //   }
          // }
        },
        series: series
        // [{
        //   name: '',
        //   data: this.data.map(h => +h.escrow)
        // }]
      }
    };
  }
};
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
