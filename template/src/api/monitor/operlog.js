import request from '../request'

// 查询操作日志列表
export function list(query) {
  return request({
    url: '/system/monitor/operlog/list',
    method: 'get',
    params: query
  })
}