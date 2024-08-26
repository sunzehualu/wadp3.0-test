// ESlint 检查配置
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],

  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-config-vue
  rules: {
    // 组件名称驼峰命名：关闭
    "vue/multi-word-component-names": ["off"],
    "no-console": "error",
    "no-alert": "error",
    "no-debugger": "error",
    "no-mixed-spaces-and-tabs": [2, "smart-tabs"],
    // 禁止不必要的转义字符（正则表达式错误）
    "no-useless-escape": 0,
    // 允许在正则表达式中使用控制字符（正则表达式错误）
    'no-control-regex': 0,
    // 警告未使用的变量、方法、计算属性
    "vue/no-unused-properties": [
      "warn",
      {
        groups: ["props", "data", "methods", "computed"]
      }
    ]
  }
}
