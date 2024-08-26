import request from '../request'

// 通用上传请求
export function upload(data) {
  return request({
    url: '/system/common/upload',
    method: 'post',
    data: data
  })
}
// 通用删除文件
export function deleteFile(fileIds) {
  return request({
    url: '/system/common/delete/'+fileIds,
    method: 'get'
  })
}
// 获取文件列表
export function getFileInfoList(fileIds) {
  return request({
    url: '/system/common/getFileInfoList/' + fileIds,
    method: 'get'
  })
}
// 预览文件
export function getFile(fileId) {
  return request({
    url: '/system/common/getFile/' + fileId,
    method: 'get',
    responseType: 'blob'
  })
}
// 预览文件
export function getFileStr(fileId) {
  return request({
    url: '/system/common/getFile/' + fileId,
    method: 'get',
  })
}

///////////////////////////////////////////////////////////////////////////////////获取配置的方法

// 根据参数键名查询参数值
export function getConfigKey(configKey) {
  return request({
    url: '/system/common/configKey/' + configKey,
    method: 'get'
  })
}
///////////////////////////////////////////////////////////////////////////////////获取字典的方法


// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/system/common/dict/type/' + dictType,
    method: 'get'
  })
}

///////////////////////////////////////////////////////////////////////////////获取部门的方法
// 查询部门列表
export function listDept(query) {
  return request({
    url: '/system/common/deptList',
    method: 'get',
    params: query
  })
}
// 获取系统所有部门
export function findAllDeptList() {
  return request({
    url: '/system/common/findAllDeptList',
    method: 'get'
  })
}
// 查询部门下拉树结构
export function deptTreeSelect(query = {}) {
  return request({
    url: '/system/common/deptTreeSelect',
    method: 'get',
    params: query
  })
}

// 获取组织机构和用户
export function getUserTree(query){
  return request({
    url: '/system/common/getUserTree',
    method: 'get',
    params: query
  })
}

// 根据条件查询用户数据
export function searchUser(key){
  return request({
    url: `/system/common/searchUserTree/${key}`,
    method: 'get'
  })
}

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/common/userList',
    method: 'get',
    params: query
  })
}
// 查询岗位列表
export function listPost(query) {
  return request({
    url: '/system/common/postList',
    method: 'get',
    params: query
  })
}
//////////////////////////////////////////////////////////////////////////////////获取菜单的方法


