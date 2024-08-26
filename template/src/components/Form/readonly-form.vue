<template>
  <div class="readonly-form">
    <el-form ref="form" v-bind="_attrs" v-on="new$listeners" :inline="true">
      <!-- 循环显示表单字段 -->
      <template v-for="field in formAttr">
        <el-form-item
          :key="field.prop"
          :label="field.label + ':'"
          :prop="field.prop"
          :autocomplete="field.autocomplete"
          v-if="typeof field.show === 'undefined' ? true : field.show"
          class="inline"
          :style="{ width: field.width ? field.width : formItemWidth }"
        >
          <!-- 普通文本、日期 -->
          <AutoTooltip
            v-if="['text', 'date', 'textarea'].indexOf(field.type) !== -1"
            :content="formData[field.prop] ? String(formData[field.prop]) : ''"
          />
          <!-- 普通文本如果为空，指定一个值 -->
          <AutoTooltip
            v-if="['specifyANullValue'].indexOf(field.type) !== -1"
            :content="formData[field.prop] ? String(formData[field.prop]) : field.content"
          />
          <!-- 日期间隔 -->
          <div
            v-if="['dateInterval'].indexOf(field.type) !== -1"
          >
            \{{
              formData[field.prop] && formData[field.prop].length > 0
                ? formData[field.prop][0] + '至' + formData[field.prop][1]
                : '至'
            }}
          </div>
          <!-- 多选 -->
          <AutoTooltip
            v-else-if="
              ['moreSelect'].indexOf(field.type) !== -1 && formData[field.prop]
            "
            :content="selectDictLabels(field.options, formData[field.prop])"
          />
          <!-- 选项列表 - 展示时需根据选项和值进行数据转换 -->
          <AutoTooltip
            v-else-if="['select'].indexOf(field.type) !== -1"
            :content="selectDictLabel(field.options, formData[field.prop])"
          />
          <!-- 单张图片展示，可预览 -->
          <span v-else-if="['avatar-uploader'].indexOf(field.type) !== -1">
            <!-- 图片有数据时 -->
            <el-image
              v-if="field.url !== undefined && field.url !== null"
              style="width: 237px; height: 150px"
              :src="field.url"
              :preview-src-list="[field.url]"
            />
            <!-- 图片无数据时 -->
            <span v-else>未上传</span>
          </span>
          <!-- 单个文件展示，可预览 -->
          <span v-else-if="['file'].indexOf(field.type) !== -1">
            <!-- 文件有数据时 -->
            <el-button
              v-if="field.fileList.length > 0"
              size="mini"
              class="preview_button"
              @click="previewPdf(field)"
              >\{{ field.fileInfo }}</el-button
            >
            <!-- 图片无数据时 -->
            <span v-else>未上传</span>
          </span>
          <!-- 单个复选框展示 -->
          <el-checkbox
            v-else-if="['checkbox-single'].indexOf(field.type) !== -1"
            :true-label="1"
            :false-label="0"
            v-model="formData[field.prop]"
            disabled
          >
          </el-checkbox>
          <!-- 悬浮显示全部信息的展示 -->
          <AutoTooltip
            v-else-if="['select-showToolTip'].indexOf(field.type) !== -1"
            :content="typeFormat(field.options, formData[field.prop])"
          />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
/**
 * 全局只读表单组件
 * 功能：
 * 1、根据传入的表单项配置，展示对应的表单字段内容
 * 2、支持展示的字段类型（type）包括：普通文本、日期（text, date, textarea）、普通文本如果为空，指定一个值（specifyANullValue）、
 *    日期间隔(dateInterval)、多选（moreSelect）、
 *    选项列表 - 展示时需根据选项和值进行数据转换（select）、单张图片展示，可预览（avatar-uploader）、
 *    单个文件展示，可预览（file）、单个复选框展示（checkbox-single）、悬浮显示全部信息的展示（select-showToolTip）
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
    },
    // 表单字段宽度
    formItemWidth: {
      type: String,
      default: '100%'
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
     * 预览上传的文件
     */
    previewPdf(field) {
      window.open(field.fileList[0].url, '_blank')
    },
    /**
     * 字典翻译
     */
    typeFormat(options, string) {
      if (string && string !== '') {
        return this.selectDictLabels(options, string)
      }
    },
    /**
     * 金额格式化
     */
    formatMoney(value) {
      if (value) {
        return this.$math.divide(value, 10000)
      }
    },
  }
}
</script>

<style lang="less" scoped>
// 修改表单原有label样式
::v-deep label {
  font-weight: normal !important;
}

// 修改表单原有字段样式
::v-deep .el-form-item {
  margin-bottom: 0 !important;

  .el-form-item__content {
    color: #606266 !important;
    height: auto !important;
  }
}

::v-deep .preview_button {
  border: none;
  padding: 3px 13px 0 0;
  margin-left: -5px;
  font-size: 14px;
  color: #409eff;
}
</style>
