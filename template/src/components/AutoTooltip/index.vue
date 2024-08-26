<template>
  <el-tooltip
    class="item"
    v-bind="_attrs"
    :content="content"
    :disabled="hiddenTooltip"
    popper-class="auto-show-tooltip"
  >
    <!-- 文本内容部分-->
    <p
      :style="{
        width: width,
        top: top,
        '--row': row
      }"
      :class="{ line: row === 1, lines: row > 1, className }"
      style="line-height: inherit"
      @mouseover="onMouseOver(refName)"
    >
      <span :ref="refName">
        \{{ content || '' }}
      </span>
    </p>
  </el-tooltip>
</template>

<script>
/** 长文本自动省略并提供tooltip组件
 * 支持的功能:
 * 1.单行文本的按规定长度省略,
 * 2.多行文本的按规定行数省略,
 * 3.自定义整体文本样式
 * 4.自定义显示tooltip的情形*/
export default {
  name: 'AutoTooltip',
  props: {
    // 显示的文字内容
    content: {
      type: String,
      default: () => {
        return ''
      }
    },
    // 文本上方的距离
    top: {
      type: String,
      default: () => {
        return ''
      }
    },
    // 文本的长度限制
    width: {
      type: String,
      default: () => {
        return ''
      }
    },
    // 外层框的样式
    className: {
      type: String,
      default: () => {
        return ''
      }
    },
    //文本保留显示几行
    row: {
      type: Number,
      default: 1
    },
    //如何展示tooltip
    showTooltip: {
      type: String,
      default: 'auto'
    }
  },
  data() {
    return {
      //是否禁用tooltip
      hiddenTooltip: true,
      //实例名称
      refName:'textContent',
    }
  },
  computed: {
    /**
     * 计算属性暴露表格原有props
     */
    _attrs() {
      return { ...this.$attrs }
    }
  },
  methods: {
    //鼠标移入时,判断是否显示tooltip
    onMouseOver(refName) {
      let parentWidth = this.$refs[refName].parentNode.offsetWidth
      let contentWidth = this.$refs[refName].offsetWidth
      let parentHeight = this.$refs[refName].parentNode.offsetHeight
      let contentHeight = this.$refs[refName].offsetHeight
      // 判断是否开启tooltip功能,文本宽度或高度大于父节点且设置为auto或always时,开启tooltip
      switch (this.showTooltip) {
        case 'always':
          this.hiddenTooltip = false
          break
        case 'never':
          this.hiddenTooltip = true
          break
        case 'auto':
        default:
          this.hiddenTooltip =
            this.row === 1
              ? contentWidth <= parentWidth
              : contentHeight <= parentHeight
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.line {
  position: relative;
  margin: 0 !important;
  line-height: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.lines {
  display: -webkit-box;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: var(--row);
  -webkit-box-orient: vertical;
}
</style>
<style>
.auto-show-tooltip {
  max-width: 25vw;
  min-width: 200px;
}
</style>
