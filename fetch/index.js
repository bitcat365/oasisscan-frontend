import { floatFormat, hashFormat, percent } from '../utils/index'
export async function fetchBlockInfo($axios) {
  const { code, data: blockInfo } = await $axios.$get('/dashboard/network').catch(() => ({ code: -1 }))
  if (code === 0) {
    return blockInfo
  }
  return {}
}
export async function fetchTxHistory($axios) {
  const { code, data: { list } = { list: [] } } = await $axios.$get('/chain/transactionhistory').catch(() => ({ code: -1 }))
  if (code === 0) {
    return list
  }
  return []
}
export async function fetchHomeBlockList($axios, pageSize = 10, page = 1) {
  let { code, data: { list } = { list: [] } } = await $axios.$get(`/chain/blocks?size=${pageSize}&page=${page}`, {}).catch(() => ({ code: -1 }))
  if (code !== 0) {
    list = []
  }
  list = list.map((item, index) => {
    return {
      ...item,
      proposer: { value: item.proposer, type: 'hash' },
      timestamp: { value: item.timestamp * 1000, type: 'time' },
      height: { text: item.height, link: `blocks/${item.height}`, type: 'link' },
    }
  });
  return { list }
}
export async function fetchBlockList($axios, page = 1, size = 20) {
  let { code, data: { list, totalSize } = { list: [] } } = await $axios.$get(`/chain/blocks`, {
    params: {
      page,
      size
    }
  }).catch(() => ({ code: -1 }))
  list = list.map((item, index) => {
    return {
      ...item,
      hash: { value: item.hash, type: 'hash' },
      timestamp: { value: item.timestamp * 1000, type: 'time' },
      // proposer: { text: item.proposer, link: `validators/detail/${item.proposer}`, type: 'link' },
      height: { text: item.height, link: `blocks/${item.height}`, type: 'link' },
    }
  });
  return { list, totalSize }
}

export async function fetchTransactionsList($axios, page = 1, size = 10) {
  let { code, data: { list, totalSize } = { list: [] } } = await $axios.$get('/chain/transactions', {
    params: {
      page,
      size
    }
  }).catch(() => ({ code: -1 }))
  if (code !== 0) {
    list = []
  }
  const res = list.map((item) => {
    return {
      ...item,
      height: { text: item.height, link: `/blocks/${item.height}`, type: 'link' },
      txHash: { text: item.txHash, link: `/transactions/${item.txHash}`, type: 'hash-link' },
      timestamp: { value: item.timestamp * 1000, type: 'time' },
      type: `${item.method}`
    }
  })
  return { list: res, totalSize }
}

export async function fetchValidatorsList($axios, orderBy = '', sort = 'desc') {
  let orderParams = {}
  if (orderBy) {
    orderParams.orderBy = orderBy;
    orderParams.sort = sort;
  }
  let { code, data: { list, active, inactive, delegators } = {} } = await $axios.$get('/validator/list', {
    params: {
      ...orderParams
    }
  }).catch(() => ({ code: -1 }))
  if (code !== 0) {
    list = []
  }
  const res = list.map((item, index) => {
    return {
      ...item,
      commission: { value: item.commission, type: 'percent' },
    }
  })
  res.forEach((item, index) => {
    const name = item.name ? item.name : 'Validator'
    item.name = { text: name, link: `validators/detail/${encodeURIComponent(item.entityId)}`, type: 'link' }
  })
  return { list: res, active, inactive, delegators }
}

export async function fetchBlockDetail($axios, hashOrBlockHeight) {
  let { code, data } = await $axios.$get(`/chain/block/${hashOrBlockHeight}`, {
    params: {
    }
  });
  if (code !== 0) {
    data = {}
  }
  return {
    height: data.height,
    epoch: data.epoch,
    hash: data.hash,
    txs: data.txs,
    proposer: data.proposer,
    timestamp: { value: data.timestamp * 1000, type: 'time' },
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
export async function fetchTransactionsOfBlock($axios, blockHeight, page = 1, pageSize = 10) {
  let { code, data: { list, totalSize } = { list: [] } } = await $axios.$get('chain/transactions', {
    params: {
      page,
      size: pageSize,
      height: blockHeight
    }
  });
  if (code !== 0) {
    list = []
  }
  const res = list.map((item) => {
    return {
      ...item,
      height: { text: item.height, link: `blocks/${item.height}`, type: 'link' },
      txHash: { text: item.txHash, link: `transactions/${item.txHash}`, type: 'hash-link' },
      timestamp: { value: item.timestamp * 1000, type: 'time' },
      type: `${item.method}`
    }
  });
  return { list: res, totalSize }
}

/**
 * 请求交易详情
 * @param $axios
 * @param txHash
 * @returns {Promise<void>}
 */
export async function fetchTransactionDetail($axios, txHash) {
  let { code, data } = await $axios.$get(`/chain/transaction/${txHash}`, {
    params: {
    }
  })
  if (code !== 0) {
    data = {}
  }
  console.log('data', data)
  return {
    txHash: data.txHash,
    method: data.method,
    from: data.from,
    to: data.to,
    raw: data.raw,
    timestamp: data.timestamp,
    height: { text: data.height, link: `/blocks/${data.height}`, type: 'link' },
    fee: data.fee,
    nonce: data.nonce
  }
}

export async function getEventsByProposer($axios, entityId, size = 5, page = 1) {
  let { code, data: { list, totalSize } = { list: [] } } = await $axios.$get(`/chain/powerevent`, {
    params: {
      address: entityId,
      page,
      size
    }
  });
  return {
    list: list.map((item) => {
      return {
        ...item,
        height: { text: item.height, link: `blocks/${item.height}`, type: 'link' },
        txHash: { text: item.txHash, link: `transactions/${item.txHash}`, type: 'hash-link' },
        timestamp: { value: item.timestamp * 1000, type: 'time' },
        amountAndShares: `${item.amount}/${item.shares}`
      }
    }),
    totalSize
  }
}

export async function getDelegatorsByProposer($axios, entityId, size = 5, page = 1) {
  let { code, data: { list, totalSize } = { list: [] } } = await $axios.$get(`/validator/delegators`, {
    params: {
      validator: entityId,
      page,
      size
    }
  });
  return {
    list: list.map((item) => {
      return {
        ...item,
        entityId: { value: item.entityId, type: 'hash' },
        percent: { value: item.percent, type: 'percent' },
        amountAndShares: `${item.amount}/${item.shares}`
      }
    }),
    totalSize
  }
}

export async function getBlockByProposer($axios, entityId, size = 5, page = 1) {
  let { code, data: { list, totalSize } = { list: [] } } = await $axios.$get(`/chain/getBlockByProposer`, {
    params: {
      proposer: entityId,
      page,
      size
    }
  });
  console.log('totalSize', totalSize)
  return {
    list: list.map((item) => {
      return {
        ...item,
        height: { text: item.height, link: `blocks/${item.height}`, type: 'link' },
        hash: { value: item.hash, type: 'hash' },
        timestamp: { value: item.timestamp * 1000, type: 'time' },
        type: `${item.method}`
      }
    }),
    totalSize
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
  let { code, data: { list } = { list: [] } } = await $axios.$get('/alief/address/info', {
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
