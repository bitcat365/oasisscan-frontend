<template>
  <div v-if="type === 'simple'" :class="rootClasses">
    <div class="sim-btn-icon" @click="first">
      <SvgIcon className="svgIcon" iconName="left-double" />
    </div>
    <div class="sim-btn-icon" @click="previous">
      <SvgIcon className="svgIcon" iconName="left" />
    </div>
    <!-- <span class="sim-text">Page {{ page }} of {{ total }}</span> -->
    <template v-if="total <= 5">
      <div class="sim-btn-num" v-for="i in total">
        <span>{{ i }}</span>
      </div>
    </template>
    <template v-else>
      <div class="sim-btn-num" v-for="i in 3">
        <span>{{ i }}</span>
      </div>
      <div class="sim-btn-omit">
        <span>...</span>
      </div>
      <div class="sim-btn-num">{{ total }}</div>
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
  props: {
    type: String,
    rootClass: String,
    sizer: Number,
    page: Number,
    recordsCount: Number
  },
  name: 'Page',
  data() {
    return {
      rootClasses: '',
      toPage: ''
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
  // TODO
  // color: $gray500;
  // background-color: #2F80ED;
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

.page-wrapper {
  display: flex;
  align-items: center;
}
</style>
