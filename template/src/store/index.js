import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    //用户信息
    user,
    //导航栏(标签)
    tagsView,
    //路由
    permission,
    //布局设置
    settings,
  },
  getters,
})

export default store
