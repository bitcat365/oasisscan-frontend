<template>
  <div class="chart-wrapper">
    <highcharts ref="chart" class="chart-con" :options="chartOptions"></highcharts>
    <div class="chart-desc">
      <div class="title">
        <div class="title-icon self-background-color"></div>
        <span class="self-color">Self ({{ (data.self / data.total) | percentFormat }})</span>
      </div>
      <div class="values">
        <span class="values-rose">{{ data.self | readable }} ROSE </span>
        <span class="values-shares">/ {{ data.self | readable }} Shares</span>
      </div>
      <div class="title">
        <div class="title-icon other-background-color"></div>
        <span class="other-color">Other ({{ (data.other / data.total) | percentFormat }})</span>
      </div>
      <div class="values">
        <span class="values-rose">{{ data.other | readable }} ROSE </span>
        <span class="values-shares">/ {{ data.other | readable }} Shares</span>
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
        tooltip: false,
        plotOptions: {
          series: {
            dataLabels: {
              enabled: false
            }
          }
        },
        series: [
          {
            type: 'pie',
            name: '',
            innerSize: '55%',
            data: data,
            borderWidth: 4
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pie {
  border-radius: 5px;
}
.self-color {
  color: #b692f6;
}
.self-background-color {
  background-color: #b692f6;
}
.other-color {
  color: #36bffa;
}
.other-background-color {
  background-color: #36bffa;
}
.chart-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.chart-con {
  width: rem(200);
  height: rem(200);
}
.chart-desc {
  font-size: rem(14);
  height: rem(120);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .title {
    .title-icon {
      display: inline-block;
      width: rem(30);
      height: rem(4);
      margin: rem(4) 0;
    }
  }
  .values {
    .values-rose {
      color: $gray500;
    }
    .values-shares {
      color: $gray400;
    }
  }
}
</style>
