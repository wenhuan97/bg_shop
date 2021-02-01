// 发布模式阶段 使用的插件
const prodPlugins = []
// 获取 编译模式 process.env.NODE_ENV
if (process.env.NODE_ENV === 'production') {
  // 处于 发布模式
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    ...prodPlugins
  ]
}
