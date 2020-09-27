const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: 'OASIS SCAN | Oasis Blockchain Explorer',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'OASIS SCAN provides an easy to use and popular block explorer, powerful data and advanced analytics. allows you to explore and search the OASIS blockchain for Entity, Block, Block hash, Txn hash, validator info. ' },
    ],
    script: [
      { src: 'https://www.googletagmanager.com/gtag/js?id=UA-6150405-8', body: true, async: true },
      {
        innerHTML: `console.log(1111);window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-6150405-8');`,
        type: 'text/javascript',
        charset: 'utf-8',
        body: true
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    __dangerouslyDisableSanitizers: ['script']
  },
  router: {
    middleware: 'i18n'
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    'iview/dist/styles/iview.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios.js',
    '@/plugins/iview',
    '~/plugins/i18n.js',
    { src: '~plugins/highchart.js' },
    '~/plugins/clipboard.js',
    '~/plugins/toast.js',
    '~/plugins/filters.js'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    // baseURL: 'http://172.18.11.63:3000',
    proxyHeaders: false,
    // retry: { retries: 3 }
    credentials: false,
    proxy: true
  },
  proxy: [
    'http://95.216.211.124:8181/chain/',
    'http://95.216.211.124:8181/validator/',
    'http://95.216.211.124:8181/dashboard/',
  ],
  /*
  ** Build configuration
  */
  build: {
    postcss: {
      plugins: {
        'postcss-px-to-viewport': {
          unitToConvert: 'md',
          viewportWidth: 750, // (Number) The width of the viewport.
          viewportHeight: 1334, // (Number) The height of the viewport.
          unitPrecision: 6, // (Number) The decimal numbers to allow the vw units to grow t
          viewportUnit: 'vw', // (String) Expected units.
          selectorBlackList: ['.ignore', '.hairlines'], // (Array) The selectors to ignore and leave as px.
          minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
          mediaQuery: true // (Boolean) Allow px to be converted in media queries.
        }
        // 'cssnano': {
        //   preset: 'advanced',
        //   autoprefixer: false,
        //   'postcss-zindex': false
        // }
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          // loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
