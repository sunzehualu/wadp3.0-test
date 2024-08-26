import request from '../request'

// 查询服务器详细
export function getServer() {
  return request({
    url: '/system/monitor/server',
    method: 'get'
  })
}