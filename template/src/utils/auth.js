import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

/**
 * 根据key获取对应token
 */
export function getToken() {
  return Cookies.get(TokenKey)
}

/**
 * 存储获取的token
 */
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

/**
 * 删除存储的token
 */
export function removeToken() {
  return Cookies.remove(TokenKey)
}