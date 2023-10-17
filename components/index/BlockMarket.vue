<template>
  <div class="market_content">
    <div class="market_left">
      <highcharts class="chart-con" ref="chart" :options="chartOptions"></highcharts>
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
import { readable } from '../../utils'
export default {
  data() {
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
          categories: [...this.marketChart.xData],
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
          backgroundColor: 'rgba(52, 64, 84, 0.7)',
          borderWidth: 0,
          shadow: false,
          borderRadius: 10,
          formatter: function() {
            return `
            <span style="font-size:12px;font-weight:600;color:#fff">$${readable(this.y)}</span>
            <br/>
            <span style="font-size:12px;color:#E4E7EC">${this.x}</span>`
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
            data: this.marketChart.yData,
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
      type: Object,
      default: () => {
        return { xData: [], yData: [] }
      }
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
  .market_left {
    flex: 1;
    min-width: 11rem;
    .chart-con {
      height: 6.25rem;
      width: 100%;
    }
  }
  .market_right {
    flex: 1;
    text-align: right;
    .p1 {
      font-weight: 600;
    }
    .p1_up {
      font-weight: 600;
      color: #12b76a;
    }
    .p1_down {
      font-size: 1rem;
      font-weight: 600;
      color: #f04438;
    }
    .p2 {
      color: $gray400;
    }
  }
}
</style>
