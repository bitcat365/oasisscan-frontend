<template>
  <td v-if="!$scopedSlots.default" class="table-column text-truncate" :class="rootclass">
    <span v-if="isRaw" v-html="data.value"></span>
    <span v-else-if="isLocale">{{$t(data.value)}}</span>
    <span v-else-if="isHash">{{data.value | hashFormat }}</span>
    <span v-else-if="isTime">{{data.value | timeFormat }}</span>
    <router-link v-else-if="isAnchor" :to="$i18n.path(data.link)">{{ data.text }}</router-link>
    <span v-else>{{data}}</span>
  </td>
  <td v-else class="table-column text-truncate" :class="rootclass">
    <slot v-bind:data="data"/>
  </td>
</template>

<script>
  export default {
    props: {
      data: [Object, String, Number],
      rootClass: String
    },
    name: 'TableCell',
    data() {
      return {}
    },
    mounted() {
      if (String(this.data).indexOf('%') >= 0) {
        console.log('$slots.default', this.$scopedSlots)
      }
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
      isRaw() {
        return this.isObject && this.data.type === 'raw'
      }
    }
  }
</script>
<style scoped>

</style>
