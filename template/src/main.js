import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './style/element-variables.scss'

import "@/assets/theme.less"

import '@/style/index.scss' // global css
import '@/style/wadp.scss' // wadp css


import '@/assets/iconfont/iconfont.js'
import SvgIcon from '@/components/SvgIcon/svg-icon'// svg component

import App from './App'
import store from './store'
import router from './router'
import permission from './directive'

import './router/permission' // permission control
import { getConfigKey,getDicts } from "@/api/framework/common";
import { parseTime, resetForm, addDateRange, selectDictLabel, downloadByName, handleTree } from "@/utils/index";

// el-dialog可以拖动
import '@/utils/dialog-drag.js';
// 判断当前设备类型，目前用于抽屉
import { isMobile } from '@/utils/drawer-width-mobile';
//水印
import warterMark from '@/utils/warterMark.js';
import config from '../package.json'

// 全局方法挂载
Vue.prototype.wadpVersion=config.version
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.download = downloadByName
Vue.prototype.handleTree = handleTree
Vue.prototype.isMobile = isMobile
Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

// 全局组件挂载
Vue.component('warterMark',warterMark)
Vue.use(permission)
Vue.component('svg-icon', SvgIcon)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
if(isMobile()){
  Element.Drawer.props.size.default="100%"
}
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false
Vue.prototype.$isNotEmpty = function(obj){
  return (obj !== undefined && obj !== null && obj !== '' && obj !== 'null')
}
Vue.prototype.$deepCopy = function (obj){return JSON.parse(JSON.stringify(obj))}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
router.afterEach((item) =>{
  if(item.name !== 'login'&&item.name !== undefined&&store.state.settings.warterMark){
    warterMark.set(store.state.user.currentDeptName,store.state.user.nickName)
  }
})
