<template>
  <td v-if="!$scopedSlots.default" class="table-column text-truncate" :class="rootclass">
    <span v-if="isRaw" v-html="data.value"></span>
    <span v-else-if="isLocale">{{data.value}}</span>
    <span v-else-if="isHash">{{data.value | hashFormat(data.sliceLength ? data.sliceLength : undefined) }}</span>
    <span v-else-if="isPercent">{{data.value | percentFormat }}</span>
    <a v-else-if="isHashLink" :href="data.link">
      {{data.text | hashFormat(data.sliceLength ? data.sliceLength : undefined) }}
    </a>
    <span v-else-if="isTime">{{data.value | timeFormat }}</span>
    <a v-else-if="isAnchor" :href="data.link">{{ data.text }}</a>
    <span v-else>{{data}}</span>
  </td>
  <td v-else class="table-column text-truncate" :class="rootclass">
    <slot v-bind:data="data"/>
  </td>
</template>

<script>
  export default {
    props: {
      data: [Object, String, Number, Boolean],
      rootClass: String
    },
    name: 'TableCell',
    data() {
      return {}
    },
    mounted() {
    },
    computed: {
      rootclass() {
        const classdata = {
          link: this.isAnchor
        }
        if (this.rootClass) {
          classdata[this.rootClass] = true
        }
        return classdata
      },
      isObject() {
        return typeof this.data === 'object' && !!this.data
      },
      isAnchor() {
        return this.isObject && this.data.type === 'link'
      },
      isTime() {
        return this.isObject && this.data.type === 'time'
      },
      isLocale() {
        return this.isObject && this.data.type === 'locale'
      },
      isHash() {
        return this.isObject && this.data.type === 'hash'
      },
      isHashLink() {
        return this.isObject && this.data.type === 'hash-link'
      },
      isRaw() {
        return this.isObject && this.data.type === 'raw'
      },
      isPercent() {
        return this.isObject && this.data.type === 'percent'
      }
    }
  }
</script>
<style scoped>

</style>
