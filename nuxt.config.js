const productName = 'Team Timer'
const description = 'Team Timerはチームでタイマーを共有できるツールです。同じURLにアクセスするだけでタイマーを共有できます。リモートでグループワークをするときに便利です。もちろん一人でも使えます。'
const baseUrl = process.env.BASE_URL || 'http://localhost:3000'

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: productName,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: description },
      { hid: 'og:site_name', property: 'og:site_name', content: productName },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:title', property: 'og:title', content: productName },
      { hid: 'og:description', property: 'og:description', content: description },
      { hid: 'og:url', property: 'og:url', content: baseUrl },
      { hid: 'og:image', property: 'og:image', content: `${baseUrl}/ogp.png` },
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/css/destyle.css', // リセットCSS
    '@/assets/css/_spacing.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    'nuxt-clipboard2',
    ['nuxt-fontawesome', {
      component: 'fa'
    }]
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
