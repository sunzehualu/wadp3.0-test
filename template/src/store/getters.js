const getters = {
  //侧边栏
  sidebar: state => state.app.sidebar,
  //尺寸
  size: state => state.app.size,
  //设备类型：值为mobile表示移动端, 为desktop表示桌面端
  device: state => state.app.device,
  //用户访问过的页面 导航栏tags数组
  visitedViews: state => state.tagsView.visitedViews,
  //缓存的导航栏tags数组
  cachedViews: state => state.tagsView.cachedViews,
  //登录的token
  token: state => state.user.token,
  //头像
  avatar: state => state.user.avatar,
  //用户账号
  name: state => state.user.name,
  //用户角色
  roles: state => state.user.roles,
  //用户权限
  permissions: (state) => state.user.permissions,
  //用户任职部门
  deptList: (state) => state.user.deptList,
  //所有的路由信息
  permission_routes: state => state.permission.routes,
  //顶部导航菜单路由
  topbarRouters:state => state.permission.topbarRouters,
  //默认路由
  defaultRoutes:state => state.permission.defaultRoutes,
  //侧边栏菜单项路由
  sidebarRouters:state => state.permission.sidebarRouters,
  //系统全部的部门
  allDeptList:(state) => state.user.allDeptList,
  // 企业微信登录绑定id
  openid:(state)=> state.user.openid
}

export default getters
