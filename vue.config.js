const path = require('path')
module.exports = {
  productionSourceMap: false,
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    port: 9092,
  },
  configureWebpack: {
    resolve: {
      alias: {
        src: path.resolve(__dirname, 'src'),
        '@root': path.resolve(__dirname, '.')
      }
    }
  },
  chainWebpack: config => {
    // if (process.env.NODE_ENV === 'development') {
    //   config.module
    //     .rule('vue')
    //     .use('vue-loader')
    //       .loader('vue-loader')
    //       .tap(options => {
    //         options.prettify = false
    //         return options
    //       })
    // }
  }
}
