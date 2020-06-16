<template>
  <div class="chart-wrapper">
    <highcharts class="chart-con" refs="chart" :options="chartOptions"></highcharts>
  </div>
</template>

<script>
  export default {
    name: "piechart",
    data() {
      return {
        chartOptions: {
          chart: {
          },
          title: {
            text: ''
          },
          series: [{
            type: 'pie',
            name: '浏览器占比',
            data: [
              ['Firefox',  45.0],
              ['IE',       26.8],
              ['Chrome', 12.8],
              ['Safari',    8.5],
              ['Opera',     6.2],
              {
                name: '其他',
                y: 0.7,
                dataLabels: {
                  // 数据比较少，没有空间显示数据标签，所以将其关闭
                  enabled: false
                }
              }
            ]
          }]
        }
      }
    }
  }
</script>

<style scoped>

</style>
