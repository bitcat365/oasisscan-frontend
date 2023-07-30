<template>
  <div class="kuai-con">
    <div :key="row" class="kuai-row" v-for="row in rows">
      <Tooltip v-for="column in columns" :key="`${row}-${column}`" :content="`Block ${item(row, column).height} `">
        <div class="kuai" :class="item(row, column).block ? 'yes': 'no'"></div>
      </Tooltip>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'kuai',
    props: ['list'],
    data() {
      return {
        columns: 25
      }
    },
    computed: {
      rows() {
        return Math.ceil(this.list.length / this.columns)
      }
    },
    methods: {
      item(row, column) {
        return this.list[(row - 1) * this.columns + column - 1]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .kuai {
    width: rem(18);
    height: rem(18);
    border-radius: rem(2);
    &.yes {
      background-color: $blue400;
    }
    &.no {
      border: 1px solid $blue400;
    }
  }
  .kuai-row {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: rem(0);
    &:first-child {
      margin-top: 0;
    }
  }
  .kuai-con {
    width: 100%;
  }
</style>
