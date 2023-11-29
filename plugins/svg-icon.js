// plugins/svgIcon.js
import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon.vue' // Nuxt 默认@指向根目录

// 注册组件
Vue.component('SvgIcon', SvgIcon)
// 预请求svg组件(通过之前的svg-sprite-loader加载)
const req = require.context('@/assets/svg', false, /\.svg$/)
req.keys().map(req)
