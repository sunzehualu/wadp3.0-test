<template>
  <div id="readonly-table-panel">
    <!-- 数据列表 -->
    <table
      class="infoTable"
      v-bind="_attrs"
      v-on="new$listeners"
      :style="{ 'line-height': tableHeight }"
    >
      <template v-for="(row, rowIndex) in tableColumns">
        <template v-if="row.type === 'readonly'">
          <tr :key="rowIndex">
            <template v-for="(cell, cellIndex) in row.data">
              <td
                v-if="cell.show !== false"
                :key="rowIndex + cellIndex"
                :class="cell.backCol ? cell.backCol : ''"
                :colspan="cell.colspan ? cell.colspan : 1"
                :rowspan="cell.rowspan ? cell.rowspan : 1"
                :style="{
                  width: cell.width ? cell.width : '',
                  height: cell.height ? cell.height : '',
                  'text-align': cell.align ? cell.align : '',
                  'line-height': cell.lineHeight ? cell.lineHeight : '',
                  'border-right-width': cell.borderRightWidth
                    ? cell.borderRightWidth
                    : '1px',
                  'border-bottom-width': cell.borderBottomWidth
                    ? cell.borderBottomWidth
                    : '1px',
                  'border-left-width': cell.borderLeftWidth
                    ? cell.borderLeftWidth
                    : '1px',
                  'border-top-width': cell.borderTopWidth
                    ? cell.borderTopWidth
                    : '1px'
                }"
              >
                <!-- 字段名 -->
                <div
                  v-if="cell.type === '' || cell.type === undefined"
                  :class="{ labelStyle: cell.labelStyle }"
                >
                  \{{ cell.label }}
                </div>
                <!-- 普通文本:不带悬浮提示框 -->
                <span v-if="cell.type === 'text'">
                  \{{
                    cell.unit
                      ? tableDate[cell.prop] + cell.unit
                      : tableDate[cell.prop]
                  }}</span
                >
                <!-- 普通文本:带悬浮提示框 -->
                <auto-tooltip
                  v-if="cell.type === 'textShowToolTip'"
                  :content="tableDate[cell.prop]"
                />
                <!-- 字典格式化/翻译:不带悬浮提示框-->
                <span v-if="cell.type === 'select'">
                  \{{
                    cell.options
                      ? selectDictLabel(cell.options, tableDate[cell.prop])
                      : ''
                  }}
                </span>
                <!-- 字典格式化/翻译:带悬浮提示框 -->
                <auto-tooltip
                  v-if="cell.type === 'selectShowToolTip'"
                  :content="
                    cell.options
                      ? selectDictLabel(cell.options, tableDate[cell.prop])
                      : ''
                  "
                  :topPx="'1px'"
                />
                <span v-if="cell.type === 'input'">
                  <!-- 普通文本 - 编辑 -->
                  <el-input
                    v-if="
                      cell.showInput === 'undefined' ? true : cell.showInput
                    "
                    v-model="tableDate[cell.prop]"
                    class="item__input"
                    size="small"
                    :clearable="
                      typeof cell.clearable === 'undefined'
                        ? false
                        : cell.clearable
                    "
                    @input="handleChange(cell, tableDate[cell.prop])"
                  >
                  </el-input>
                  <span v-else>\{{ tableDate[cell.prop] }}</span>
                </span>
                <!-- 其他自定义样式 -->
                <span v-html="cell.label" v-if="cell.type === 'other'"> </span>
                <!-- 进度条 -->
                <span v-if="cell.type === 'progress'">
                  <el-progress
                    :status="cell.status ? cell.status : 'success'"
                    :text-inside="true"
                    :percentage="towNumber(tableDate[cell.prop])"
                    :stroke-width="
                      cell.strokeWidth === 'undefined' ? '20' : cell.strokeWidth
                    "
                  ></el-progress>
                </span>
                <!-- 签字样式 -->
                <span v-if="cell.type === 'sign'">
                  签字：<br /><span style="float: right; margin-right: 20px">
                    <span style="margin-right: 30px">年</span>
                    <span style="margin-right: 30px">月</span>
                    <span style="margin-right: 30px">日</span>
                  </span>
                </span>
                <!-- 日期 -->
                <span v-if="cell.type === 'date'">
                  <span style="float: right; margin-right: 20px">
                    <span style="margin-right: 30px">年</span>
                    <span style="margin-right: 30px">月</span>
                    <span style="margin-right: 30px">日</span>
                  </span>
                </span>
                <!-- 核准 -->
                <span v-if="cell.type === 'approval'">
                  <span style="margin-left: 20px">人力资源部经办人：</span>
                  <span style="margin-left: 100px">日期：</span>
                  <span style="margin-left: 130px">核准人：</span>
                  <span style="margin-left: 100px">日期：</span>
                </span>
              </td>
            </template>
          </tr>
        </template>
        <template v-if="row.type === 'data'">
          <tr v-for="(item, listIndex) in dataList" :key="rowIndex + listIndex">
            <template v-for="(cell, index) in row.data">
              <td v-if="cell.show !== false" :key="index">
                <!-- 序号 -->
                <span v-if="cell.type === 'index'"> \{{ listIndex + 1 }}</span>
                <!-- 普通文本 -->
                <span v-if="cell.type === 'text'"> \{{ item[cell.prop] }}</span>
                <!-- 字典格式化/翻译 -->
                <span v-if="cell.type === 'select'">
                  \{{
                    cell.options
                      ? selectDictLabel(cell.options, item[cell.prop])
                      : ''
                  }}
                </span>
              </td>
            </template>
          </tr>
        </template>
      </template>
    </table>
  </div>
</template>

<script>
/**
 * table表格
 * 功能：
 *   1、以tr、td样式展示表格数据
 *   2、支持展示的字段类型（type）包括：普通文本:不带悬浮提示框（text）、普通文本:带悬浮提示框（textShowToolTip）、
 *    字典格式化/翻译:不带悬浮提示框（select）、字典格式化/翻译:带悬浮提示框（selectShowToolTip）、普通文本 - 编辑(input)、
 *    其他自定义样式（other）、进度条（progress）、签字样式（sign）、日期（date）、核准（approval）、序号（index）
 */
import AutoTooltip from '../AutoTooltip'

export default {
  name: 'TabelPanel',
  components: { AutoTooltip },
  props: {
    // 表格字段集合
    tableColumns: {
      type: Array,
      required: true
    },
    // 只读表格数据
    tableDate: {
      type: Object,
      default: () => {}
    },
    // 循环表格数据列表
    dataList: {
      type: Array,
      default: () => []
    },
    // 行高(间距)
    tableHeight: {
      type: String,
      default: ''
    }
  },
  computed: {
    /**
     * 计算属性暴露表格原有props
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
     * 二次封装的组件暴露组件实例，利用实例再调用element内部的方法
     * @returns {Object} 返回表格
     */
    getTable() {
      return this.$refs.table
    },
    /**
     * input输入事件
     * @param {*} cell
     * @param {*} val 字段值
     */
    handleChange(cell, val) {
      this.$emit(cell.fun, cell.prop, val, cell.max)
    },
    /**
     * 保留两位小数
     * @param {*} val 字段值
     */
    towNumber(val) {
      if (val) {
        return parseInt((val * 100).toFixed(2))
      } else {
        return 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#table-panel {
  width: 100%;
}

.backCol {
  background-color: rgb(250, 250, 250);
  width: 10%;
}
.infoTable {
  border: 1px solid rgb(237, 237, 237);
  padding: 0;
  border-collapse: collapse;
  line-height: 180%;

  width: 100%;
  text-align: center;
  font-size: 13px;
}

.infoTable > tr td {
  border: 1px solid rgb(237, 237, 237);
  margin: 0;
}
.labelStyle {
  text-align-last: justify;
  text-align: justify;
  text-justify: distribute-all-lines;
  padding: 10px;
}
</style>
