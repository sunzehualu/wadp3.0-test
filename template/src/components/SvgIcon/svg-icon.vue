<template>
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$listeners" />
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconName" :fill="fill"/>
  </svg>
</template>
<script>
/**
 * svgIcon图标载入组件
 * 功能：
 *  1、提供了自定义svg图标的载入方法
 *  2、提供了外部svg图标载入方法
 */
import { isExternal } from '../../utils/validate'
export default {
  name: 'SvgIcon',
  props: {
    // 图标名称
    iconClass: {
      type: String,
      required: true
    },
    // 样式名称
    className: {
      type: String,
      default: ''
    },
    //颜色
    fill: {
      type: String,
      default: ''
    }
  },
  computed: {
    // 判断是否为外链
    isExternal() {
      return isExternal(this.iconClass)
    },
    // svg标签内use的href属性，图标名称
    iconName() {
      return this.iconClass
    },
    // svg标签的class属性，样式名称
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    // 外链图标样式
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover!important;
  display: inline-block;
}
</style>
