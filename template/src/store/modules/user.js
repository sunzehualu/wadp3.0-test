import { login, logout, getInfo,changeDept, getCurrentUserDeptList } from '../../api/framework/login'
import { getToken, setToken, removeToken } from '../../utils/auth'
import { findAllDeptList } from "../../api/framework/common";

const user = {
  //定义属性
  state: {
    // 企业微信登录绑定id
    openid:'',
    //获取的token
    token: getToken(),
    //用户姓名
    nickName: '',
    //用户账号
    name: '',
    //用户id
    userId:'',
    //用户头像
    avatar: '',
    //用户任职部门名称
    currentDeptName:"",
    //用户角色
    roles: [],
    //用户权限
    permissions: [],
    //用户所在部门
    deptList:[],
    //系统全部的部门
    allDeptList: [], 
  },
  //更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
  mutations: {
    // 企业微信登录绑定id
    SET_OPENID: (state, openid) => {
      state.openid = openid
    },
    // 获取的token
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    //用户姓名
    SET_NICK_NAME: (state, nickName) => {
      state.nickName = nickName
    },
    //用户账号
    SET_NAME: (state, name) => {
      state.name = name
    },
    //用户id
    SET_USER_ID: (state, id) => {
      state.userId = id
    },
    //用户头像
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    //用户角色
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    //用户权限
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    //用户所在部门
    SET_DEPTLIST:(state,deptList)=>{
      state.deptList =deptList;
    },
    //用户任职部门名称
    SET_CURRENTDEPTNAME: (state, deptName) => {
      state.currentDeptName = deptName;
    },
    //系统全部的部门
    SET_ALLDEPTLIST: (state, allDeptList) => {
      state.allDeptList = allDeptList;
    },
  },
  //Action 通过 store.dispatch 方法触发：
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      // 使用es6的new promise() .then()语法保证获取用户信息完成之后,再执行其他方法
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          if(res !== undefined){
            const user = res.user
            //没有自定义头像，则使用默认头像(id为1)
            const avatar = user.avatar == "" ? '1': user.avatar; 
            if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
              commit('SET_ROLES', res.roles)
              commit("SET_CURRENTDEPTNAME", user.deptName);
              commit('SET_PERMISSIONS', res.permissions)
            } else {
              commit('SET_ROLES', ['ROLE_DEFAULT'])
            }
            commit('SET_NICK_NAME', user.nickName)
            commit('SET_NAME', user.userName)
            commit('SET_USER_ID', user.userId)
            commit('SET_AVATAR', avatar)
            //加载所有单位到内存中
            findAllDeptList().then((res) => {
              commit("SET_ALLDEPTLIST", res.data);
            });
            resolve(res)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户的所有任职部门
    GetCurrentUserDeptList({ commit, state }) {
      // 使用es6的new promise() .then()语法保证获取用户信息完成之后,再执行其他方法
      return new Promise((resolve, reject) => {
        getCurrentUserDeptList().then(res => {
          const deptList = res.data
          if (deptList && deptList.length > 0) {
            commit('SET_DEPTLIST', deptList)
          }
          resolve();
        }).catch(error => {
          reject(error)
        })
      })
    },

    // todo 切换部门调用的方法
    //1.调用后端方法切换部门(实际是切换角色组)2.只需要置空commit('SET_ROLES', []) 3. 刷新页面/index 4.//全局前置守卫router.beforeEach中会重新加载用户信息
    ChangeDept({commit},deptId){
      return new Promise((resolve, reject) => {
        changeDept(deptId).then(res => {
          commit('SET_ROLES', [])
          resolve();
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_DEPTLIST', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
