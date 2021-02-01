module.exports = {
  // 发布模式
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('@/main-prod.js')

      //   通过externals加载外部CDN资源
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        echarts: 'echarts',
        lodash: '_',
        'vue-quill-editor': 'VueQuillEditor'
      })
      //   给html中添加自定义属性 isPord
      config.plugin('html').tap(args => {
        args[0].isPord = true
        return args
      })
    })

    //   开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('@/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isPord = false
        return args
      })
    })
  }
}
