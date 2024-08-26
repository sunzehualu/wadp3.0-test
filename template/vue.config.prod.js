/**
 * 官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/
 */
'use strict'
const path = require('path')
const defaultSettings = require('./src/config/settings.js')
const name = defaultSettings.title || '敏捷开发平台' // 标题

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  publicPath: '/wadp3.0-demo/',
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: 'dist',
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: 'static',
  // 是否开启eslint保存检测，有效值：ture | false | 'error'
  lintOnSave: true,
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
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

    config
      .plugin('ScriptExtHtmlWebpackPlugin')
      .after('html')
      .use('script-ext-html-webpack-plugin', [{
        inline: /runtime\..*\.js$/
      }])
      .end()
    config
      .optimization.splitChunks({
        // 选择哪些 chunk 进行优化
        chunks: 'all',
        // 缓存组
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            // only package third parties that are initially dependent
            chunks: 'initial'
          },
          elementUI: {
            // split elementUI into a single package
            name: 'chunk-elementUI',
            // the weight needs to be larger than libs and app or it will be packaged into libs or app
            priority: 20,
            // in order to adapt to cnpm
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/
          },
          commons: {
            name: 'chunk-commons',
            // can customize your rules
            test: resolve('src/components'),
            //  minimum common number
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
    // 将每个依赖包打包成单独的js文件
    config.optimization.runtimeChunk('single'),
    {
      //防爬虫文件
      from: path.resolve(__dirname, './public/robots.txt'),
      //到根目录下
      to: './'
    }
  }
}
