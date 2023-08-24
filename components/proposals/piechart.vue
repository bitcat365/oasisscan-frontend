<template>
  <div class="chart-wrapper">
    <highcharts
      ref="chart"
      class="chart-con"
      :options="chartOptions"></highcharts>
    <div class="labels-con">
      <div class="label-item">
        <div class="circle" style="border-color: #4CD4A9;"></div>
        <div>Yes</div>
      </div>
      <div class="label-item">
        <div class="circle" style="border-color: #58D0FF;"></div>
        <div>No</div>
      </div>
      <div class="label-item">
        <div class="circle" style="border-color: #919191;"></div>
        <div>Abstain</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { decimalConvert } from '../../utils'

  export default {
    name: 'piechart',
    props: ['options'],
    data() {
      // console.log(this.data, 'data')
      const pieData = this.options.map((item) => {
        return {
          name: item.name,
          y: parseFloat(decimalConvert(item.amount))
        }
      })
      return {
        chartOptions: {
          colors: ['#4CD4A9', '#58D0FF', '#919191'],
          chart: {
          },
          title: {
            floating: true,
            text: ''
          },
          credits: {
            enabled: false
          },
          tooltip: {
            headerFormat: '',
            pointFormat: '{point.name} ({point.percentage:.2f}%)<br>{point.y}'
         },
          plotOptions: {
            series: {
              dataLabels: {
                enabled: false
              }
            },
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              size: 160,
              borderWidth: 0,
              point: {
                events: {
                  mouseOver: (e) => {
                    // 标题更新函数，API 地址：https://api.hcharts.cn/highcharts#Chart.setTitle
                    // console.log('this.$refs', e.target)
                    // this.$refs.chart.chart.setTitle({
                    //   text: e.target.percentage.toFixed(2) + ' %'
                    // })
                  }
                }
              }
            }
          },
          series: [{
            type: 'pie',
            innerSize: '80%',
            data: pieData
          }]
        }
      }
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  .chart-con {
    margin-top: rem(0);
    // width: rem(210);
    // height: rem(210);
  }
  .chart-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .labels-con {
    display: flex;
    flex-direction: column;
    margin-left: rem(35);
    > .label-item {
      display: flex;
      flex-direction: row;
      font-size: rem(12);
      align-items: center;
      > .circle {
        margin-right: rem(8);
        width: rem(6);
        height: rem(6);
        background-color: white;
        border-radius: 50%;
        border-width: rem(2);
        border-style: solid;
      }
    }
  }
</style>
