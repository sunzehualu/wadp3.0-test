import { constantRoutes } from '../../router'
import { getRoutersForBusinessWeb } from '../../api/framework/menu'
import Layout from '../../views/layout/index'
import ParentView from '../../components/ParentView';

const permission = {
  state: {
    //所有路由
    routes: [],
    //有权限的路由
    addRoutes: [],
    //默认路由
    defaultRoutes: [],
    //顶部导航菜单
    topbarRouters: [],
    //侧边连菜单
    sidebarRouters: []
  },
  mutations: {
    //设置路由
    SET_ROUTES: (state, routes) => {
      //有权限的路由
      state.addRoutes = routes
      //所有路由
      state.routes = constantRoutes.concat(routes)
    },
    // 设置默认路由
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes)
    },
    // 顶部导航菜单路由
    SET_TOPBAR_ROUTES: (state, routes) => {
      // 顶部导航菜单默认添加统计报表栏指向首页
      const index = [{
        path: 'index',
        meta: { title: '统计报表', icon: 'dashboard'}
      }]
      state.topbarRouters = routes.concat(index);
    },
    //侧边栏菜单项路由
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes
    },
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRoutersForBusinessWeb().then(res => {
          const sdata = JSON.parse(JSON.stringify(res.data))
          const rdata = JSON.parse(JSON.stringify(res.data))
          const sidebarRoutes = filterAsyncRouter(sdata)
          const rewriteRoutes = filterAsyncRouter(rdata, false, true)
          rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
          commit('SET_ROUTES', rewriteRoutes)
          commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(sidebarRoutes))
          commit('SET_DEFAULT_ROUTES', sidebarRoutes)
          commit('SET_TOPBAR_ROUTES', sidebarRoutes)
          resolve(rewriteRoutes)
        })
      })
    }
  }
}

/**
 * 遍历后台传来的路由字符串，转换为组件对象
 * @param {*} asyncRouterMap 后台返回的路由数据
 * @param {Boolean} lastRouter 是否侧边菜单栏
 * @param {Boolean} type 是否顶部菜单
 */ 
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      //过滤子路由
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else {
        route.component = loadView(route.component)
      }
    }
    //是否有子路由，若有，则递归
    if (route.children != null && route.children && route.children.length) {
      //递归过滤一部路由表，返回符合用户角色权限的路由表
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      //删除子路由
      delete route['children']
      //删除重定向
      delete route['redirect']
    }
    return true
  })
}

/**
 *过滤子路由
 * @param {*} asyncRouterMap 后台返回的路由数据
 * @param {Boolean} lastRouter 是否侧边菜单栏
 */
function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView') {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

export const loadView = (view) => { // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default permission
