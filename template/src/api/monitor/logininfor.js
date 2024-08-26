import request from '../request'

// 模块使用量
export function usage() {
  return request({
    url: '/system/monitor/logininfor/usage',
    method: 'get'
  })
}
