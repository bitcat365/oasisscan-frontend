<template>
  <div class="chart-wrapper">
    <highcharts ref="chart" class="chart-con" :options="chartOptions"></highcharts>
    <div class="chart-desc">
      <template v-for="(item, index) in descList">
        <div class="title" :key="'title'+index">
          <div class="title-icon" :style="{ backgroundColor: colors[index].slice(0, 7) }"></div>
          <span :style="{ color: colors[index].slice(0, 7) }" v-if="item.title">{{ item.title }}</span>
        </div>
        <div class="values" :key="'values'+index">
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
            let content = `<span style="font-size:12px;color:#fff;font-size:600}">${that.descList[index].title}</span><br/>`
            if (Object.hasOwn(that.descList[index], 'content') || Object.hasOwn(that.descList[index], 'value')) {
              content += `<span style="font-size:12px;color:#fff;font-size:600}">${that.descList[index].content ? that.descList[index].content : that.descList[index].value}</span>`
            }
            return content
          },
          backgroundColor: '#fff',
          borderColor: '#fff',
          borderRadius: 8
        },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: false,
            },
            borderRadius: 10  //TODO
          }
        },
        series: [
          {
            type: 'pie',
            name: '',
            innerSize: '55%',
            data: this.data,
            borderWidth: 4,
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
  align-items: center;
  // justify-content: space-around;
  >* {
    flex: 1;
  }
}
.chart-con {
  width: rem(200);
  height: rem(200);
}
.chart-desc {
  font-size: rem(14);
    padding-left: rem(40);
  .title {
    position: relative;
    .title-icon {
      // display: inline-block;
      position: absolute;
      left: rem(-40);
      top: rem(5);
      width: rem(30);
      height: rem(4);
      margin: rem(4) 0;
    }
  }
  .values {
    margin-bottom: rem(10);
    font-weight: 400;
    .values-content {
      color: $gray500;
    }
    .values-content1 {
      color: $gray400;
    }
  }
}
</style>
