<template>
  <div>
    <!--baseform表单组件-->
    <base-form
      ref="queryForm"
      :form-attr="formAttr"
      :model="queryParams"
      :formData="queryParams"
      :inline="true"
      :label-width="labelWidth"
      v-show="showSearch"
      :searchForm="true"
      size="small"
      v-bind="_attrs"
      v-on="new$listeners"
      :form-item-width="formItemWidth"
      @keyupEnter="handleQuery"
    >
      <!--form后的按钮-->
      <template slot="formButtons" v-if="formButton && formButton.length > 0">
        <el-form-item class="formButtons" label-width="15px">
          <el-button
            v-for="(btn, idx) in formButton"
            :key="idx"
            style="margin-left: 20px"
            :type="btn.type"
            :icon="btn.icon"
            size="mini"
            @click="buttonFun(btn)"
            >\{{ btn.label }}</el-button
          >
        </el-form-item>
      </template>
    </base-form>
    <!--form下方的按钮-->
    <el-row :gutter="24" class="mb8">
      <el-col :span="6" v-if="tableButton && tableButton.length > 0">
        <el-button
          v-for="(btn, idx) in tableButton"
          :key="idx"
          :type="btn.type"
          :plain="true"
          :icon="btn.icon"
          size="mini"
          :disabled="typeof btn.disabled === 'undefined' ? false : btn.disabled"
          @click="buttonFun(btn)"
          v-hasPermi="btn.permission || []"
          >\{{ btn.label }}</el-button
        >
      </el-col>
      <!--右侧的按钮-->
      <el-col :span="2" style="float: right" v-if="rightToolbar">
        <div class="top-right-btn" style="margin-top: -5px; width: 70px">
          <el-row>
            <el-tooltip
              class="item"
              effect="dark"
              :content="showSearch ? '隐藏搜索' : '显示搜索'"
              placement="top"
            >
              <el-button
                size="mini"
                circle
                icon="el-icon-search"
                @click="toggleSearch()"
              />
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="刷新"
              placement="top"
            >
              <el-button
                size="mini"
                circle
                icon="el-icon-refresh"
                @click="refresh()"
              />
            </el-tooltip>
          </el-row>
        </div>
      </el-col>

      <!-- 列表文字描述信息 -->
      <el-col :span="16" style="text-align: right; float: right">
        <slot name="description"></slot>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/**
 * 带搜索样式的表单
 * 功能：
 *  1、继承了base-form的自定义表单属性，可以自定义表单内容
 *  2、支持显示的类型参见base-form.vue
 *  3、表单搜索、重置
 *  4、提供了表单左下方的操作按钮
 *  5、提供了表单右下方的文字描述插槽
 *  6、提供了表单右下方的隐藏搜索条件按钮及刷新按钮
 */
import BaseForm from '../Form/base-form.vue'
export default {
  components: { BaseForm },
  props: {
    // form表单字段
    formAttr: {
      default: () => []
    },
    // form绑定数据
    queryParams: {
      default: () => {}
    },
    // item宽度
    formItemWidth: {
      default: '20%'
    },
    // form按钮集合
    formButton: {
      default: () => []
    },
    // table按钮集合
    tableButton: {
      default: () => []
    },
    // label宽度
    labelWidth: {
      default: '80px'
    },
    // 是否显示右侧按钮工具
    rightToolbar: {
      default: false
    }
  },
  data() {
    return {
      // 显隐数据
      value: [],
      // 右侧按钮显示隐藏列（不用）
      columns: null,
      // 右侧显示隐藏搜索
      showSearch: true
    }
  },
  computed: {
    /**
     * 计算属性暴露表单原有props
     */
    _attrs() {
      let attrs = { ...this.$attrs }
      return attrs
    },
    /**
     * 使用new$listeners继承表格原有事件，并覆盖表格原有事件
     */
    new$listeners() {
      return Object.assign(this.$listeners, {
        // TODO：此处可声明并覆盖原有事件
      })
    }
  },
  created() {
    // 显隐列初始默认隐藏列
    for (let item in this.columns) {
      if (this.columns[item].visible === false) {
        this.value.push(parseInt(item))
      }
    }
  },
  methods: {
    /**
     * 控制搜索条件展示/隐藏
     */
    toggleSearch() {
      this.showSearch = !this.showSearch
    },
    /**
     * 回车键调用检索事件
     */
    handleQuery() {
      this.$emit('getList')
    },
    /**
     * 表格辅助工具调用检索事件
     */
    refresh() {
      this.$emit('queryTable')
    },
    /**
     * form按钮click事件绑定
     */
    buttonFun(button) {
      this.$emit(button.fun, button.options)
    },
    /**
     * 暴露实例,供父组件调用
     */
    getForm() {
      return this.$refs.queryForm
    }
  }
}
</script>

<style scoped>
::v-deep .el-dialog {
  width: 760px;
}

::v-deep .el-transfer {
  width: 760px;
}

::v-deep .el-transfer__button {
  border-radius: 50%;
  padding: 12px;
  display: block;
  margin-left: 0px;
}

::v-deep .el-transfer__button:first-child {
  margin-bottom: 10px;
}
</style>
