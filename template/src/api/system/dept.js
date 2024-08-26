import request from '../request'

//判断用户是否至少绑定一个任职部门
export function userDeptLegal(query) {
  return request({
    url: '/system/dept/userDeptLegal',
    method: 'get',
    params: query
  })
}