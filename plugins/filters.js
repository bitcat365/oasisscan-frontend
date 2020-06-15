import Vue from 'vue'
import moment from 'moment'
import { floatFormat, hashFormat, intFormat, percent } from '../utils'
moment.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: number => number + 's',
    ss: '%ds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years'
  }
})

Vue.filter('percentFormat', (val) => {
  return percent(val)
})

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
  // return moment(val).format('YYYY-MM-DD HH:mm:ss')
  return moment(val).fromNow()
})

Vue.filter('hashFormat', (val) => {
  return hashFormat(val)
})

Vue.filter('pretty', (value) => {
  return JSON.stringify(JSON.parse(value), null, 2);
})
