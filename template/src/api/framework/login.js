import request from '../request'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/system/login',
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/system/getInfo',
    method: 'get'
  })
}
// 获取用户的所有任职部门
export function getCurrentUserDeptList() {
  return request({
    url: '/system/getCurrentUserDeptList',
    method: 'get'
  })
}
// 切换当前用户的部门
export function changeDept(deptId) {
  return request({
    url: '/system/changeDept',
    method: 'get',
    params: {'deptId':deptId}
  })
}
// 退出方法
export function logout() {
  return request({
    url: '/system/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCode() {
  return request({
    url: '/code',
    method: 'get'
  })
}


// 企业微信扫码登录页面
export function wxLogin(code) {
  return request({
    url: '/system/wxLogin?code='+code,
    method: 'get'
  })
}

// 企业微信登录绑定
export function wxBindLogin(username, password, openid) {
  const data = {
    username,
    password,
    openid
  }
  return request({
    url: '/system/wxBindLogin',
    method: 'post',
    data: data
  })
}
