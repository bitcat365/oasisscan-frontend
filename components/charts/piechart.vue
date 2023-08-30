<template>
  <div class="chart-wrapper">
    <highcharts ref="chart" class="chart-con" :options="chartOptions"></highcharts>
    <div class="chart-desc">
      <template v-for="(item, index) in descList">
        <div class="title">
          <div class="title-icon" :style="{ backgroundColor: colors[index].slice(0, 7) }"></div>
          <span :style="{ color: colors[index].slice(0, 7) }" v-if="item.title">{{ item.title }}</span>
        </div>
        <div class="values">
          <span class="values-content" v-if="item.content">{{ item.content }} </span>
          <span class="values-content1" v-if="item.content1">{{ item.content1 }} </span>
          <slot v-if="item.contentName"></slot>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'piechart',
  props: ['data', 'descList', 'colors'],
  data() {
    const that = this
    return {
      chartOptions: {
        colors: this.colors,
        chart: {},
        title: {
          text: ''
        },
        credits: {
          enabled: false
        },
        tooltip: {
          formatter: function() {
            const color = this.color.slice(0, 7)
            that.chartOptions.tooltip.backgroundColor = color
            const index = this.point.x
            return `<span style="font-size:12px;color:#fff;font-size:600}">${that.descList[index].title}</span><br/>
            <span style="font-size:12px;color:#fff;font-size:600}">${that.descList[index].content}</span>`
          },
          backgroundColor: '#fff',
          borderColor: '#fff',
          borderRadius: 8
        },
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
            data: this.data,
            borderWidth: 4
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
  .title {
    .title-icon {
      display: inline-block;
      width: rem(30);
      height: rem(4);
      margin: rem(4) 0;
    }
  }
  .values {
    margin-bottom: rem(10);
    .values-content {
      color: $gray500;
    }
    .values-content1 {
      color: $gray400;
    }
  }
}
</style>
