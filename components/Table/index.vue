<template>
  <div class="table_content">
    <table :class="[rootClasses, loading || !(rowData && rowData.length > 0) ? 'table-loader' : '']">
      <thead class="header">
        <tr>
          <th v-if="expand" class="table-expand-icon-th"></th>
          <th v-for="item in columns" :key="item.key" class="header-column" :class="cellClass" :style="headerStyle(item)">
            <div :class="[item.sortable || item.iconName ? 'header-title' : '', item.textAlign ? 'text-' + item.textAlign : 'text-left']">
              <div>
                <slot v-if="item.titleSlot" :name="item.titleSlot" v-bind:data="item.titleSlot"></slot>
                <div v-else v-for="ti in item.title.split('\n')" :key="ti">
                  {{ ti }}
                </div>
              </div>
              <div v-if="item.iconName" :class="item.iconName">
                <SvgIcon className="svgIcon" :iconName="item.iconName" />
              </div>
              <div v-if="item.sortable" class="sorts" @click="sort(typeof item.sortKey !== 'undefined' ? item.sortKey : item.key, item.sortType)">
                <img v-if="item.sortType === 'up' && !item.singleSortDirection" class="up" :data-type="item.sortType === 'up'" src="../../assets/arrow-light.svg" />
                <img v-else-if="!item.singleSortDirection" class="up" :data-type="item.sortType === 'up'" src="../../assets/arrow.svg" />
                <div class="sep"></div>
                <img v-if="item.sortType === 'down'" :data-type="item.sortType === 'down'" class="down" src="../../assets/arrow-light.svg" />
                <img v-else class="down" :data-type="item.sortType === 'down'" src="../../assets/arrow.svg" />
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <NoRecord v-if="!(rowData && rowData.length > 0) && !loading" class="norecord" />
      <tbody v-else>
        <tr
          v-for="(row, rowIndex) in rowData"
          :key="primaryKey ? row[primaryKey] : 'row' + rowIndex"
          :class="['table-row', rowData[rowIndex + 1] && rowData[rowIndex + 1].isExtendedRow ? 'show-expand' : '', row.isExtendedRow ? 'extended-row' : 'main-row', row.odd === true || (row.isExtendedRow && rowData[rowIndex - 1].odd) ? 'odd' : '']"
        >
          <td v-if="expand" :class="['table-row-expand-icon-cell']" @click="expandRow(rowIndex)">
            <Icon v-if="!row.isExtendedRow" class="table-row-expand-icon" :type="!row.expand ? 'ios-add' : 'ios-remove'" />
          </td>
          <td v-if="row.isExtendedRow" class="table-row-expand-cell" :colspan="colspan">{{ $t(row.key) }}&nbsp;:&nbsp;{{ row.value }}</td>
          <table-cell v-else v-for="(columnItem, columnIndex) in columns" :class="columnItem.textAlign ? 'text-' + columnItem.textAlign : 'text-left'" :key="`column${rowIndex}-${columnIndex}`" :data="row[columnItem.key]" :root-class="cellClass">
            <template v-if="columnItem.slot" v-slot:default="slotProps">
              <slot :name="columnItem.key" v-bind:data="slotProps.data"></slot>
            </template>
          </table-cell>
        </tr>
        <Loader :loading="loading"></Loader>
      </tbody>
    </table>
  </div>
</template>
<script>
import classNames from 'classnames'
import TableCell from './TableCell'
import NoRecord from '../NoRecord.vue'
import Loader from '../Loader.vue'
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
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  name: 'Table',
  components: {
    TableCell,
    NoRecord,
    Loader
  },
  data() {
    const d = {
      rootClasses: classNames('table', this.rootClass),
      colspan: Object.keys(this.columns).length
    }
    return {
      ...d
    }
  },
  computed: {
    rowData() {
      return this.data.map((item, index) => {
        let odd = !item.isExtendedRow ? ++index % 2 === 1 : undefined
        Object.assign(item, { odd: odd })
        return { ...item }
      })
    }
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
      rowData.forEach(item => {
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
        style.width = params.width
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
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}
.text-left {
  text-align: left;
}
.table_content {
  height: 100%;
}
table {
  &.table-loader {
    min-height: rem(240);
  }
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  .table-expand-icon-th,
  .table-row-expand-icon-cell {
    width: 50px;
    min-width: 50px;
    text-align: center;
  }

  .table-row-expand-icon {
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
  .table-row-expand-cell {
    position: relative;
    &:before {
      position: absolute;
      left: 0;
      top: 0;
      content: ' ';
      width: 100%;
      height: 1px;
      background-color: rgba(232, 232, 232, 1);
    }
  }
  > thead {
    th {
      height: rem(60);
      text-align: left;
      white-space: nowrap;
    }
  }
  > tbody {
    position: relative;
    td {
      height: rem(60);
      word-break: break-all;
      box-sizing: border-box;
    }
  }
}
.table {
  width: 100%;
}
.table td,
.table th {
  border: 0;
  border-bottom: 1px;
  padding: 18px 20px;
}
.header {
  tr {
    border-bottom: 1px solid $gray100;
  }
  .header-column {
    font-size: rem(14);
    font-weight: 600;
    color: $gray500;
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
    flex-direction: row;
    align-items: center;
  }
}
.table-row {
  font-size: rem(14);
  &.odd {
    background: $gray25;
  }
  &.show-expand {
    border-bottom: 0;
  }
  border-bottom: 1px solid $gray100;
  transition: background-color 0.3s;
  &:hover {
    background-color: $gray100;
  }
  /deep/ .table-column {
    color: $gray500;
    &.link {
      color: $blue500;
    }
    a {
      color: $blue500;
    }
  }
}
/deep/.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/deep/.text-truncate:has(.colourDiv) {
  overflow: visible;
  text-overflow: clip;
}
.svgIcon {
  width: rem(24);
  height: rem(24);
  vertical-align: -4px;
}
</style>
