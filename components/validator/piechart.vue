<template>
  <div class="chart-wrapper">
    <highcharts ref="chart" class="chart-con" :options="chartOptions"></highcharts>
  </div>
</template>

<script>
  export default {
    name: 'piechart',
    props: ['data'],
    data() {
      let colors = ['#4CD4A9', '#919191']
      let data = [
        ['Self', parseFloat(this.data.self)],
        ['Other', parseFloat(this.data.other)]
      ]
      if (+this.data.self === 0) {
        colors = colors.reverse()
        data = data.reverse()
      }
      return {
        chartOptions: {
          colors: colors,
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
            data: data
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
