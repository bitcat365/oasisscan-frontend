export const state = () => ({
  locales: ['en', 'zh'],
  locale: 'zh',
  net: '',
  headerConfig: {},
  menuOpen: true
})

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale
    }
  },
  SET_NET(state, net) {
    console.log('seted', net)
    state.net = net
  },
  SET_HEADER_CONFIG(state, config) {
    state.headerConfig = config
  },
  SET_MENU_OPEN(state, menuOpen) {
    state.menuOpen = menuOpen
  }
}
