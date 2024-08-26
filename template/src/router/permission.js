import router from '.'
import store from '../store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login','/loginBindPc', '/auth-redirect', '/bind', '/register']

//全局前置守卫
router.beforeEach((to, from, next) => {
  //进度条插件
  NProgress.start();

  //1.判断是否登录
  if (getToken()) {
    /* has token*/
    //1.1若登录页面直接跳转
    if (to.path === '/login') {
      next({ path: '/' })
      //进度条插件
      NProgress.done()
    } else {
      //1.2通过roles判断,若==0及登录操作或者切换部门操作;若!=0即普通路由跳转
      if (store.getters.roles.length === 0) {
        // 1.3调用store中的action重新获取用户信息,
        let getInfoPromise = store.dispatch('GetInfo');
        getInfoPromise.then(() => {
          //1.4当前用户部门信息
          store.dispatch('GetCurrentUserDeptList');
          //1.5 使用es6的new promise() .then()语法保证获取用户信息完成之后,再执行获取路由方法
          return store.dispatch('GenerateRoutes')
        }).then(accessRoutes => {
          // 根据roles权限生成可访问的路由表
          router.addRoutes(accessRoutes) // 动态添加可访问路由表
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
        })
        //异常回调
        getInfoPromise.catch(err => {
            store.dispatch('LogOut').then(() => {
              Message.error(err)
              next({ path: '/' })
            })
        })
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
