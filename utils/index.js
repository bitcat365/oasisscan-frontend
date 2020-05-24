import moment from 'moment'
export function percent(a, b) {
  if (b === 0) {
    return '0.00%'
  }
  return (100 * a / b).toFixed(2) + '%'
}
export function convertTime(list) {
  list.forEach((item) => {
    item.time = moment(item.time).format('YYYY-MM-DD HH:mm:ss')
  })
  return list
}
export function hashFormat(val) {
  if (!val) {
    return ''
  }
  return val.substr(0, 12) + '...' + val.substr(-12)
}
export function intFormat(val) {
  if (!val) {
    return '0'
  }
  return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function floatFormat(val) {
  if (!val) {
    return '0.00'
  }
  const nums = String(val).split('.')
  const leftNumber = nums[0]
  const rightNumber = parseFloat(nums[1]) || 0
  const leftStr = String(leftNumber).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  if (rightNumber === 0) {
    return leftStr + '.00'
  } else {
    return leftStr + '.' + nums[1]
  }
}
