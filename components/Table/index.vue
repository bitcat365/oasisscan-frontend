<template>
  <table :class="rootClasses">
    <thead class="header">
    <tr>
      <th v-if="expand" class="table-expand-icon-th"></th>
      <th v-for="item in columns" :key="item.key" class="header-column" :class="cellClass" :style="headerStyle(item)">
        <div class="header-title">
          {{item.title}}
          <div v-if="item.sortable" class="sorts" @click="sort(item.key, item.sortType)">
            <img v-if="item.sortType === 'up'" class="up" :data-type="item.sortType=== 'up'" src="../../assets/arrow-light.svg">
            <img v-else class="up" :data-type="item.sortType=== 'up'" src="../../assets/arrow.svg">
            <div class="sep"></div>
            <img v-if="item.sortType === 'down'" :data-type="item.sortType=== 'down'" class="down" src="../../assets/arrow-light.svg">
            <img v-else class="down" :data-type="item.sortType=== 'down'" src="../../assets/arrow.svg">
          </div>
        </div>
      </th>
    </tr>
    </thead>
    <tbody>
    <tr
      v-for="(row, rowIndex) in rowData"
      :key="primaryKey ? row[primaryKey] : 'row' + rowIndex"
      :class="['table-row',
      rowData[rowIndex+1] && rowData[rowIndex+1].isExtendedRow ? 'show-expand': '',
      row.isExtendedRow ? 'extended-row' : 'main-row',
      row.odd === true || (row.isExtendedRow && rowData[rowIndex-1].odd) ? 'odd' :'']">
      <td v-if="expand" :class="['table-row-expand-icon-cell']" @click="expandRow(rowIndex)">
        <Icon v-if="!row.isExtendedRow" class="table-row-expand-icon" :type="!row.expand ? 'ios-add' : 'ios-remove'" />
      </td>
      <td v-if="row.isExtendedRow" class="table-row-expand-cell" :colspan="colspan">{{$t(row.key)}}&nbsp;:&nbsp;{{row.value}}</td>
      <table-cell
        v-for="(columnItem, columnIndex) in columns"
        v-else
        :key="`column${rowIndex}-${columnIndex}`"
        :data="row[columnItem.key]"
        :root-class="cellClass">
        <template v-if="columnItem.slot" v-slot:default="slotProps">
          <slot :name="columnItem.key" v-bind:data="slotProps.data"></slot>
        </template>
      </table-cell>
    </tr>
    </tbody>
  </table>
</template>
<script>
  import classNames from 'classnames'
  import TableCell from './TableCell'
  export default {
    props: {
      data: Array,
      columns: Array,
      rootClass: String,
      cellClass: String,
      expandKey: String,
      primaryKey: String,
      expand: {
        type: Boolean,
        default: false
      }
    },
    name: 'Table',
    components: {
      TableCell
    },
    data() {
      const d = {
        // rowData: JSON.parse(JSON.stringify(this.data)),
        rootClasses: classNames('table', this.rootClass),
        colspan: Object.keys(this.columns).length
      }
      // this.markRow(d.rowData)
      // console.log('1111', JSON.stringify(d.rowData))
      return d
    },
    computed: {
      rowData() {
        let index = 0
        return this.data.map((item) => {
          return {
            ...item,
            odd: !item.isExtendedRow ? ++index % 2 === 1 : undefined
          }
        })
      }
    },
    watch: {
      // data(newVal, oldVal) {
      //   this.rowData = JSON.parse(JSON.stringify(newVal))
      //   this.markRow(this.rowData)
      //   console.log('2222', JSON.stringify(this.rowData))
      // }
    },
    methods: {
      sort(key, sortType) {
        let nextType
        if (sortType) {
          if (sortType === 'up') {
            nextType = 'down'
          } else {
            nextType = 'up'
          }
        } else {
          nextType = 'up'
        }
        this.$emit('sort', {
          key,
          sortType: nextType
        })
      },
      markRow(rowData) {
        let index = 0
        rowData = rowData || this.rowData
        rowData.forEach((item) => {
          if (!item.isExtendedRow) {
            item.odd = ++index % 2 === 1
          } else {
            item.odd = undefined
          }
        })
      },
      headerStyle(params) {
        const style = {}
        if (params.width) {
          style.width = params.width + 'px'
        }
        return style
      },
      expandRow(rowIndex) {
        let rowdata = this.rowData[rowIndex]
        // console.log(rowdata)
        // console.log(rowdata[this.expandKey])
        rowdata.expand = !rowdata.expand
        if (rowdata.expand) {
          this.rowData.splice(rowIndex + 1, 0, {
            isExtendedRow: true,
            key: this.expandKey,
            value: JSON.stringify(rowdata[this.expandKey])
          })
        } else {
          this.rowData.splice(rowIndex + 1, 1)
        }
        this.markRow(this.rowData)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/css/common";
  table {
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    .table-expand-icon-th, .table-row-expand-icon-cell {
      width: 50px;
      min-width: 50px;
      text-align: center;
    }

    .table-row-expand-icon{
      border: 1px solid #e8e8e8;
      cursor: pointer;
    }
    .table-row-expand-icon-cell {
      align-items: center;
      justify-content: center;
      padding-top: 16px !important;
      padding-bottom: 16px !important;
      height: 100%;
    }
    .table-row-expand-cell{
      position: relative;
      &:before {
        position: absolute;
        left: 0;
        top: 0;
        content: ' ';
        width: 100%;
        height: 1px;
        background-color: rgba(232,232,232,1);
      }
    }
    > thead {
      th {
        text-align: left;
        white-space: nowrap;
        &:last-child {
          text-align: right;
          .header-title {
            justify-content: flex-end;
          }
        }
      }
    }
    > tbody{
      td {
        word-break: break-all;
        box-sizing: border-box;
        &:last-child {
          text-align: right;
        }
      }
    }
  }
  .table{
    margin-left: 20px;
    width: calc(100% - 40px);
    padding: 0 20px;
    background-color: #fff;
    font-size: 14px;
    line-height: 1;
  }
  .table td, .table th {
    border: 0;
    border-bottom: 1px;
    padding: 18px 20px;
    vertical-align: top;
  }
  .header {
    tr {
      border-bottom:1px solid rgba(30,30,30, 0.1);
    }
    .header-column {
      color: rgba(55, 65, 107, 1);
    }
    .sorts {
      display: flex;
      flex-direction: column;
      margin-left: rem(5);
      cursor: pointer;
      .sep {
        width: 100%;
        height: rem(2);
      }
      .down {
        transform: rotate(-180deg);
      }
    }
    .header-title {
      display: flex;
      align-items: center;
      flex-direction: row;
    }
  }
  .table-row{
    &.odd {
      background:rgba(0,0,0,0.02);
    }
    &.show-expand {
      border-bottom: 0;
    }
    border-bottom:1px solid rgba(30,30,30, 0.1);
    transition: background-color .3s;
    &:hover {
      background-color: rgba(30,30,30, 0.05);
    }
    /deep/ .table-column{
      color: rgba(55, 65, 107, 0.7);
      &.link {
        color: #4472DE;
      }
      a {
        color: #4472DE;
      }
    }
  }
  .text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
