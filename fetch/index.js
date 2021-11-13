import { floatFormat, hashFormat, percent } from '../utils/index'
import Config from '../config'
function request($axios, method, args) {
  /* eslint-disable no-undef */
  return $axios[`$${method}`](...args)
}

function get({ $axios, $store }) {
  return function (url, ...args) {
    // console.log('isTestnet', $store.state.net)
    if ($store.state.net === Config.testnetChainId) {
      url = '/testnet' + (url[0] === '/' ? '' : '/') + url
    } else {
      url = '/mainnet' + (url[0] === '/' ? '' : '/') + url
    }
    return request($axios, 'get', [url, ...args]).catch((e) => {
      return {
        error: e
      }
    })
  }
}
/* eslint-disable no-unused-vars */
function post(...args) {
  return request('post', args).catch((e) => {
    console.log('post error,', e)
    return {
      error: e
    }
  })
}

export async function fetchBlockInfo($config, progress = true) {
  const { code, data: blockInfo } = await get($config)('/dashboard/network',{ progress }).catch(() => ({ code: -1 }))
  if (code === 0) {
    return blockInfo
  }
  return {}
}
export async function fetchTxHistory($config) {
  const { code, data: { list } = { list: [] } } = await get($config)('/chain/transactionhistory').catch(() => ({ code: -1 }))
  if (code === 0) {
    return list
  }
  return []
}
export async function fetchHomeBlockList($config, pageSize = 10, page = 1, progress = true) {
  let { code, data: { list } = { list: [] } } = await get($config)(`/chain/blocks?size=${pageSize}&page=${page}`, { progress }).catch(() => ({ code: -1 }))
  if (code !== 0) {
    list = []
  }
  list = list.map((item, index) => {
    const name = item.name ? item.name : item.entityAddress
    return {
      ...item,
      proposer: { text: name, link: `/validators/detail/${item.entityAddress}`, type: item.name ? 'link' : 'hash-link' },
      timestamp: { value: item.timestamp * 1000, type: 'time' },
      height: { text: item.height, link: `/blocks/${item.height}`, type: 'link' },
    }
  });
  return { list }
}
export async function fetchBlockList($config, page = 1, size = 20, progress = true) {
  let { code, data: { list, totalSize } = { list: [] } } = await get($config)(`/chain/blocks`, {
    params: {
      page,
      size
    },
    progress
  }).catch(() => ({ code: -1 }))
  list = list.map((item, index) => {
    const name = item.name ? item.name : item.entityAddress
    return {
      ...item,
      hash: { text: item.hash, link: `/blocks/${item.height}`, sliceLength: 12, type: 'hash-link' },
      timestamp: { value: item.timestamp * 1000, type: 'time' },
      proposer: { text: name, link: `/validators/detail/${item.entityAddress}`, type: item.name ? 'link' : 'hash-link' },
      height: { text: item.height, link: `/blocks/${item.height}`, type: 'link' }
    }
  });
  return { list, totalSize }
}
export async function fetchChainMethods($config) {
  let { code, data: { list } = { list: [] } } = await get($config)('/chain/methods', {
    progress: false,
    params: {
    }
  }).catch(() => ({ code: -1 }))
  if (code !== 0) {
    list = []
  }
  return { list }
}
export async function fetchAccountDetail($config, address) {
  let { code, data = { } } = await get($config)(`/chain/account/info/${address}`, {
  }).catch(() => ({ code: -1 }))
  data.address = { address: data.address, total: data.total }
  return data
}
export async function fetchAccountDelegations($config, address, page = 1, size = 5) {
  let { code, data: { list, totalSize } = { list: [] } } = await get($config)(`/chain/account/delegations`, {
    params: {
      address,
      page,
      size,
      all: true
    }
  }).catch(() => ({ code: -1 }))
  if (code !== 0) {
    list = []
  }
  const res = list.map((item) => {
    const name = item.validatorName ? item.validatorName : (item.validatorAddress ? item.validatorAddress : item.entityAddress)
    let link
    if (item.validatorAddress) {
      link = `/validators/detail/${item.validatorAddress}`
    } else if (item.entityAddress) {
      link = `/accounts/detail/${item.entityAddress}`
    }
    return {
      ...item,
      validatorName: link ? { text: name, link, type: item.validatorName ? 'link' : 'hash-link' } : name,
    }
  })
  return { list: res, totalSize }
}
export async function fetchAccountDebonding($config, address, page = 1, size = 5) {
  let { code, data: { list, totalSize } = { list: [] } } = await get($config)(`/chain/account/debonding`, {
    params: {
      address,
      page,
      size
    }
  }).catch(() => ({ code: -1 }))
  if (code !== 0) {
    list = []
  }
  const res = list.map((item) => {
    const name = item.validatorName ? item.validatorName : item.validatorAddress
    return {
      ...item,
      validatorName: { text: name, link: `/validators/detail/${item.validatorAddress}`, type: item.validatorName ? 'link' : 'hash-link' },
    }
  })
  return { list: res, totalSize }
}
export async function fetchAccountsList($config, page = 1, size = 10) {
  let { code, data: { list, totalSize } = { list: [] } } = await get($config)('/chain/account/list', {
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
      address: { text: item.address, link: `/accounts/detail/${item.address}`, type: 'link', total: item.total },
      id: item.address
    }
  })
  return { list: res, totalSize }
}

export async function fetchTransactionsList($config, page = 1, size = 10, method = '', progress = true, sliceLength = 8) {
  let { code, data: { list, totalSize } = { list: [] } } = await get($config)('/chain/transactions', {
    params: {
      page,
      size,
      method
    },
    progress
  }).catch(() => ({ code: -1 }))
  if (code !== 0) {
    list = []
  }
  const res = list.map((item) => {
    return {
      ...item,
      hash: { text: item.hash, link: `/blocks/${item.height}`, type: 'hash-link' },
      height: { text: item.height, link: `/blocks/${item.height}`, type: 'link' },
      txHash: { text: item.txHash, link: `/transactions/${item.txHash}`, type: 'hash-link', sliceLength },
      timestamp: { value: item.timestamp * 1000, type: 'time' },
      type: `${item.method}`
    }
  })
  return { list: res, totalSize }
}

export async function fetchValidatorsList($config, orderBy = '', sort = 'desc') {
  let orderParams = {}
  if (orderBy) {
    orderParams.orderBy = orderBy;
    orderParams.sort = sort;
  }
  let { code, data: { list, active, inactive, delegators } = {} } = await get($config)('/validator/list', {
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
      escrow: { escrow: item.escrow, escrowPercent: item.escrowPercent },
      commission: { value: item.commission, type: 'percent' },
    }
  })
  res.forEach((item, index) => {
    const name = item.name ? item.name : item.entityAddress
    item.name = { text: name, icon: item.icon, link: `validators/detail/${encodeURIComponent(item.entityAddress)}`, type: item.name ? 'link' : 'hash-link' }
  })
  return { list: res, active, inactive, delegators }
}

export async function fetchBlockDetail($config, hashOrBlockHeight) {
  let { code, data } = await get($config)(`/chain/block/${hashOrBlockHeight}`, {
    params: {
    }
  })
  if (code !== 0 || !data) {
    data = {}
  }
  const name = data.name ? data.name : data.entityAddress
  return {
    height: data.height,
    epoch: data.epoch,
    hash: data.hash,
    txs: data.txs,
    proposer: { text: name, link: `/validators/detail/${data.entityAddress}`, type: 'link' },
    timestamp: { value: data.timestamp * 1000, type: 'time' },
  }
}

/**
 * 搜索
 * @param key
 * @returns {Promise<void>}
 */
export async function search($config, key) {
  let { code, data} = await get($config)('/chain/search', {
    params: {
      key
    },
    progress: false
  })
  return data
}

/**
 * 获取某一个块下的交易记录
 * @param $config
 * @param blockHeight
 * @param page
 * @param pageSize
 * @param address
 * @param query_type
 * @returns {Promise<{total, list: *, totalRecordsCount}>}
 */
export async function fetchTransactions($config, blockHeight = '', address = '', page = 1, pageSize = 10) {
  let { code, data: { list, totalSize } = { list: [] } } = await get($config)('chain/transactions', {
    params: {
      page,
      size: pageSize,
      height: blockHeight,
      address
    }
  });
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
  });
  return { list: res, totalSize }
}

/**
 * 请求交易详情
 * @param $config
 * @param txHash
 * @returns {Promise<void>}
 */
export async function fetchTransactionDetail($config, txHash) {
  let { code, data } = await get($config)(`/chain/transaction/${txHash}`, {
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
    from: { text: data.from, link: `/accounts/detail/${data.from}`, type: 'link' },
    to: { text: data.to, link: `/accounts/detail/${data.to}`, type: 'link' },
    amount: data.amount,
    raw: data.raw,
    status: { status: !!data.status, error: data.errorMessage ? data.errorMessage : '' },
    timestamp: data.timestamp,
    height: { text: data.height, link: `/blocks/${data.height}`, type: 'link' },
    fee: data.fee,
    nonce: data.nonce,
  }
}

export async function getEventsByProposer($config, address, size = 5, page = 1) {
  let { code, data: { list, totalSize } = { list: [] } } = await get($config)(`/chain/powerevent`, {
    params: {
      address: address,
      page,
      size
    }
  });
  return {
    list: list.map((item) => {
      return {
        ...item,
        height: { text: item.height, link: `/blocks/${item.height}`, type: 'link' },
        txHash: { text: item.txHash, link: `/transactions/${item.txHash}`, type: 'hash-link' },
        timestamp: { value: item.timestamp * 1000, type: 'time' },
        amountAndShares: { value: `${item.amount}/${item.shares}`, add: item.add }
      }
    }),
    totalSize
  }
}

export async function validatorStats($config, address) {
  let { code, data: { signs, proposals } = { signs: [], proposals: [] } } = await get($config)(`/validator/stats`, {
    params: {
      address
    },
    progress: false
  })
  return {
    signs, proposals
  }
}
export async function getDelegatorsByProposer($config, address, size = 5, page = 1) {
  let { code, data: { list, totalSize } = { list: [] } } = await get($config)(`/validator/delegators`, {
    params: {
      address,
      page,
      size
    }
  });
  return {
    list: list.map((item) => {
      return {
        ...item,
        address: { text: item.address, type: 'hash-link', link: `/accounts/detail/${item.address}` },
        percent: { value: item.percent, type: 'percent' },
        amountAndShares: `${item.amount}/${item.shares}`
      }
    }),
    totalSize
  }
}

export async function getBlockByProposer($config, address, size = 5, page = 1) {
  let { code, data: { list, totalSize } = { list: [] } } = await get($config)(`/chain/getBlockByProposer`, {
    params: {
      address,
      page,
      size
    }
  });
  console.log('totalSize', totalSize)
  return {
    list: list.map((item) => {
      return {
        ...item,
        height: { text: item.height, link: `/blocks/${item.height}`, type: 'link' },
        hash: { text: item.hash, link: `/blocks/${item.height}`, type: 'hash-link', sliceLength: 12 },
        timestamp: { value: item.timestamp * 1000, type: 'time' },
        type: `${item.method}`
      }
    }),
    totalSize
  }
}

/**
 * 验证人trend统计
 * @param $config
 * @param address
 * @returns {Promise<void>}
 */
export async function fetchEscrowTrendByAddress($config, address) {
  let { code, data: { list } = { list: [] } } = await get($config)(`/validator/escrowstats`, {
    params: {
      address
    }
  })
  if (code !== 0) {
    return {
      list: []
    }
  } else {
    return {
      list
    }
  }
}
export async function fetchValidatorDetail($config, address) {
  let { code, data, ...others } = await get($config)(`/validator/info`, {
    params: {
      address
    }
  })
  if (code !== 0) {
    console.log('others', others, data)
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
export async function onSearch(vue, text) {
  const searchText = text.trim()
  vue.$Spin.show()
  try {
    const res = await search({ $store: vue.$store, $axios: vue.$axios }, searchText)
    if (res) {
      switch (res.type) {
        case 'validator':
          vue.$router.push(`/validators/detail/${res.result}`)
          break
        case 'transaction':
          vue.$router.push(`/transactions/${res.result}`)
          break
        case 'account':
          vue.$router.push(`/accounts/detail/${res.result}`)
          break
        case 'block':
          vue.$router.push(`/blocks/${res.result}`)
          break
        case 'runtime-transaction':
          const [runtimeId, txHash] = res.result.split('_')
          vue.$router.push(`/paratimes/transactions/${txHash}?runtime=${runtimeId}`)
          break
        default:
          vue.$Spin.hide()
          vue.$router.push(`/not_found`)
          break
      }
    }
  } catch (e) {
    vue.$Spin.hide()
    vue.$router.push(`/not_found`)
  }
  setTimeout(() => {
    vue.$Spin.hide()
  }, 1000)
}

export async function fetchRuntimeList($config) {
  const { code, data: { list } = { list: [] } } = await get($config)('/runtime/list', {
    params: {},
    progress: false
  }).catch(() => ({ code: -1 }))
  return list
}

export async function fetchRoundList($config, runtimeId, page = 1, size = 5) {
  let { code, data: { list, totalSize } = {} } = await get($config)('/runtime/round/list', {
    params: {
      id: runtimeId,
      size,
      page,
    },
    progress: false
  }).catch(() => ({ code: -1 }))
  if (code !== 0) {
    list = []
  }
  const res = list.map((item, index) => {
    return {
      ...item,
      state_root: { value: item.state_root, type: 'hash' },
      io_root: { value: item.io_root, type: 'hash' },
      round: { text: item.round, link: `/paratimes/round/${item.round}?runtime=${runtimeId}`, type: 'link' },
      timestamp: { value: item.timestamp * 1000, type: 'time' },
    }
  })
  return { list: res, totalSize }
}

export async function fetchRoundDetail($config, runtimeId, roundId) {
  let { code, data = {} } = await get($config)('/runtime/round/info', {
    params: {
      id: runtimeId,
      round: roundId,
    }
  }).catch(() => ({ code: -1 }))
  if (code !== 0) {
    data = {}
  }
  return data
}

export async function fetchRuntimeTxDetail($config, runtimeId, txHash) {
  let { code, data = {} } = await get($config)('/runtime/transaction/info', {
    params: {
      id: runtimeId,
      hash: txHash,
    }
  }).catch(() => ({ code: -1 }))
  if (code !== 0) {
    data = {}
  }
  data.round = { text: data.round, link: `/paratimes/round/${data.round}?runtime=${runtimeId}`, type: 'link' }
  return data
}

export async function fetchRuntimeNodeList($config, runtimeId, page = 1, size = 5, sortKey = 0) {
  let { code, data: { list, totalSize } = {} } = await get($config)('/runtime/stats', {
    params: {
      id: runtimeId,
      size,
      page,
      sort: sortKey
    },
    progress: false
  }).catch(() => ({ code: -1 }))
  if (code !== 0) {
    list = []
  }
  const res = list.map((item, index) => {
    const name = item.name ? item.name : item.address
    return {
      entityId: { text: name, link: `/validators/detail/${item.address}`, type: item.name ? 'link' : 'hash-link' },
      ...item.stats,
    }
  })
  return { list: res, totalSize }
}

export async function fetchRuntimeTxList($config, runtimeId, page = 1, size = 5) {
  let { code, data: { list, totalSize } = {} } = await get($config)('/runtime/transaction/list', {
    params: {
      id: runtimeId,
      size,
      page,
    },
    progress: false
  }).catch(() => ({ code: -1 }))
  if (code !== 0) {
    list = []
  }
  const res = list.map((item, index) => {
    return {
      ...item,
      txHash: { text: item.txHash, link: `/paratimes/transactions/${item.txHash}?runtime=${runtimeId}`, type: 'hash-link', sliceLength: 12 },
      timestamp: { value: item.timestamp * 1000, type: 'time' },
    }
  })
  return { list: res, totalSize }
}
