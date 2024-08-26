import request from '../request'

// 获取路由
export const getRoutersForBusinessWeb = () => {
  return request({
    url: '/system/getRoutersForBusinessWeb',
    method: 'get'
  })
}