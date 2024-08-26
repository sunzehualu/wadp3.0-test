import variables from '@/style/element-variables.scss'
import defaultSettings from '../../config/settings'

const { sideTheme, showSettings, topNav, tagsView, fixedHeader, sidebarLogo,footerView,warterMark } = defaultSettings

const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''
const state = {
  //主题颜色
  theme: storageSetting.theme || variables.theme,
  // 侧边栏主题
  sideTheme: storageSetting.sideTheme || sideTheme,
  // 系统布局配置 
  showSettings: showSettings,
  //顶部导航
  topNav:  storageSetting.topNav === undefined ? topNav : storageSetting.topNav,
  // 标签页Tags-Views
  tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
  //固定Header
  fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
  //logo显示
  sidebarLogo: storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo,
  //脚注
  footerView: storageSetting.footerView === undefined ? footerView : storageSetting.footerView,
  //水印
  warterMark: storageSetting.warterMark === undefined ? warterMark : storageSetting.warterMark,
}

//系统布局配置
const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  // 改变系统布局配置
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

