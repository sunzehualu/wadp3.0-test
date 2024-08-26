 /**
 * 操作权限处理，用于判断表格中的按钮是否显示，有权限则显示，无权限则在页面移除改元素
 * Copyright (c) 2022 hebdxjt
 */
 
import store from '../store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const all_permission = "*:*:*";
    const permissions = store.getters && store.getters.permissions

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      const hasPermissions = permissions.some(permission => {
        return all_permission === permission || permissionFlag.includes(permission)
      })

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  }
}
