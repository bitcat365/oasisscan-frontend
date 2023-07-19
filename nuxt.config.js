const pkg = require('./package')
// resolve定义一个绝对路径获取函数
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

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
      { hid: 'description', name: 'description', content: 'OASIS SCAN provides an easy to use and popular block explorer, powerful data and advanced analytics. allows you to explore and search the OASIS blockchain for Entity, Block, Block hash, Txn hash, validator info. ' }
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
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    __dangerouslyDisableSanitizers: ['script']
  },
  router: {
    middleware: ['config', 'i18n']
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: ['iview/dist/styles/iview.css', '~/assets/css/main.css'],
  /*
   ** Global SCSS
   */
  styleResources: {
    scss: ['~assets/css/common.scss', '~assets/css/color.scss']
  },

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/axios.js', '@/plugins/iview', '~/plugins/i18n.js', '~/plugins/my-mixin.js', { src: '~plugins/highchart.js' }, '~/plugins/clipboard.js', '~/plugins/toast.js', '~/plugins/filters.js', '~/plugins/svg-icon.js'],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources'
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
  proxy: ['https://api.oasisscan.com/testnet/', 'https://api.oasisscan.com/mainnet/'],
  // proxy: {
  //   '/testnet/': { target: 'http://127.0.0.1:9181', pathRewrite: { '^/testnet/': '' } },
  //   '/mainnet/': { target: 'http://127.0.0.1:8181', pathRewrite: { '^/mainnet/': '' } }
  // },
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
      // 排除 nuxt 原配置的影响,Nuxt 默认有vue-loader,会处理svg,img等
      // 找到匹配.svg的规则,然后将存放svg文件的目录排除
      const svgRule = config.module.rules.find(rule => rule.test.test('.svg'))
      svgRule.exclude = [resolve('./assets/svg')]
      // 添加loader规则
      config.module.rules.push({
        test: /\.svg$/, // 匹配.svg
        include: [resolve('./assets/svg')], // 将存放svg的目录加入到loader处理目录
        use: [{ loader: 'svg-sprite-loader', options: { symbolId: 'icon-[name]' } }]
      })
    }
  }
}
