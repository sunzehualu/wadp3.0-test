import request from '../request'

// 查询缓存详细
export function getCache() {
  return request({
    url: '/system/monitor/cache',
    method: 'get'
  })
}