import { floatFormat, hashFormat, percent } from '../utils/index'
export async function fetchBlockInfo($axios) {
  const { code, data: blockInfo } = await $axios.$get('/validator/network').catch(() => ({ code: -1 }))
  if (code === 0) {
    return blockInfo
  }
  return {}
}
export async function fetchHomeBlockList($axios, pageSize, orderBy) {
  let { code, data: { list } } = await $axios.$get(`/validator/list?pageSize=${pageSize}&orderBy=${orderBy}`, {}).catch(() => ({ code: -1 }))
  if (code !== 0) {
    list = []
  }
  list = list.map((item, index) => {
    const name = item.name ? item.name : 'Validator'
    return {
      num: index + 1,
      ...item,
      name
    }
  })
  return { list }
}
export async function fetchBlockList($axios, entityId) {
  let { code, data: {signs, proposals} } = await $axios.$get(`/validator/stats?entityId=${encodeURIComponent(entityId)}`, {}).catch(() => ({ code: -1 }))
  if (code !== 0) {
    signs = []
    proposals = []
  }
  signs = signs.map((sign, index) => {
    return {
      num: index + 1,
      ...sign
    }
  })
  proposals = proposals.map((proposal, index) => {
    return {
      num: index + 1,
      ...proposal
    }
  })
  return { signs, proposals }
}

export async function fetchTransactionsList($axios, page = 1, page_size = 10) {
  let { code, data: list, query_num: total, total_num: totalRecordsCount } = await $axios.$get('/alief/transactions/list/info', {
    params: {
      page,
      page_size
    }
  }).catch(() => ({ code: -1 }))
  if (code !== 0) {
    list = []
  }
  const res = list.map((item) => {
    return {
      params: item.params,
      blockHeight: { text: item.block_num, link: `blocks/${item.block_num}`, type: 'link' },
      transactionId: { text: item.trx_id, link: `txs/${item.trx_id}`, type: 'link' },
      sender: item.signer && item.signer.length > 10 ? { text: item.signer, link: `accounts/${item.signer}`, type: 'link' } : item.signer,
      time: { value: item.timestamp, type: 'time' },
      type: `${item.ex_module}(${item.ex_function})`,
      status: { value: item.status, type: 'locale' }
    }
  })
  return { list: res, total, totalRecordsCount }
}

export async function fetchValidatorsList($axios) {
  let { code, data: { list } = {} } = await $axios.$get('/validator/list', {
    params: {}
  }).catch(() => ({ code: -1 }))
  if (code !== 0) {
    list = []
  }
  const res = list.map((item, index) => {
    return {
      ...item
    }
  })
  res.filter(item => item.active).forEach((item,index)=>{
    item.rank = index + 1;
  })
  res.filter(item => !item.active).forEach((item,index)=>{
    item.rank = index + 1;
  })
  res.forEach((item, index) => {
    const name = item.name ? item.name : 'Validator'
    item.name = { text: name, link: `validators/detail/${encodeURIComponent(item.entityId)}?rank=${item.rank}`, type: 'link' }
  })
  return { list: res }
}

export async function fetchBlockDetail($axios, hashOrBlockHeight) {
  let { code, info } = await $axios.$get('/alief/block/info', {
    params: {
      query_data: hashOrBlockHeight
    }
  })
  if (code !== 0) {
    info = {}
  }
  return {
    blockHeight: { text: info.block_num, link: `blocks/${info.block_num}`, type: 'link' },
    time: { value: info.timestamp, type: 'time' },
    parentHash: { text: info.parent_hash, link: `blocks/${info.parent_hash}`, type: 'link' },
    blockHash: { text: info.block_hash, link: `blocks/${info.block_hash}`, type: 'link' },
    rootHash: info.extrinsics_root,
    stateRoot: info.state_root,
    validator: { text: info.validator_name || info.validator_address, link: `validators/detail/${info.validator_address}`, type: 'link' }
  }
}

/**
 * 获取某一个块下的交易记录
 * @param $axios
 * @param blockHeight
 * @param page
 * @param pageSize
 * @param query_type
 * @returns {Promise<{total, list: *, totalRecordsCount}>}
 */
export async function fetchTransactionsOfBlock($axios, blockHeight, query_type = 'block_num', page = 1, pageSize = 10) {
  let { code, data: list, query_num: total, total_num: totalRecordsCount } = await $axios.$get('/alief/transactions', {
    params: {
      page,
      query_type,
      page_size: pageSize,
      query_data: blockHeight
    }
  })
  if (code !== 0) {
    list = []
  }
  const res = list.map((item) => {
    return {
      params: item.params,
      blockHeight: { text: item.block_num, link: `blocks/${item.block_num}`, type: 'link' },
      transactionId: { text: hashFormat(item.trx_id), link: `txs/${item.trx_id}`, type: 'link' },
      sender: item.signer && item.signer.length > 10 ? { text: item.signer, link: `accounts/${item.signer}`, type: 'link' } : item.signer,
      time: { value: item.timestamp, type: 'time' },
      type: `${item.ex_module}(${item.ex_function})`,
      status: { value: item.status, type: 'locale' }
    }
  })
  return { list: res, total, totalRecordsCount }
}

/**
 * 请求交易详情
 * @param $axios
 * @param txHash
 * @returns {Promise<void>}
 */
export async function fetchTransactionDetail($axios, txHash) {
  let { code, info } = await $axios.$get('/alief/transaction/info', {
    params: {
      query_data: txHash
    }
  })
  if (code !== 0) {
    info = {}
  }
  return {
    transactionHash: { text: info.trx_id, link: `txs/${info.trx_id}`, type: 'link' },
    blockHeight: info.block_num ? { text: info.block_num, link: `blocks/${info.block_num}`, type: 'link' } : undefined,
    params: JSON.stringify(info.params) ,
    sender:info.signer && info.signer.length > 10 ?  { text: info.signer, link: `accounts/${info.signer}`, type: 'link' } : info.signer,
    recipientAddress: info.params && info.params.to ? { text: info.params.to, link: `accounts/${info.params.to}`, type: 'link' } : '',
    time: { value: info.timestamp, type: 'time' },
    type: `${info.ex_module}(${info.ex_function})`
  }
}
export async function fetchValidatorDetail($axios, entityId) {
  let { code, data, ...others } = await $axios.$get(`/validator/info?entityId=${encodeURIComponent(entityId)}`, {
    params: {
    }
  })
  if (code !== 0) {
    console.log('others', others, code)
    return {
      entityId: '',
      name: '',
      icon: null,
      website: null,
      escrow: '',
      balance: '',
      totalShares: '',
      signs: 0,
      proposals: 0,
      nonce: 0,
      score: 0,
      nodes: [''],
      uptime: '',
      active: false
    }
  } else {
    console.log('data', data)
    return data
  }
}

export async function fetchAddressDetail($axios, address) {
  let { code, data } = await $axios.$get('/alief/address/info', {
    params: {
      address: address
    }
  })
  if (code !== 0) {
    data = {}
  }
  return {
    balance: data.balance
  }
}

export async function search($axios, str) {
  if (str.match(/^\d{1,15}$/)) {
    const info = await fetchBlockDetail($axios, str)
    if (info.blockHeight) {
      return { type: 'block', link: `/blocks/${str}` }
    } else {
      return { type: 'block', link: '' }
    }
  }
  if (str.match(/^5[a-zA-Z0-9]+/) && str.length === 48) {
    const info = await fetchAddressDetail($axios, str)
    if (typeof info.balance !== 'undefined') {
      return { type: 'accounts', link: `/accounts/${str}` }
    } else {
      return { type: 'accounts', link: '' }
    }
  }
  if (str.match(/^0x[0-9A-Fa-f]+$/)) {
    const data = await fetchTransactionDetail($axios, str)
    console.log('data', data)
    if (typeof data.blockHeight !== 'undefined') {
      return { type: 'transaction', link: `/txs/${str}` }
    }
    const block = await fetchBlockDetail($axios, str)
    console.log('block', block)
    if (block.blockHeight !== 'undefined') {
      return { type: 'block', link: `/blocks/${str}` }
    }
    return { type: 'hash', link: '' }
  }
  return { type: 'unknown' }
}
