<template>
  <div class="readonly-form">
    <el-descriptions ref="form" v-bind="_attrs" v-on="new$listeners">
      <!-- 循环显示表单字段 -->
      <template v-for="field in formAttr">
        <el-descriptions-item
          :key="field.prop"
          :label="field.label"
          :span="field.span ? field.span : '1'"
          v-if="typeof field.show === 'undefined' ? true : field.show"
        >
          <!-- 普通文本、日期、年度 -->
          <AutoTooltip
            v-if="
              ['text', 'date', 'textarea', 'autocomplete', 'year'].indexOf(
                field.type
              ) !== -1
            "
            :showTooltip="field.hoverTip ? field.hoverTip : 'never'"
            :content="
              formData[field.prop]
                ? String(formData[field.prop]) +
                  (typeof field.unit === 'undefined' ? '' : field.unit)
                : ''
            "
          />
          <!-- 日期范围 -->
          <div v-else-if="['dateRange'].indexOf(field.type) !== -1">
            \{{
              formData[field.prop] && formData[field.prop].length > 0
                ? formData[field.prop][0] +
                  (typeof field.rangeSeparator === 'undefined'
                    ? '/'
                    : field.rangeSeparator) +
                  formData[field.prop][1]
                : ''
            }}
          </div>
          <!-- 多选 -->
          <AutoTooltip
            v-else-if="
              ['moreSelect'].indexOf(field.type) !== -1 && formData[field.prop]
            "
            :hoverTip="field.hoverTip ? field.hoverTip : false"
            :content="selectDictLabels(field.options, formData[field.prop])"
          />
          <!-- 选项列表 - 展示时需根据选项和值进行数据转换 -->
          <AutoTooltip
            v-else-if="['select', 'tree-select'].indexOf(field.type) !== -1"
            :content="
              field.options
                ? selectDictLabel(field.options, formData[field.prop])
                : ''
            "
          />
          <!-- 文件下载链接 -->
          <a
            :href="formData[field.prop]"
            :download="field.label"
            v-else-if="['url'].indexOf(field.type) !== -1"
            style="color: #1890ff"
            >下载\{{ field.label }}</a
          >
          <!-- 根据字段是否存在，进行判断格式化显示 -->
          <div
            v-else-if="['formatNull'].indexOf(field.type) !== -1"
            class="oneRow"
            @click="clickInfo(field, formData[field.prop])"
          >
            \{{ formData[field.prop] ? field.trueLabel : field.falseLabel }}
          </div>
          <!-- 根据字段值是否为1，进行判断格式化显示 -->
          <div
            v-else-if="['formatCondition'].indexOf(field.type) !== -1"
            class="oneRow"
            :class="
              formData[field.prop] == field.condition
                ? field.colorFirst
                : field.colorSecond
            "
          >
            \{{
              formData[field.prop] == field.condition
                ? field.trueLabel
                : field.falseLabel
            }}
          </div>
          <!-- 文字按钮 -->
          <el-button
            v-if="['button'].indexOf(field.type) !== -1"
            :type="field.butType"
            :plain="field.plain ? field.plain : false"
            @click="butClick(field, formData)"
            :class="
              formData[field.condition] != undefined
                ? formData[field.condition]
                  ? field.colorFirst
                  : field.colorSecond
                : ''
            "
          >
            \{{ field.butText }}<i :class="field.icon"></i>
          </el-button>
        </el-descriptions-item>
      </template>
    </el-descriptions>
  </div>
</template>

<script>
/**
 * 全局只读 描述列表 组件
 * 功能：
 *   1、根据传入的表单项配置，展示对应的表单字段内容
 *   2、支持展示的字段类型（type）包括：普通文本、日期、年度（text, date, textarea,autocomplete, year）、
 *    日期范围（dateRange）、多选（moreSelect）、
 *    选项列表 - 展示时需根据选项和值进行数据转换（select, tree-select）、文件下载链接(url)、
 *    根据字段是否存在，进行判断格式化显示（formatNull）、根据字段值是否为1，进行判断格式化显示（formatCondition）、
 *    文字按钮（button）
 */
import AutoTooltip from '../../components/AutoTooltip'

export default {
  name: 'ReadonlyForm',
  components: { AutoTooltip },
  props: {
    // 表格字段
    formAttr: {
      type: Array,
      default: () => []
    },
    // 表单数据
    formData: {
      type: Object,
      default: () => {}
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
  methods: {
    /**
     * 普通点击事件
     * @param {Object} field 字段属性
     * @param {String} val 字段值
     */
    clickInfo(field, val) {
      if (field.click !== undefined) {
        this.$emit(field.click, val)
      }
    },
    /**
     * 按钮点击事件
     * @param {Object} field 字段属性
     * @param {Object} data 字段值
     */
    butClick(field, data) {
      if (field.click !== undefined) {
        this.$emit(field.click, data)
      }
    }
  }
}
</script>
<style scoped>
.readonly-form >>> .el-descriptions .is-bordered {
  table-layout: fixed;
}
.oneRow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.blueColor {
  color: #409eff;
}
.redColor {
  color: #ff404a;
}
.desSub {
  border: none;
  padding: 3px 3px 0 0;
  font-size: 15px;
  color: #409eff;
  border-bottom: 1px solid #409eff;
}

.desNosub {
  border: none;
  padding: 3px 3px 0 0;
  font-size: 15px;
  color: #ff404a;
  border-bottom: 1px solid #ff404a !important;
}
</style>
