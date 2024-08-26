<template>
  <component :is="type" v-bind="linkProps(to)">
    <!-- slot 占位，可以自定义内容，如果什么都不写，那么父组件使用这个组件时内部写的东西无效 -->
    <slot />
  </component>
</template>

<script>
/**
 * 动态组件
 * 功能：
 *   区分是路由链接还是外部链接
 */
import { isExternal } from '../../../../utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    /**
     * 判断传过来的地址是不是一个外部链接
     */
    isExternal() {
      return isExternal(this.to)
    },
    /**
     * type的返回值对应到 组件的 is 属性，决定了它本质上是个什么标签
     */
    type() {
      // 外部链接，以 a 标签处理
      if (this.isExternal) {
        return 'a'
      }
      // 内部组件，进行路由
      return 'router-link'
    }
  },
  methods: {
    linkProps(to) {
      if (this.isExternal) {
        console.log(to)
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: to
      }
    }
  }
}
</script>
