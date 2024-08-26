import Cookies from 'js-cookie'

const state = {
  //侧边栏
  sidebar: {
    // 判断侧边导航栏的关闭和打开
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    // 判断是否显示动画的类名
    withoutAnimation: false
  },
  //设备类型
  device: 'desktop',
  //尺寸
  size: Cookies.get('size') || 'medium'
}

const mutations = {
  //切换侧边导航栏的开关
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      //如果打开，设置status=1
      Cookies.set('sidebarStatus', 1)
    } else {
      //如果关闭，设置status=0
      Cookies.set('sidebarStatus', 0)
    }
  },
  //关闭侧边导航栏
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  //设备类型
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  //设置主体按钮等组件大小
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  }
}

const actions = {
  //侧边栏
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  //关闭侧边栏
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  //设备类型
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  //大小尺寸
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
