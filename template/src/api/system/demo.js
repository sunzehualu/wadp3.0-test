import request from '../request'

// 查询测试信息列表
export function listDemo(query) {
  return request({
    url: '/demo/list',
    method: 'get',
    params: query
  })
}

// 查询测试信息详细
export function getDemo(testId) {
  return request({
    url: '/demo/' + testId,
    method: 'get'
  })
}

// 新增测试信息
export function addDemo(data) {
  return request({
    url: '/demo',
    method: 'post',
    data: data
  })
}

// 删除测试信息
export function delDemo(testId) {
  return request({
    url: '/demo/' + testId,
    method: 'delete'
  })
}