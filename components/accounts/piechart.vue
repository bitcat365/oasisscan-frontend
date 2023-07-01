<template>
  <div v-if="!disable" class="chart-wrapper">
    <highcharts
      ref="chart"
      class="chart-con"
      :options="chartOptions"
    />
    <div class="labels-con">
      <div class="label-item">
        <div class="circle" style="border-color: #4CD4A9;" />
        <div>Available</div>
      </div>
      <div class="label-item">
        <div class="circle" style="border-color: #58D0FF;" />
        <div>Escrow</div>
      </div>
      <div class="label-item">
        <div class="circle" style="border-color: #919191;" />
        <div>Debonding</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Piechart',
    props: ['data'],
    data() {
      console.log(this.data, 'data')
      const parsedData = {
        available: this.data.available.replace(/,/g, ''),
        escrow: this.data.escrow.replace(/,/g, ''),
        debonding: this.data.debonding.replace(/,/g, '')
      }
      return {
        disable: parseFloat(parsedData.available) === 0 && parseFloat(parsedData.escrow) === 0 && parseFloat(parsedData.debonding) === 0,
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
              { name: 'Available', y: parseFloat(parsedData.available) },
              { name: 'Escrow', y: parseFloat(parsedData.escrow) },
              { name: 'Debonding', y: parseFloat(parsedData.debonding) }
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
