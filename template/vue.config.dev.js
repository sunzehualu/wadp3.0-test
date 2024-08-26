/**
 * 官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/
 */
'use strict'
const path = require('path')
const defaultSettings = require('./src/config/settings.js')
const name = defaultSettings.title || '敏捷开发平台' // 标题
const port = process.env.port || process.env.npm_config_port || 80 // 端口

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  publicPath: '/wadp3.0-demo/',
  // 是否开启eslint保存检测，有效值：ture | false | 'error'
  lintOnSave: true,
  // webpack-dev-server 相关配置
  devServer: {
    host: '0.0.0.0',
    port: port,
    open: true,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: `http://192.168.7.249:8888/wadp3.0-prod-api`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ""
        }
      }
    },
    // 关闭用于 DNS 重绑定的 HTTP 请求的 HOST 检查，DevServer 默认只接受来自本地的请求，关闭后可以接受来自任何 HOST 的请求
    disableHostCheck: true
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    devtool: "source map"
  },
  chainWebpack(config) {
    // 移除 preload(预载) 插件
    config.plugins.delete('preload')
    // 移除 prefetch(预取) 插件
    config.plugins.delete('prefetch')
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    // 将icons图片以雪碧图的形式加载
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
