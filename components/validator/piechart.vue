<template>
  <div class="chart-wrapper">
    <highcharts ref="chart" class="chart-con" :options="chartOptions"></highcharts>
    <div>
      <div class="title">
        <div style="display: inline-block;width: 30px;height: 4px;background-color: #000;"></div>
        <span class="label">Self</span> <span class="per">({{ (data.self / data.total) | percentFormat }})</span>
      </div>
      <div class="values">
        <span>{{ data.self | readable }} ROSE / {{ data.self | readable }} Shares</span>
      </div>
      <div class="title">
        <span class="label">Other</span> <span class="per">({{ (data.other / data.total) | percentFormat }})</span>
      </div>
      <div class="values">
        <span>{{ data.other | readable }} ROSE / {{ data.other | readable }} Shares</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'piechart',
  props: ['data'],
  data() {
    let colors = ['#B692F6', '#36BFFA80']
    let data = [['Self', parseFloat(this.data.self)], ['Other', parseFloat(this.data.other)]]
    if (+this.data.self === 0) {
      data = data.reverse()
    }
    return {
      chartOptions: {
        colors: colors,
        chart: {},
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
        },
        series: [
          {
            type: 'pie',
            name: '',
            innerSize: '60%',
            data: data
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/utils';
.chart-wrapper {
  @extend .flexRow;
  align-items: center;
}
.chart-con {
  width: rem(200);
  height: rem(200);
}
</style>
