<template>
  <div class="chart-wrapper">
    <highcharts class="chart-con" refs="chart" :options="chartOptions"></highcharts>
  </div>
</template>

<script>
  export default {
    name: "Chart",
    data() {
      return {
        chartOptions: {
          chart: {
            type: 'areaspline',
          },
          title: {
            text: ''
          },
          legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 150,
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: '#FFFFFF'
          },
          xAxis: {
            categories: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday'
            ]
          },
          yAxis: {
            title: {
              text: ''
            }
          },
          tooltip: {
            shared: true,
            valueSuffix: ' units'
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            areaspline: {
              fillOpacity: 0.5
            }
          },
          series: [{
            name: 'John',
            data: [3, 4, 3, 5, 4, 10, 12]
          }, {
            name: 'Jane',
            data: [1, 3, 4, 3, 3, 5, 4]
          }]
        }
      }
    },
    mounted() {
      console.log('this.$refs.chart',this.$refs)
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/common";
  .chart-wrapper {
    padding-top: rem(40);
  }
  .chart-con{
    width: rem(554);
    height: rem(220);
  }
</style>
