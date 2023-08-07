<template>
  <div v-if="type === 'simple'" :class="rootClasses">
    <div class="sim-btn-icon" @click="first">
      <SvgIcon className="svgIcon" iconName="left-double" />
    </div>
    <div class="sim-btn-icon" @click="previous">
      <SvgIcon className="svgIcon" iconName="left" />
    </div>
    <!-- <template v-if="total <= 5">
      <div :class="i === page ? 'sim-btn-num sim-btn-active' : 'sim-btn-num'" v-for="i in total">
        <span>{{ i }}</span>
      </div>
    </template> -->
    <template>
      <div :class="1 === page ? 'sim-btn-num sim-btn-active' : 'sim-btn-num'" @click="gotoPage(1)">
        <span>1</span>
      </div>
      <div class="sim-btn-omit" @click="omitLeft" v-show="continuousNumList[0] > 2">
        <span>...</span>
      </div>
      <div :class="i === page ? 'sim-btn-num sim-btn-active' : 'sim-btn-num'" v-for="i in continuousNumList" @click="gotoPage(i)">
        <span>{{ i }}</span>
      </div>
      <div class="sim-btn-omit" @click="omitRight" v-show="continuousNumList[continuousNumList.length - 1] < total - 1">
        <span>...</span>
      </div>
      <div :class="total === page ? 'sim-btn-num sim-btn-active' : 'sim-btn-num'" @click="gotoPage(total)">
        <span>{{ total }}</span>
      </div>
    </template>
    <div class="sim-btn-icon" @click="next">
      <SvgIcon className="svgIcon" iconName="right" />
    </div>
    <div class="sim-btn-icon" @click="last">
      <SvgIcon className="svgIcon" iconName="right-double" />
    </div>
  </div>
  <div v-else>
    待定
  </div>
</template>

<script>
import cls from 'classnames'

export default {
  name: 'Page',
  props: {
    type: String,
    rootClass: String,
    sizer: Number,
    page: Number,
    recordsCount: Number
  },
  data() {
    return {
      rootClasses: '',
      toPage: '',
      continuousNumList: [2, 3, 4, 5]
    }
  },
  computed: {
    toPageText() {
      const arr = []
      const text = this.$t('topage', { pageNumber: '$' })
      const inputIndex = text.indexOf('$')
      arr.push(text.substring(0, inputIndex))
      arr.push('$')
      arr.push(text.substring(inputIndex + 1, text.length))
      return arr
    },
    total() {
      return Math.ceil(this.recordsCount / this.sizer)
    },
    pages() {
      const pageArray = []
      const total = this.total
      const min = Math.max(this.page - 2, 1)
      const max = Math.min(this.page + 2, total)
      const dots = '...'
      for (let i = min; i <= max; i++) {
        pageArray.push(i)
      }
      if (min > 2) {
        pageArray.unshift(dots)
      }
      if (min > 1) {
        pageArray.unshift(1)
      }
      if (max < total - 1) {
        pageArray.push(dots)
      }
      if (max <= total - 1) {
        pageArray.push(total)
      }
      return pageArray
    }
  },
  watch: {
    page: {
      handler(val) {
        if (!this.continuousNumList.includes(val)) this.continuousNum()
      },
      immediate: true
    }
  },
  created() {
    this.rootClasses = cls('page-wrapper', this.rootClass)
  },
  methods: {
    first() {
      // console.log('ffff')
      this.$emit('goto', 1)
    },
    last() {
      this.$emit('goto', this.total)
    },
    previous() {
      if (this.page <= 1) {
        return
      }
      this.$emit('goto', this.page - 1)
    },
    next() {
      if (this.page >= this.total) {
        return
      }
      this.$emit('goto', this.page + 1)
    },
    to(e) {
      if (String(this.toPage).match(/^\d+$/)) {
        const pageNumber = parseInt(this.toPage)
        if (pageNumber > 0 && pageNumber <= this.total && pageNumber !== this.page) {
          this.$emit('goto', parseInt(this.toPage))
        }
      }
    },
    continuousNum() {
      switch (true) {
        case [1, 2, 3, 4, 5].includes(this.page):
          this.continuousNumList = [2, 3, 4, 5]
          break
        case [this.total - 4, this.total - 3, this.total - 2, this.total - 1, this.total].includes(this.page):
          this.continuousNumList = [this.total - 4, this.total - 3, this.total - 2, this.total - 1]
          break
        default:
          let arr = []
          let Q = Math.floor((this.page - this.continuousNumList[0]) / 4)
          // let R = (this.page - this.continuousNumList[0]) % 4
          for (var i = 0; i < this.continuousNumList.length; i++) {
            arr.push(this.continuousNumList[i] + 4 * Q)
          }
          this.continuousNumList = arr
          break
      }
    },
    gotoPage(i) {
      this.$emit('goto', i)
    },
    omitLeft() {
      switch (true) {
        case this.page === this.total:
          this.$emit('goto', this.total - 5)
          break
        default:
          if (this.page - 4 > 1) {
            this.$emit('goto', this.page - 4)
          } else {
            this.$emit('goto', 1)
          }
          break
      }
      this.continuousNum()
    },
    omitRight() {
      switch (true) {
        case this.page === 1:
          this.$emit('goto', 6)
          break
        default:
          if (this.page + 4 < this.total) {
            this.$emit('goto', this.page + 4)
          } else {
            this.$emit('goto', this.total)
          }
          break
      }
      this.continuousNum()
    }
  }
}
</script>
<style scoped lang="scss">
.svgIcon {
  width: rem(16);
  height: rem(16);
}
[class^='sim-btn'] {
  height: rem(32);
  border: 1px solid $gray200;
  border-radius: rem(8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: rem(2.5);
  color: $gray500;
}
.sim-btn-icon {
  width: rem(32);
}
.sim-btn-num {
  min-width: rem(32);
  padding: 0 rem(10);
}
.sim-btn-omit {
  width: rem(32);
  border: 0;
}
.sim-btn-active {
  color: #ffffff;
  background-color: #2f80ed;
}

.page-wrapper {
  display: flex;
  align-items: center;
}
</style>
