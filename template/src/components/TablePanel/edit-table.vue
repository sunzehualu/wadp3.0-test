<template>
  <div id="editable-table-panel">
    <!-- 数据列表 -->
    <el-table
      ref="table"
      v-bind="_attrs"
      v-on="new$listeners"
      @cell-click="cellClick"
      class="editable-table-panel"
    >
      <!-- 复选框 -->
      <el-table-column
        v-if="showCheckbox"
        type="selection"
        :reserve-selection="true"
        width="55"
        align="center"
        fixed
      />
      <!-- 序号自增字段 -->
      <el-table-column
        v-if="showSelfIncreasing"
        label="序号"
        type="index"
        align="center"
        width="55"
        fixed
      >
        <template slot-scope="scope">
          <span>\{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <!-- 根据表格字段类型循环显示字段
      label-class-name: 为配置了可编辑标识editable的列设置蓝色背景样式-->
      <el-table-column
        v-if="column.visible !== undefined ? column.visible : true"
        v-for="(column, idx) in tableColumns"
        :key="idx"
        :align="column.align"
        :label="column.label"
        :prop="column.prop"
        :width="column.width"
        :fixed="column.fixed || false"
        :label-class-name="column.editable ? 'blueBack' : ''"
        :show-overflow-tooltip="true"
      >
        <div
          class="item"
          slot-scope="scope"
          v-if="column.children === undefined || column.children.length === 0"
        >
          <!-- 普通文本 - 展示 -->
          <span
            v-if="
              column.editing !== undefined
                ? column.type === 'text' && column.editing !== scope.row[rowKey]
                : column.type === 'text' &&
                  (editProp !== column.prop || editRowKey !== scope.row[rowKey])
            "
            >\{{ scope.row[column.prop] }}</span
          >
          <!-- 普通文本 - 编辑 -->
          <el-input
            v-if="
              column.type === 'text' &&
              ((editRowKey === scope.row[rowKey] && editProp === column.prop) ||
                column.editing === scope.row[rowKey])
            "
            v-model="scope.row[column.prop]"
            :placeholder="column.placeholder || '请输入'"
            :maxlength="column.maxlength"
            @change="inputChange"
            class="item__input"
            size="small"
            :class="column.icon !== undefined ? 'input-prefix' : ''"
            :clearable="
              typeof column.clearable === 'undefined' ? false : column.clearable
            "
          >
            <i
              v-if="column.icon !== undefined"
              slot="prefix"
              style="padding: 10px"
            >
              <svg-icon :icon-class="column.icon" />
            </i>
          </el-input>

          <!-- 字典格式化/翻译 - 展示 -->
          <span
            v-if="
              column.editing !== undefined
                ? column.type === 'dict-data' &&
                  column.editing !== scope.row[rowKey]
                : column.type === 'dict-data' &&
                  (editProp !== column.prop || editRowKey !== scope.row[rowKey])
            "
            >\{{ selectDictLabel(column.options, scope.row[column.prop]) }}</span
          >
          <!-- select选择框 - 编辑-->
          <el-select
            v-if="
              column.type === 'dict-data' &&
              ((editRowKey === scope.row[rowKey] && editProp === column.prop) ||
                column.editing === scope.row[rowKey])
            "
            v-model="scope.row[column.prop]"
            :multiple="column.multiple ? column.multiple : false"
            :placeholder="column.placeholder || '请选择'"
            @change="inputChange"
            class="item__input"
            size="mini"
            style="width: 100%"
            :clearable="
              typeof column.clearable === 'undefined' ? false : column.clearable
            "
          >
            <el-option
              v-for="(item, index) in column.options"
              :key="index"
              :label="item.label || item.dictLabel"
              :value="item.value || item.dictValue"
              :disabled="item.disabled === undefined ? false : item.disabled"
              style="overflow: hidden"
            >
              <span>
                \{{ item.label || item.dictLabel }}
              </span>
            </el-option>
          </el-select>

          <!-- 日期格式化 适配时间，日期，月份格式化 - 展示 -->
          <span
            v-if="
              column.editing !== undefined
                ? ['datetime', 'date', 'month'].includes(column.type) &&
                  column.editing !== scope.row[rowKey]
                : ['datetime', 'date', 'month'].includes(column.type) &&
                  (editProp !== column.prop || editRowKey !== scope.row[rowKey])
            "
            >\{{ formatTime(scope.row[column.prop], column.type) }}</span
          >
          <!-- 日期时间选择器 适配时间，日期，月份格式化 - 编辑 -->
          <el-date-picker
            class="item__input"
            v-if="
              ['datetime', 'date', 'month'].includes(column.type) &&
              ((editRowKey === scope.row[rowKey] && editProp === column.prop) ||
                column.editing === scope.row[rowKey])
            "
            v-model="scope.row[column.prop]"
            :value-format="dateTimePickerValueFormat(column.type)"
            :type="column.type"
            @change="inputChange"
            :clearable="
              typeof column.clearable === 'undefined' ? false : column.clearable
            "
            :placeholder="column.placeholder || '请选择'"
            style="width: 100%"
          ></el-date-picker>
        </div>

        <el-table-column
          v-if="column.children && column.children.length"
          v-for="(columnx, idy) in column.children"
          :key="idy"
          :align="columnx.align"
          :label="columnx.label"
          :prop="columnx.prop"
          :width="columnx.width"
          :fixed="columnx.fixed || false"
          :label-class-name="columnx.editable ? 'blueBack' : ''"
          :show-overflow-tooltip="true"
        >
          <div slot-scope="scope" class="item">
            <!-- 普通文本 - 展示 -->
            <span
              v-if="
                columnx.type === 'text' &&
                (editProp !== columnx.prop || editRowKey !== scope.row[rowKey])
              "
              >\{{ scope.row[columnx.prop] }}</span
            >
            <!-- 普通文本 - 编辑 -->
            <el-input
              v-if="
                columnx.type === 'text' &&
                editRowKey === scope.row[rowKey] &&
                editProp === columnx.prop
              "
              v-model="scope.row[columnx.prop]"
              :placeholder="columnx.placeholder || '请输入'"
              :maxlength="columnx.maxlength"
              @change="inputChange"
              class="item__input"
              size="small"
              :class="columnx.icon !== undefined ? 'input-prefix' : ''"
              :clearable="
                typeof columnx.clearable === 'undefined'
                  ? false
                  : columnx.clearable
              "
            >
              <i
                v-if="columnx.icon !== undefined"
                slot="prefix"
                style="padding: 10px"
              >
                <svg-icon :icon-class="columnx.icon" />
              </i>
            </el-input>

            <!-- 字典格式化/翻译 - 展示 -->
            <span
              v-if="
                columnx.type === 'dict-data' &&
                (editProp !== columnx.prop || editRowKey !== scope.row[rowKey])
              "
              >\{{
                selectDictLabel(columnx.options, scope.row[columnx.prop])
              }}</span
            >
            <!-- select选择框 - 编辑 -->
            <el-select
              v-if="
                columnx.type === 'dict-data' &&
                editRowKey === scope.row[rowKey] &&
                editProp === columnx.prop
              "
              v-model="scope.row[columnx.prop]"
              :multiple="columnx.multiple ? columnx.multiple : false"
              :placeholder="columnx.placeholder || '请选择'"
              @change="inputChange"
              class="item__input"
              size="mini"
              style="width: 100%"
              :clearable="
                typeof columnx.clearable === 'undefined'
                  ? false
                  : columnx.clearable
              "
            >
              <el-option
                v-for="(item, index) in columnx.options"
                :key="index"
                :label="item.label || item.dictLabel"
                :value="item.value || item.dictValue"
                :disabled="item.disabled === undefined ? false : item.disabled"
                style="overflow: hidden"
              >
                <span>
                  \{{ item.label || item.dictLabel }}
                </span>
              </el-option>
            </el-select>

            <!-- 日期格式化 - 展示 -->
            <span
              v-if="
                ['datetime', 'date', 'month'].includes(columnx.type) &&
                (editProp !== columnx.prop || editRowKey !== scope.row[rowKey])
              "
              >\{{ formatTime(scope.row[columnx.prop], columnx.type) }}</span
            >
            <!-- 日期时间选择器 - 编辑 -->
            <el-date-picker
              class="item__input"
              v-if="
                ['datetime', 'date', 'month'].includes(columnx.type) &&
                editRowKey === scope.row[rowKey] &&
                editProp === columnx.prop
              "
              v-model="scope.row[columnx.prop]"
              :value-format="dateTimePickerValueFormat(columnx.type)"
              :type="columnx.type"
              @change="inputChange"
              :clearable="
                typeof columnx.clearable === 'undefined'
                  ? false
                  : columnx.clearable
              "
              :placeholder="columnx.placeholder || '请选择'"
              style="width: 100%"
            ></el-date-picker>
          </div>
        </el-table-column>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        v-if="buttonList && buttonList.length > 0"
        :width="opretionListWidth"
      >
        <template slot-scope="scope">
          <el-button
            v-for="(btn, idx) in buttonList"
            :key="idx"
            size="mini"
            type="text"
            :icon="btn.icon"
            v-hasPermi="btn.permission || []"
            v-show="showButton(btn, scope.row)"
            v-if="butView(btn, scope.row)"
            @click="buttonFun(btn, scope.row, scope.$index)"
            >\{{ btn.label }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页条 -->
    <div class="pagination-container">
      <el-pagination
        v-bind="$attrs"
        v-show="showPagination"
        :background="background"
        :current-page.sync="currentPage"
        :page-size.sync="currentPageSize"
        :pager-count="pagerCount"
        :layout="layout"
        :page-sizes="pageSizes"
        :total="total"
        @size-change="pageChange"
        @current-change="pageChange"
      />
  </div>
  </div>
</template>

<script>
/**
 * 可编辑表格+分页条组件
 * 功能：
 * 1、展示表格数据，包括普通和级联树形数据展示
 * 2、根据分页条页码查询表格数据
 * 3、实现行内编辑功能，多级表头功能
 * 4、支持展示的字段类型（type）包括：普通文本（text）、字典格式化/翻译（dict-data）、
 *    日期格式化 适配时间，日期，月份格式化（datetime, date, month）
 */
import { scrollTo } from '../../utils/scroll-to'
export default {
  name: 'EditableTablePanel',
  props: {
    // 表格字段集合
    tableColumns: {
      type: Array,
      default: () => []
    },
    // 是否展示复选框字段
    showCheckbox: {
      type: Boolean,
      default: true
    },
    // 是否展示序号自增字段
    showSelfIncreasing: {
      type: Boolean,
      default: false
    },
    // 操作列按钮集合
    buttonList: {
      type: Array,
      default: () => []
    },
    // 是否展示分页条
    showPagination: {
      type: Boolean,
      default: false
    },
    // 数据总条数
    total: {
      type: Number,
      default: 0
    },
    // 当前页码
    pageNum: {
      type: Number
    },
    // 每页数据条数
    pageSize: {
      type: Number
    },
    // 每页显示个数选择器的选项设置
    pageSizes: {
      type: [Number, Array],
      default: () => [10, 20, 30, 50]
    },
    // 操作列宽度
    opretionListWidth: {
      type: Number
    },
    // 表格数据所属对象
    object: {
      type: String,
      default: ''
    },
    // 设置需要显示的内容，用逗号分隔，布局元素会依次显示。
    // prev表示上一页，next为下一页，pager表示页码列表，jumper表示跳页元素，total表示总条目数，sizes用于设置每页显示的页码数量。
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    // 为分页按钮添加背景色。
    background: {
      type: Boolean,
      default: true
    },
    // 设置scrollTo
    autoScroll: {
      type: Boolean,
      default: true
    },
    //设置最大页码按钮数
    pagerCount: {
      type: Number,
      default: 7
    },
    // 行的唯一键值row-key
    // rowKey: {
    //   type: String,
    //   require: true
    // }
  },
  data() {
    return {
      rowKey: '',
      // 正在编辑的row-key
      editRowKey: null,
      // 正在编辑的prop
      editProp: null,
      // 编辑的行数据
      editRow: {},
      // 需要编辑的列的属性集合
      editColumns: []
    }
  },
  mounted() {
    this.rowKey = this._attrs['row-key']
    // 获取需要编辑的列的属性
    this.getEditCols(this.tableColumns)
  },
  computed: {
    /**
     * 计算属性暴露表格原有props
     */
    _attrs() {
      return { ...this.$attrs }
    },
    /**
     * 使用new$listeners继承表格原有事件，并覆盖表格原有事件
     */
    new$listeners() {
      return Object.assign(this.$listeners, {
        // TODO：此处可声明并覆盖原有事件
      })
    },
    // 分页条当前页码
    currentPage: {
      get() {
        return this.pageNum
      },
      set(val) {
        this.$emit('update:pageNum', val)
      }
    },
    // 分页条总页数
    currentPageSize: {
      get() {
        return this.pageSize
      },
      set(val) {
        this.$emit('update:pageSize', val)
      }
    }
  },
  watch: {
    /**
     * 在列变化后，重载table
     * 解决隐藏列重新显示后导致的行错位问题
     */
    tableColumns: {
      handler() {
        this.$nextTick(() => {
          this.getTable().doLayout()
        })
      },
      deep: true
    }
  },
  methods: {
    /**
     *  判断操作列按钮显示隐藏
     */
    butView(btn,row){
      if(btn.initialValue !== row[this.rowKey] && btn.butRowKey !== undefined){
        return true
      }else if( btn.initialValue === row[this.rowKey]  && btn.butRowKey === undefined){
        return true
      }else{
        return false
      }
    },
    /**
     * 获取可编辑列的方法
     * @param cols
     */
    getEditCols(cols) {
      for (const obj of cols) {
        if (obj.children && obj.children.length) {
          this.getEditCols(obj.children)
        } else if (obj.editable === true) {
          this.editColumns.push(obj.prop)
        }
      }
    },
    /**
     * 二次封装的组件暴露组件实例，利用实例再调用element内部的方法
     * @returns {Object} 返回表格
     */
    getTable() {
      return this.$refs.table
    },
    /**
     * 按钮点击方法
     * @param {Object} button 当前按钮
     * @param {Object} row 行数据
     * @param {String} index 当前行
     */
    buttonFun(button, row, index) {
      this.$emit(button.fun, row, index)
    },
    /**
     * 分页条页码变化
     */
    pageChange() {
      this.$emit('pageChange')
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    /**
     * 判断按钮是否展示
     */
    showButton(btn, row) {
      // 如果不是参数配置页面按钮
      if (this.object === '' || this.object === undefined) {
        // 全部显示
        return true
      } else {
        // 如果是参数配置页面的删除按钮，根据字段判断后显示/隐藏
        if (this.object === 'config' && btn.label === '删除') {
          // 系统内置参数不可删除，否则可删除
          return row.configType !== '是'
        } else if (this.object === 'dept' && btn.label === '删除') {
          // 系统内置参数不可删除，否则可删除
          return row.parentId !== 0
        } else {
          // 否则全部展示
          return true
        }
      }
    },
    /**
     * 单元格点击操作
     */
    cellClick(row, column) {
      //1判断点击的列是否可编辑
      if (this.editColumns.includes(column.property)) {
        //2缓存row-key,列prop,row数据
        this.editRowKey = row[this.rowKey]
        this.editProp = column.property
        this.editRow = row
      } else {
        this.editProp = null
        this.editRowKey = null
        this.editRow = {}
      }
      //3强制刷新table
      this.$nextTick(() => {
        this.getTable().doLayout()
      })
    },
    /**
     * 输入框数据变化触发
     */
    inputChange() {
      if (this.editRowKey) {
        //1传出修改的信息
        this.$emit('handleUpdate', this.editRow, this.editRowKey, this.editProp)
      }
      //2退出编辑状态
      this.editProp = null
      this.editRowKey = null
      this.editRow = {}
      //3强制刷新table
      this.$nextTick(() => {
        this.getTable().doLayout()
      })
    },
    /**
     * 处理data-time-picker的value-format
     **/
    dateTimePickerValueFormat(type) {
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
     * 日期时间翻译方法
     * value:日期时间值
     * type:日期时间的类型
     */
    formatTime(value, type) {
      let timeType = ''
      if (type === 'date') {
        timeType = '{y}-{m}-{d}'
      } else if (type === 'month') {
        timeType = '{y}-{m}'
      } else if (type === 'year') {
        timeType = '{y}'
      }
      return this.parseTime(value, timeType)
    }
  }
}
</script>

<style lang="scss" scoped>
#editable-table-panel {
  width: 100%;
}
::v-deep .editable-table-panel .cell {
  line-height: 24px;
}
::v-deep .blueBack {
  background-color: rgb(163, 207, 253) !important;
}
::v-deep .item {
  .item__input {
    width: 100%;
    .el-input__inner {
      height: 24px !important;
      line-height: 24px !important;
    }
    .el-input__suffix i,
    .el-input__prefix i {
      font-size: 12px !important;
      line-height: 24px !important;

      .el-input--small .el-input__icon {
        line-height: 24px !important;
      }
    }
  }
}
</style>
<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>