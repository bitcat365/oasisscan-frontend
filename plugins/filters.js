import Vue from 'vue'
import moment from 'moment'
import { floatFormat, hashFormat, intFormat } from '../utils'

Vue.filter('intFormat', (val) => {
  return intFormat(val)
})

Vue.filter('floatFormat', (val) => {
  return floatFormat(val)
})

Vue.filter('timeFormat', (val) => {
  if (typeof window !== 'object' || !window.location) { // 防止服务端的时区和客户端的时区不一样
    return ' '
  }
  return moment(val).format('YYYY-MM-DD HH:mm:ss')
})

Vue.filter('hashFormat', (val) => {
  return hashFormat(val)
})
