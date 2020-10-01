import Config from '../config'
export default function ({ isHMR, app, req, store, route, isServer, params, error, redirect, $axios, ...others }) {
  // If middleware is called from hot module replacement, ignore it
  if (isHMR) return
  if (process.server) {
    if (req.headers.host.indexOf('testnet.') >= 0) {
      store.commit('SET_NET', Config.testnetChainId)
    } else {
      store.commit('SET_NET', Config.chainId)
    }
  }
  // Set locale
  // store.commit('SET_LANG', locale)
}
