<template>
  <div class="base-form">
    <el-form ref="form" v-bind="_attrs" v-on="new$listeners" :model="formData">
      <!-- 循环显示表单字段 -->
      <template v-for="field in formAttr">
        <!-- inline表示以行内形式展示表单， 一行有多个字段；表单字段宽度 -->
        <el-form-item
          :key="field.prop"
          :label="field.label"
          :prop="field.prop"
          :rules="field.rules"
          :autocomplete="field.autocomplete"
          v-if="typeof field.show === 'undefined' ? true : field.show"
          :class="{ inline: inline }"
          :style="{ width: field.width ? field.width : formItemWidth }"
          :label-width="field.labelWidth ? field.labelWidth : ''"
        >
          <!-- 分割线 -->
          <el-divider v-if="field.type === 'line'"></el-divider>
          <!-- 标题 -->
          <div
            v-if="field.type === 'title'"
            :style="{ 'font-size': field.fontSize ? field.fontSize : '14px' }"
          >
            \{{ field.prop }}<br />
          </div>
          <!-- 普通文本 -->
          <el-input
            v-if="field.type === 'text'"
            v-model="formData[field.prop]"
            :placeholder="
              field.placeholder ? field.placeholder : '请输入' + field.label
            "
            :maxlength="field.maxlength"
            :class="field.icon !== undefined ? 'input-prefix' : ''"
            :clearable="
              typeof field.clearable === 'undefined' ? false : field.clearable
            "
            :disabled="
              typeof field.disabled === 'undefined' ? false : field.disabled
            "
            :readonly="
              typeof field.readonly === 'undefined' ? false : field.readonly
            "
            @input="handleChange(field, formData[field.prop])"
            @click.native="clickInput(field)"
          >
            <i
              v-if="field.icon !== undefined"
              slot="prefix"
              style="padding: 10px"
            >
              <svg-icon :iconClass="field.icon" />
            </i>
            <template slot="append" v-if="field.unit !== undefined">\{{
              field.unit
            }}</template>
          </el-input>
          <!-- 密码框 -->
          <el-input
            type="password"
            v-else-if="field.type === 'password'"
            v-model="formData[field.prop]"
            :placeholder="
              field.placeholder ? field.placeholder : '请输入' + field.label
            "
            :disabled="
              typeof field.disabled === 'undefined' ? false : field.disabled
            "
          />
          <!-- switch开关按钮 -->
          <el-switch
            v-else-if="field.type === 'switch'"
            v-model="formData[field.prop]"
            active-color="#13ce66"
            :disabled="
              typeof field.disabled === 'undefined' ? false : field.disabled
            "
          >
          </el-switch>
          <!-- 单选radio -->
          <el-radio-group
            v-else-if="field.type === 'radio'"
            v-model="formData[field.prop]"
            @input="value => changeInput(field, value)"
            :disabled="
              typeof field.disabled === 'undefined' ? false : field.disabled
            "
          >
            <el-radio
              v-for="dict in field.options"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >\{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
          <!-- checkbox多选框 -->
          <el-checkbox-group
            v-else-if="field.type === 'checkbox'"
            v-model="formData[field.prop]"
            :disabled="
              typeof field.disabled === 'undefined' ? false : field.disabled
            "
          >
            <el-checkbox
              v-for="dict in field.options"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >\{{ dict.dictLabel }}
            </el-checkbox>
          </el-checkbox-group>
          <!-- checkbox单选框 -->
          <el-checkbox
            v-else-if="field.type === 'checkbox-single'"
            :true-label="1"
            :false-label="0"
            v-model="formData[field.prop]"
            @change="checkedChange(field,formData[field.prop])"
            :disabled="
              typeof field.disabled === 'undefined' ? false : field.disabled
            "
            >\{{ field.selectValue }}</el-checkbox
          >
          <!-- select选择框 -->
          <el-select
            v-else-if="field.type === 'select'"
            v-show="field.show || true"
            :ref="field.prop"
            v-model="formData[field.prop]"
            :multiple="field.multiple ? field.multiple : false"
            :placeholder="
              field.placeholder ? field.placeholder : '请选择' + field.label
            "
            style="width: 100%"
            :clearable="
              typeof field.clearable === 'undefined' ? false : field.clearable
            "
            :disabled="
              typeof field.disabled === 'undefined' ? false : field.disabled
            "
            :filterable="field.filterable ? field.filterable : false"
            :allow-create="field.allowCreate ? field.allowCreate : false"
            :collapse-tags="field.collapseTags ? field.collapseTags : false"
            popper-class="_baseForm_popperClass"
            @change="changeSelect(field, formData[field.prop])"
            @clear="clearSelect(field, formData[field.prop])"
          >
            <el-option
              v-for="(item, index) in field.options"
              :key="index"
              :label="item.label || item.dictLabel || item.classDictName"
              :title="item.label || item.dictLabel || item.classDictName"
              :value="item.value || item.dictValue || item.classDictCode"
              :disabled="item.disabled === undefined ? false : item.disabled"
              style="overflow: hidden"
            >
              <span>
                \{{ item.label || item.dictLabel || item.classDictName }}
              </span>
            </el-option>
          </el-select>
          <!-- 可远程模糊搜索的select选择框 -->
          <el-select
            v-else-if="field.type === 'remote-select'"
            v-model="formData[field.prop]"
            filterable
            :placeholder="
              field.placeholder ? field.placeholder : '请选择' + field.label
            "
            :disabled="
              typeof field.disabled === 'undefined' ? false : field.disabled
            "
            clearable
            remote
            :remote-method="query => remoteMethod(query, field)"
            :loading="loading"
            :popper-append-to-body="false"
            style="width: 100%"
            popper-class="_baseForm_popperClass"
            @change="changeSelect(field, formData[field.prop])"
            @focus="focusSelect(field, formData[field.prop])"
          >
            <el-option
              v-for="(item, index) in field.options"
              :key="index"
              :label="item.label || item.dictLabel || item.classDictName"
              :title="item.label || item.dictLabel || item.classDictName"
              :value="item.value || item.dictValue || item.classDictCode"
              :disabled="item.disabled === undefined ? false : item.disabled"
              style="overflow: hidden"
            >
              <span>
                \{{ item.label || item.dictLabel || item.classDictName }}
              </span>
            </el-option>
          </el-select>
          <!-- 文本域 -->
          <el-input
            v-else-if="field.type === 'textarea'"
            type="textarea"
            v-model="formData[field.prop]"
            :rows="field.row || 3"
            :maxlength="field.maxlength"
            :placeholder="
              field.placeholder ? field.placeholder : '请输入' + field.label
            "
            :disabled="
              typeof field.disabled === 'undefined' ? false : field.disabled
            "
          />
          <!-- 带输入建议的输入框 -->
          <el-autocomplete
            v-else-if="field.type === 'autocomplete'"
            v-model="formData[field.prop]"
            :value-key="field.valueKey?field.valueKey:field.prop"
            :fetch-suggestions="
              (queryString, cb) => {
                searchAsync(queryString, cb, field)
              }
            "
            :placeholder="
              field.placeholder ? field.placeholder : '请输入' + field.label
            "
            style="width: 100%"
            :clearable="
              typeof field.clearable === 'undefined' ? false : field.clearable
            "
            @select=" (item) => { handleSelect(item, field) }"
            :disabled="
              typeof field.disabled === 'undefined' ? false : field.disabled
            "
          ></el-autocomplete>
          <!-- 数字 -->
          <el-input-number
            v-else-if="field.type === 'number'"
            v-model="formData[field.prop]"
            :controls-position="field.controlsPosition"
            :min="field.min"
            style="width: 100%"
            :disabled="
              typeof field.disabled === 'undefined' ? false : field.disabled
            "
          />
          <!-- 数字范围选择器 -->
          <input-number-range
            v-else-if="field.type === 'numberrange'"
            v-model="formData[field.prop]"
            :disabled="
              typeof field.disabled === 'undefined' ? false : field.disabled
            "
          />
          <!-- 日期范围选择器 -->
          <el-date-picker
            v-else-if="field.type === 'daterange'"
            v-model="formData[field.prop]"
            value-format="yyyy-MM-dd"
            type="daterange"
            :clearable="
              typeof field.clearable === 'undefined' ? false : field.clearable
            "
            :range-separator="typeof field.rangeSeparator === 'undefined' ? '-' : field.rangeSeparator"
            :start-placeholder="field.startPlaceholder"
            :end-placeholder="field.endPlaceholder"
            :unlink-panels="field.unlinkPanels"
            style="width: 100%"
            :disabled="
              typeof field.disabled === 'undefined' ? false : field.disabled
            "
          ></el-date-picker>
          <!-- 年份范围选择器 -->
          <year-range-picker
            v-if="field.type === 'yearrange'"
            v-model="formData[field.prop]"
            :clearable="
              typeof field.clearable === 'undefined' ? false : field.clearable
            "
            style="width: 100%"
            :disabled="
              typeof field.disabled === 'undefined' ? false : field.disabled
            "
          />
          <!-- 日期选择 -->
          <el-date-picker
            v-else-if="
              ['datetime', 'date', 'month', 'year'].includes(field.type)
            "
            v-model="formData[field.prop]"
            :value-format="valueFormat(field.type)"
            :type="field.type"
            :picker-options="field.picker"
            :clearable="
              typeof field.clearable === 'undefined' ? false : field.clearable
            "
            :placeholder="
              field.placeholder ? field.placeholder : '请输入' + field.label
            "
            :readonly="
              typeof field.readonly === 'undefined' ? false : field.readonly
            "
            :disabled="
              typeof field.disabled === 'undefined' ? false : field.disabled
            "
            style="width: 100%"
            @change="changeDate(field, formData[field.prop])"
            @input="change($event)"
          ></el-date-picker>
          <!-- 自定义节点内容的el-tree -->
          <el-tree
            v-else-if="field.type === 'el-tree'"
            node-key="id"
            style="margin-top: 5px; height: 250px; overflow-y: auto"
            :data="formData[field.prop]"
            :props="field.treeProp"
            @node-click="handleNodeClick"
            :default-expand-all="true"
          >
            <span
              style="flex: 1"
              class="custom-tree-node"
              slot-scope="{ node, data }"
              @mouseenter="mouseenter(data)"
              @mouseleave="mouseleave(data)"
            >
              <span>\{{ node.label }}</span>
              <span style="margin-left: 10px" v-show="data.show">
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-close"
                  @click="() => remove(node, data)"
                >
                </el-button>
              </span>
            </span>
          </el-tree>
          <!-- select树（disabledTip判断悬浮提示是否显示） -->
          <el-tooltip placement="top" v-else-if="field.type === 'tree-select'"
            :disabled="
              typeof field.disabledTip === 'undefined' ? true : field.disabledTip
            "
          >
            <div slot="content" style=" max-width: 300px;display: table;white-space: pre-wrap;">
              <!-- 多选、有提示 -->
              <span v-if="field.multiple == true && field.disabledTip == false && formData[field.prop]">
                \{{ field.proClasslabel.toString()}}
              </span>
            </div>
            <tree-select
              v-model="formData[field.prop]"
              @open="selectBlur(field.coverProp)"
              :options="field.options"
              :normalizer="field.normalizer"
              :show-count="field.showCount"
              :limit="field.limit"
              :flat="typeof field.flat === 'undefined' ? false : field.flat"
              :placeholder="
                field.placeholder ? field.placeholder : '请选择' + field.label
              "
              :disabled="
                typeof field.disabled === 'undefined' ? false : field.disabled
              "
              :multiple="
                typeof field.multiple === 'undefined' ? false : field.multiple
              "
              :default-expand-level="
                field.defaultExpandLevel ? field.defaultExpandLevel : 0
              "
              appendToBody
              z-index="9999"
              :disable-branch-nodes="
                field.disableBranchNodes ? field.disableBranchNodes : false
              "
              :load-options="
                ({ action, parentNode, callback }) =>
                  loadOptions({ action, parentNode, callback }, field)
              "
              @select="
                (node, instanceId) => {
                  treeSelectInput(node, instanceId, field)
                }
              "
              @deselect="(node, instanceId) => {
                  deltreeSelect(node, instanceId, field)
                }"
            >
              <div slot="value-label" slot-scope="{ node }">
                \{{ node.raw[field.valueFormat] || node.raw.label }}
              </div>
            </tree-select>
          </el-tooltip>
          <!-- 上传单张图片，以图片方式展示 -->
          <el-upload
            v-else-if="field.type === 'avatar-uploader'"
            class="avatar-uploader"
            :action="uploadAction"
            :headers="field.headers"
            :show-file-list="field.showFileList"
            :on-success="(res, file) => handleSuccess(res, file, field)"
            :before-upload="file => beforeUpload(file, field)"
            :disabled="
              typeof field.disabled === 'undefined' ? false : field.disabled
            "
          >
            <img v-if="field.url" :src="field.url" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!-- 上传单个文件，一般是证书等照片 -->
          <el-upload
            v-else-if="field.type === 'file'"
            class="upload-demo"
            :limit="field.limit"
            :action="uploadAction"
            :headers="field.headers"
            :on-preview="handlePictureCardPreview"
            :file-list="field.fileList"
            :before-upload="file => beforeUpload(file, field)"
            :on-success="(res, file) => handleSuccess(res, file, field)"
            :on-remove="(file, fileList) => handleRemove(file, fileList, field)"
            :on-exceed="(file, fileList) => handleExceed(file, fileList, field)"
            :disabled="
              typeof field.disabled === 'undefined' ? false : field.disabled
            "
          >
            <el-button size="mini"
              >\{{
                field.fileInfo && field.fileInfo !== ''
                  ? field.fileInfo
                  : '未上传'
              }}<i class="el-icon-upload el-icon--right"></i
            ></el-button>
          </el-upload>
          <!-- 按钮 -->
          <el-button
            v-if="field.type === 'button'"
            :type="field.butType"
            :plain="field.plain ? field.plain : false"
            @click="butClick(field)"
            :disabled="
              typeof field.disabled === 'undefined' ? false : field.disabled
            "
          >
            \{{ field.butText }}<i :class="field.icon !== undefined ? field.icon : ''"></i>
          </el-button>
        </el-form-item>
      </template>

      <!-- 此处添加插槽 -->
      <slot name="formButtons"></slot>
    </el-form>
  </div>
</template>

<script>
/**
 * 全局表单组件
 * 功能：
 *    1、根据传入的表单项配置，展示对应的表单字段
 *    2、支持展示的字段类型（type）包括：分割线（line）、标题（title）、普通文本（text）、
 *    密码框（password）、switch开关按钮（switch）、单选radio(radio)、checkbox多选框（checkbox）、checkbox单选框（checkbox-single）、
 *    select选择器（select）、可远程模糊搜索的select选择框（remote-select）、文本域（textarea）、带输入建议的文本框（autocomplete）、
 *    数字输入框（number）、数字范围选择器（numberrange）、日期范围选择器（daterange）、年份范围选择器（yearrange）、
 *    日期选择器（datetime, date, month, year）、自定义节点内容的el-tree（el-tree）、树形选择器（tree-select）、
 *    上传单张图片，以图片方式展示（avatar-uploader）、上传单个文件,一般是证书等照片 （file）、按钮（button）、
 *    自定义插槽字段（formButtons）
 */
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { drawTextWaterMark } from '../../utils/picWarterMark'
import YearRangePicker from '../YearRangePicker/year-range-picker.vue'
import InputNumberRange from '../InputNumberRange/index.vue'

export default {
  name: 'BaseForm',
  components: { InputNumberRange, TreeSelect, YearRangePicker },
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
    // 是否列表上方搜索条件表单
    inline: {
      type: Boolean,
      default: false
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
  data() {
    return {
      // 文件上传地址
      uploadAction: process.env.VUE_APP_BASE_API + '/system/common/upload',
      // 可远程搜索的select遮罩层
      loading:false
    }
  },
  mounted() {
    /**
     * 添加监听键盘点击事件
     */
    window.addEventListener('keydown', this.handleKeyDown)
  },
  beforeDestroy() {
    /**
     * 移除键盘点击事件
     */
    window.removeEventListener('keydown', this.handleKeyDown)
  },
  methods: {
    /**
     * input change input属性被赋值后不能修改的问题
     */
    change(e) {
      this.$forceUpdate(e)
    },
    /**
     * 键盘点击事件
     */
    handleKeyDown(event) {
      if (event.key === 'Enter') {
        this.$emit('keyupEnter')
      }
    },
    /**
     * input输入事件
     * @param {Object} field 字段属性
     * @param {String} val 字段值
     */
    handleChange(field, val) {
      if(field.inputChange !== undefined){
        this.$emit(field.inputChange, val, field.prop)
      }
    },
    /**
     * 普通文本框点击事件
     * @param {Object} field 字段属性
     */
    clickInput(field) {
      if (field.click !== undefined) {
        this.$emit(field.click, field)
      }
    },
    /**
     * radio框选中数据变化触发
     * @param {Object} field 字段属性
     * @param {String} value 字段值
     */
    changeInput(field, value) {
      if (field.change !== undefined) {
        this.$emit(field.change, value)
      }
    },
    /**
     * 下拉框选项变化触发事件
     * @param {Object} field 字段属性
     * @param {String} value 字段值
     */
    changeSelect(field, value) {
      //使下拉框失去焦点,以避免回车搜索打开下拉框
      this.$nextTick(()=>{
        this.$refs[field.prop][0].blur()
      })
      if (field.click !== undefined) {
        this.$emit(field.click, value)
      }
    },
    /**
     * 可清空的单选模式下用户点击清空按钮时触发
     * @param {Object} field 字段属性
     * @param {String} value 字段值
     */
    clearSelect(field, value) {
      if (field.clear !== undefined) {
        this.$emit(field.clear, value)
      }
    },
    /**
     * 点击下拉框触发事件
     * @param {Object} field 字段属性
     * @param {String} value 字段值
     */
    focusSelect(field, value) {
      if (field.focus !== undefined) {
        this.$emit(field.focus, value)
      }
    },
    /**
     * 日期时间选框变化触发事件
     * @param {Object} field 字段属性
     * @param {String} value 字段值
     */
    changeDate(field, value) {
      if (field.click !== undefined) {
        this.$emit(field.click, value)
      }
    },
    /**
     * 树形下拉框选项变化触发事件
     * @param {Object} field 字段属性
     * @param {String} value 字段值
     */
    treeSelectInput(node, instanceId, field) {
      if (field.click !== undefined) {
        this.$emit(field.click, node.id, node)
      }
    },
    /**
     * 树形下拉框选项取消选中触发事件
     * @param {Object} field 字段属性
     * @param {String} value 字段值
     */
    deltreeSelect(node, instanceId, field) {
      if (field.delClick !== undefined) {
        this.$emit(field.delClick, node.id, node)
      }
    },
    /**
     * 带输入建议的输入框变化触发事件
     * @param {Object} field 字段属性
     * @param {Object} item
     */
    handleSelect(item,field) {
      if (field.click !== undefined) {
        this.$emit(field.click, item)
      }
    },
    /**
     * 返回输入建议的方法
     * @param {Object} field 字段属性
     * @param {*} queryString
     * @param {*} cb
     */
    searchAsync(queryString, cb, field) {
      if (field.search !== undefined) {
        this.$emit(field.search, queryString, cb)
      }
    },
    /**
     * 展开/折叠菜单树
     * @param {Boolean} value 字段值
     * @param {Object} field 字段属性
     */
    handleCheckedTreeExpandMenu(value, field) {
      let treeList_web = field.webOptions
      for (let i = 0; i < treeList_web.length; i++) {
        this.$refs[`${field.prop}-web-tree`][0].store.nodesMap[
          treeList_web[i].menuId
        ].expanded = value
      }
      let treeList_mobile = field.mobileOptions
      for (let i = 0; i < treeList_mobile.length; i++) {
        this.$refs[`${field.prop}-mobile-tree`][0].store.nodesMap[
          treeList_mobile[i].menuId
        ].expanded = value
      }
    },
    /**
     * 可远程模糊搜索的select远程搜索方法
     * @param {String} query 查询条件
     * @param {Object} field 字段信息
     */
    remoteMethod(query, field) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.$emit('remoteMethod', query, field)
        }, 200)
      }
    },
    /**
     * 懒加载tree-select数据方法
     */
    loadOptions({ action, parentNode, callback }, field) {
      this.$emit(field.function, { action, parentNode, callback })
    },
    /**
     * 菜单树全选/全不选
     * @param {Boolean} value 字段值
     * @param {Object} field 字段属性
     */
    handleCheckedTreeNodeAllMenu(value, field) {
      this.$refs[`${field.prop}-web-tree`][0].setCheckedNodes(
        value ? field.webOptions : []
      )
      this.$refs[`${field.prop}-mobile-tree`][0].setCheckedNodes(
        value ? field.mobileOptions : []
      )
    },
    /**
     * 选择图标触发事件
     * @param {Object} field 字段属性
     * @param {String} icon 选中图标
     */
    selectedIcon(field, icon) {
      if (field.selected !== undefined) {
        this.$emit(field.selected, icon)
      }
    },
    /**
     * 重置表单
     */
    resetForm() {
      this.$refs.form.resetFields()
    },
    /**
     * 处理data-time-picker的value-format
     **/
    valueFormat(type) {
      if (type === 'datetime') {
        return 'yyyy-MM-dd HH:mm:ss'
      } else if (type === 'date') {
        return 'yyyy-MM-dd'
      } else if (type === 'month') {
        return 'yyyy-MM'
      } else if (type === 'year') {
        return 'yyyy'
      }
    },
    /**
     * 上传成功事件
     */
    handleSuccess(res, file, field) {
      this.$emit(field.handleSuccess, res, file, field)
    },
    /**
     * 图片上传前校验
     */
    beforeUpload(file, field) {
      let isRightSize = file.size / 1024 / 1024 < field.size
      if (!isRightSize) {
        this.$message.error(`文件大小超过 ${field.size}MB`)
      }

      let isAccept = false
      if (field.type === 'avatar-uploader') {
        isAccept = new RegExp('image/*').test(file.type)
        if (!isAccept) {
          this.$message.error('请选择image/*类型的文件')
        }
      } else if (field.type === 'file') {
        isAccept = ['application/pdf'].includes(file.type)
        if (!isAccept) {
          this.$message.error('请选择pdf格式的文件')
        }
      }

      // 如果文件大小和格式正确，则为文件绘制水印
      if (isRightSize && field.type === 'avatar-uploader' && isAccept) {
        return drawTextWaterMark(file)
      } else if (isRightSize && isAccept) {
        return true
      } else {
        return false
      }
    },
    /**
     * 预览上传的文件
     */
    handlePictureCardPreview(file) {
      window.open(file.url, '_blank')
    },
    /**
     * 移除文件
     */
    handleRemove(file, fileList, field) {
      this.$emit(field.handleRemove, file, fileList, field)
    },
    /**
     * 文件上传个数超出限制时给出提示
     */
    handleExceed(files, fileList, field) {
      this.$message.warning(`最多只能上传${field.limit}个文件`)
    },
    /**
     * treeselect与el-select下拉框不兼容,传入对应el-select的ref
     */
    selectBlur(coverProp) {
      if (coverProp) {
        this.$refs[coverProp][0].blur()
      }
    },
    /**
     * 按钮点击事件
     * @param {Object} field 字段属性
     */
    butClick(field) {
      if (field.click !== undefined) {
        this.$emit(field.click)
      }
    },
    /**el-tree鼠标移入移出 */
    mouseenter(data) {
      this.$set(data, 'show', true)
    },
    mouseleave(data) {
      this.$set(data, 'show', false)
    },
    /**el-tree节点点击 */
    handleNodeClick() { },
    /**el-tree节点删除 */
    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1) //删除当前节点（通过父节点的子节点获取）
      if (children.length == 0 && parent.parent) {
        //如果当前节点的父节点的子节点不包含任何子节点，则继续向上删除
        let childrenfP = parent.parent.data.children || parent.parent.data
        let indexfP = childrenfP.findIndex(e => e.id === parent.data.id)
        childrenfP.splice(indexfP, 1)
        if (childrenfP.length == 0 && parent.parent.parent) {
          //如果当前节点的爷爷节点不包含任何子节点，则继续向上删除
          let childrenSe =
            parent.parent.parent.data.children || parent.parent.parent.data
          let indexSe = childrenSe.findIndex(
            e => e.id === parent.parent.data.id
          )
          childrenSe.splice(indexSe, 1)
        }
      }
    },
    /**
     * checkbox单选框,当绑定值变化时触发的事件
     * @param {Object} field 字段属性
     * @param {String} value 字段值
     */
    checkedChange(field,value){
      if (field.change !== undefined) {
        this.$emit(field.change,value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.inline ::v-deep {
  .vue-treeselect__placeholder {
    font-size: 13px;
  }

  .vue-treeselect__control {
    border: 1px solid #dcdfe6;

    .vue-treeselect__placeholder {
      line-height: 36px;
    }
  }
  .vue-treeselect__multi-value-label {
    line-height: 20px;
  }

  .vue-treeselect--has-value .vue-treeselect__multi-value {
    line-height: 20px;
  }

  .el-form-item--medium .el-form-item__content {
    line-height: 32px;
  }
}

::v-deep .el-form-item--medium .el-form-item__content {
  height: auto !important;
}

::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #409eff;
  }
}
::v-deep .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

// 文件上传后的文件列表，文件名称悬浮时展示的删除图标样式调整
::v-deep .el-upload-list__item .el-icon-close {
  top: 10px;
}
.el-divider--horizontal {
  margin: 0;
}
//解决下拉选项的弹出框过长的问题
::v-deep .el-select-dropdown._baseForm_popperClass {
  width: 0;
}
//修改tree-select高度和size=small的el组件高度相同
::v-deep .vue-treeselect__control{
  height: 32px;
}
::v-deep .vue-treeselect__control .vue-treeselect__value-container .vue-treeselect__single-value{
  line-height: 30px;
}
::v-deep .vue-treeselect__placeholder{
  line-height: 30px !important;
}
::v-deep .input-number-range{
  height: 38px;
}
::v-deep .el-range-editor--small.el-input__inner{height:40px !important;}
</style>
