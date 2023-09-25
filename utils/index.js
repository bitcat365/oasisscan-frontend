import moment from 'moment'
import BN from 'bignumber.js'
export function percent(a, b) {
  if (b === 0) {
    return '0.00%'
  }
  return (100 * a / b).toFixed(2) + '%'
}
export function readable(val) {
  if (parseFloat(val) === 0) {
    return val
  }
  let valStr = String(val)
  const nums = valStr.split(/[,.]/)
  if (nums.length > 2) {
    return val
  }
  if (valStr.match(/[,.]\d$/)) {
    valStr += '0'
  }
  const leftNumber = nums[0]
  const rightNumber = nums[1] ? valStr.match(/[,.]/)[0] + nums[1] : ''
  const numStr = parseFloat(leftNumber).toLocaleString() + rightNumber
  return numStr
}
export function convertTime(list) {
  list.forEach((item) => {
    item.time = moment(item.time).format('YYYY-MM-DD HH:mm:ss')
  })
  return list
}
export function hashFormat(val, length = 8) {
  if (!val) {
    return ''
  }
  return val.slice(0, length) + '...' + val.slice(-length)
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

export function decimalsFormat(val, length = 4) {
  // console.log('val', val, typeof val);
  if (!val || val === '0') {
    return '0.00'
  }
  const with2Decimals = val.toString().match(new RegExp('^-?\\d+(?:\\.\\d{0,' + length + '})?'))[0]
  // if (with2Decimals.match(/\.\d{2}0+$/)) {
  //   return with2Decimals.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
  // }
  return parseFloat(with2Decimals).toFixed(length)
}

export function decimalConvert(val) {
  return decimalsFormat(new BN(val).dividedBy(1e9).toString())
}

export function getMonth(month) {
  const map = [
    `Jan`,
    `Feb`,
    `Mar`,
    `Apr`,
    `May`,
    `Jun`,
    `Jul`,
    `Aug`,
    `Sep`,
    `Oct`,
    `Nov`,
    `Dec`
  ]
  return map[month]
}
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
