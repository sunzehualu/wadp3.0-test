const isProduction = process.env.NODE_ENV !== 'development'
if (isProduction) {
  module.exports = require('./vue.config.prod.js')
} else {
  module.exports = require('./vue.config.dev.js')
}