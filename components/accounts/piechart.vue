<template>
  <div v-if="!disable" class="chart-wrapper">
    <highcharts
      ref="chart"
      class="chart-con"
      :options="chartOptions"></highcharts>
    <div class="labels-con">
      <div class="label-item">
        <div class="circle" style="border-color: #4CD4A9;"></div>
        <div>Available</div>
      </div>
      <div class="label-item">
        <div class="circle" style="border-color: #58D0FF;"></div>
        <div>Escrow</div>
      </div>
      <div class="label-item">
        <div class="circle" style="border-color: #919191;"></div>
        <div>Debonding</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'piechart',
    props: ['data'],
    data() {
      // console.log(this.data, 'data')
      return {
        disable: parseFloat(this.data.available) === 0 && parseFloat(this.data.escrow) === 0 && parseFloat(this.data.debonding) === 0,
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
            data: [
              { name: 'Available', y: parseFloat(this.data.available) },
              { name: 'Escrow', y: parseFloat(this.data.escrow) },
              { name: 'Debonding', y: parseFloat(this.data.debonding) }
            ]
          }]
        }
      }
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/common";
  .chart-con {
    margin-top: rem(0);
    width: rem(210);
    height: rem(210);
  }
  .chart-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-right: rem(40);
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
