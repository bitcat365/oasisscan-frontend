<template>
  <div :class="type == 'simple' ? 'simple-page-wrapper' : 'page-wrapper'" v-show="page > 0 && recordsCount > 0">
    <div v-if="type !== 'simple'" class="noSimple">
      <span>Show</span>&nbsp;
      <Dropdown trigger="click" @on-click="pageSize" class="select-page">
        <span>{{ sizer }}</span>
        &nbsp;
        <Icon type="ios-arrow-down"></Icon>
        <DropdownMenu slot="list">
          <DropdownItem v-for="item in elevatorList" :key="item" :name="item">{{ item }}</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      &nbsp;<span>Records</span>
    </div>
    <div class="simple">
      <div class="sim-btn-icon" @click="previous">
        <SvgIcon className="svgIcon" iconName="left" />
      </div>
      <div :class="1 === page ? 'sim-btn-num sim-btn-active' : 'sim-btn-num'" @click="gotoPage(1)">
        <span>1</span>
      </div>
      <div v-if="page > 5" class="sim-btn-omit" @click="omitLeft">
        <span class="omit-show">...</span>
      </div>
      <div v-if="page === 5" class="sim-btn-num" @click="gotoPage(page - 3)">
        <span>{{ page - 3 }}</span>
      </div>
      <div v-if="page - 2 > 1" class="sim-btn-num" @click="gotoPage(page - 2)">
        <span>{{ page - 2 }}</span>
      </div>
      <div v-if="page - 1 > 1" class="sim-btn-num" @click="gotoPage(page - 1)">
        <span>{{ page - 1 }}</span>
      </div>
      <div v-if="page != 1 && page != total" class="sim-btn-num sim-btn-active" @click="gotoPage(page)">
        <span>{{ page }}</span>
      </div>
      <div v-if="page + 1 < total" class="sim-btn-num" @click="gotoPage(page + 1)">
        <span>{{ page + 1 }}</span>
      </div>
      <div v-if="page + 2 < total" class="sim-btn-num" @click="gotoPage(page + 2)">
        <span>{{ page + 2 }}</span>
      </div>
      <div v-if="total - page === 4" class="sim-btn-num" @click="gotoPage(page + 3)">
        <span>{{ page + 3 }}</span>
      </div>
      <div v-if="total - page >= 5" class="sim-btn-omit" @click="omitRight">
        <span class="omit-show">...</span>
      </div>
      <div :class="total === page ? 'sim-btn-num sim-btn-active' : 'sim-btn-num'" @click="gotoPage(total)" v-show="total > 1">
        <span>{{ total }}</span>
      </div>
      <div class="sim-btn-icon" @click="next">
        <SvgIcon className="svgIcon" iconName="right" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page',
  props: {
    type: String,
    page: { type: Number, default: 1 },
    sizer: { type: Number, default: 20 },
    elevatorList: { type: Array, default: () => [ 20, 50, 100] },
    recordsCount: Number
  },
  data() {
    return {
      toPage: '',
      continuousNumList: [2, 3, 4, 5]
    }
  },
  computed: {
    total() {
      return Math.ceil(this.recordsCount / this.sizer)
    }
  },
  methods: {
    pageSize(name) {
      this.$emit('goto', this.page, name)
    },
    previous() {
      if (this.page <= 1) {
        return
      }
      this.$emit('goto', this.page - 1, this.sizer)
    },
    next() {
      if (this.page >= this.total) {
        return
      }
      this.$emit('goto', this.page + 1, this.sizer)
    },
    to(e) {
      if (String(this.toPage).match(/^\d+$/)) {
        const pageNumber = parseInt(this.toPage)
        if (pageNumber > 0 && pageNumber <= this.total && pageNumber !== this.page) {
          this.$emit('goto', parseInt(this.toPage), this.sizer)
        }
      }
    },
    gotoPage(i) {
      this.$emit('goto', i, this.sizer)
    },
    omitLeft() {
      switch (true) {
        case this.page === this.total:
          this.$emit('goto', this.total - 5, this.sizer)
          break
        default:
          if (this.page - 4 > 1) {
            this.$emit('goto', this.page - 4, this.sizer)
          } else {
            this.$emit('goto', 1, this.sizer)
          }
          break
      }
    },
    omitRight() {
      switch (true) {
        case this.page === 1:
          this.$emit('goto', 6, this.sizer)
          break
        default:
          if (this.page + 4 < this.total) {
            this.$emit('goto', this.page + 4, this.sizer)
          } else {
            this.$emit('goto', this.total, this.sizer)
          }
          break
      }
    }
  }
}
</script>
<style scoped lang="scss">
.page-wrapper {
  padding: rem(15) rem(10);
  font-size: rem(14);
  color: $gray500;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.simple-page-wrapper {
  padding: rem(15) rem(10);
  font-size: rem(14);
  color: $gray500;
  display: flex;
  justify-content: center;
}
.noSimple {
  .select-page {
    padding: rem(6) rem(12);
    border: 1px solid $gray200;
    border-radius: rem(6);
    color: $gray800;
    cursor: pointer;
  }
  /deep/.ivu-icon {
    color: $gray200;
  }
  /deep/.ivu-select-dropdown {
    width: rem(70);
    margin: rem(8) 0;
  }
  /deep/.ivu-dropdown-item {
    width: rem(66);
    font-size: rem(14) !important;
  }
}
.simple {
  display: flex;
  align-items: center;
  .svgIcon {
    width: rem(16);
    height: rem(16);
  }
  [class^='sim-btn'] {
    height: rem(32);
    border: 1px solid $gray200;
    border-radius: rem(8);
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin: rem(2.5);
  }
  [class^='sim-btn']:not(.sim-btn-active):hover{
    background-color: $gray200;
  }
  .sim-btn-icon {
    width: rem(32);
  }
  .sim-btn-num {
    min-width: rem(32);
    padding: 0 rem(10);
  }
  .sim-btn-active {
    color: #ffffff;
    background-color: #2f80ed;
  }
  .sim-btn-omit {
    width: rem(32);
  }
}
</style>
