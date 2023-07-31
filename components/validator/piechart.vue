<template>
  <div class="chart-wrapper">
    <highcharts ref="chart" class="chart-con" :options="chartOptions"></highcharts>
    <div class="chart-desc">
      <div class="title">
        <div class="title-icon self-background-color"></div>
        <span class="title-label self-color">Self ({{ (data.self / data.total) | percentFormat }})</span>
      </div>
      <div class="values">
        <span>{{ data.self | readable }} ROSE </span>
        <span>/ {{ data.self | readable }} Shares</span>
      </div>
      <div class="title">
        <div class="title-icon other-background-color"></div>
        <span class="title-label other-color">Other ({{ (data.other / data.total) | percentFormat }})</span>
      </div>
      <div class="values">
        <span>{{ data.other | readable }} ROSE </span>
        <span>/ {{ data.other | readable }} Shares</span>
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
.self-color { 
  color:#B692F6;
}
.self-background-color{
  background-color: #B692F6;
}
.other-color { 
  color:#36BFFA;
}
.other-background-color{
  background-color: #36BFFA;
}
.chart-wrapper {
  @extend .flexRow;
  align-items: center;
}
.chart-con {
  width: rem(200);
  height: rem(200);
}
.chart-desc{
  .title {
    .title-icon{
      display: inline-block;
      width: rem(30);
      height: rem(4);
      margin: rem(4) 0;
    }
    .title-label{}
  }
  .values {}
}
</style>
