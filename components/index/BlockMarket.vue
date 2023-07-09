<template>
  <div class="market_content">
    <div class="market_left">
      <highcharts class="chart-con" refs="chart" :options="chartOptions"></highcharts>
    </div>
    <div class="market_right">
      <p :class="class_p1">
        <img src="../../assets/arrow-up.svg" v-if="marketChange > 0" />
        <img src="../../assets/arrow-down.svg" v-if="marketChange < 0" />
        {{ marketChange.toFixed(2) }}%
      </p>
      <p class="p2">from yesterday</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    let xData = []
    let yData = []
    for (let i = 0; i < this.marketChart.length; i++) {
      xData.push(this.marketChart[i].key)
      yData.push(this.marketChart[i].value)
    }
    return {
      chartOptions: {
        chart: {
          type: 'spline'
        },
        colors: ['#36BFFA'],
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
          categories: [...xData],
          labels: {
            enabled: false
          },
          lineWidth: 0
        },
        yAxis: {
          title: {
            text: ''
          },
          labels: {
            enabled: false
          },
          gridLineWidth: 0
        },
        tooltip: {
          backgroundColor: '#344054',
          borderWidth: 0,
          shadow: false,
          borderRadius: 10,
          formatter: function() {
            return `<span style="font-size:10px;font-weight:600;color:#fff">${this.x}</span>
            <br/>
            <span style="font-size:10px;color:#98A2B3">$${this.y}</span>`
          }
        },
        credits: {
          enabled: false
        },
        series: [
          {
            name: '',
            marker: {
              enabled: false
            },
            data: yData,
            shadow: {
              color: '#7A5AF8',
              width: 10,
              offsetY: 5,
              opacity: 0.02
            }
          }
        ]
      }
    }
  },
  props: {
    marketChart: {
      type: Array,
      default: [{ key: '', value: 0 }]
    },
    marketChange: {
      type: Number,
      default: 0
    }
  },
  computed: {
    class_p1() {
      let className
      if (this.marketChange < 0) {
        className = 'p1_down'
      } else if (this.marketChange > 0) {
        className = 'p1_up'
      } else {
        className = 'p1'
      }
      return className
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/utils';
.market_content {
  @extend .flexRow;
  align-items: center;
  height: 100%;
  // TODO
  .market_left {
    .chart-con {
      width: 260px;
      height: 100px;
    }
  }
  .market_right {
    text-align: right;
    .p1 {
      font-weight: 600;
    }
    .p1_up {
      font-weight: 600;
      color: #12b76a;
    }
    .p1_down {
      font-weight: 600;
      color: #f04438;
    }
    .p2 {
      color: $gray400;
    }
  }
}
</style>
