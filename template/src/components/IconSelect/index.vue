<template>
  <div class="icon-body">
    <el-input
      v-model="name"
      size="small"
      style="position: relative"
      clearable
      placeholder="请输入图标名称"
      @clear="filterIcons"
      @input.native="filterIcons"
    >
      <i slot="suffix" class="el-icon-search el-input__icon" />
    </el-input>
    <div class="icon-list">
      <div
        v-for="(item, index) in iconList"
        :key="index"
        @click="selectedIcon(item)"
      >
        <svg-icon
          :icon-class="item.symbolName"
          style="height: 30px; width: 16px"
        />
        <span>\{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 菜单图标
 * 功能：
 *   给菜单名称选择图标
 */
import iconList from '../../assets/iconfont/iconfont.json'

export default {
  name: 'IconSelect',
  data() {
    return {
      //选择按钮名
      name: '',
      //可选按钮列表
      iconList: []
    }
  },
  created() {
    iconList.glyphs.map(item => {
      item.symbolName = `#icon-wadp-${item.font_class}`
    })
    this.iconList = iconList.glyphs
  },
  methods: {
    /**
     * 搜索按钮
     */
    filterIcons() {
      this.iconList = iconList.glyphs
      if (this.name) {
        this.iconList = this.iconList.filter(item => item.includes(this.name))
      }
    },
    /**
     * 选中按钮
     * @param {*} name
     */
    selectedIcon(name) {
      this.$emit('selected', name)
      document.body.click()
    },
    /**
     * 重置
     */
    reset() {
      this.name = ''
      this.iconList = iconList.glyphs
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
  width: 95%;
  padding: 10px;
  .icon-list {
    height: 200px;
    overflow-y: scroll;
    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
    }
    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }

  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #fff;
    border-radius: 2px;
  }
  :hover::-webkit-scrollbar-thumb {
    background: #b4bccc;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #b4bccc;
  }
}
</style>
