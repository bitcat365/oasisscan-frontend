import Vue from 'vue'
import Toast from 'vue2-toast'
export default () => {
  Vue.use(Toast, {
    type: 'top',
    duration: 3000,
    wordWrap: true,
    width: 'auto'
  })
}
