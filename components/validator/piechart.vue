<template>
  <div class="chart-wrapper">
    <highcharts class="chart-con" refs="chart" :options="chartOptions"></highcharts>
  </div>
</template>

<script>
  export default {
    name: 'piechart',
    props: ['data'],
    data() {
      return {
        chartOptions: {
          colors: ['#4CD4A9', '#919191'],
          chart: {
          },
          title: {
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
              size: 110
            }
          },
          series: [{
            type: 'pie',
            name: '浏览器占比',
            data: [
              ['Self', parseFloat(this.data.self)],
              ['Other', parseFloat(this.data.other)]
            ]
          }]
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/common";
  .chart-con {
    margin-top: rem(15);
    width: rem(135);
    height: rem(135);
  }
</style>
