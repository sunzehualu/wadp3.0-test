<template>
  <div id="table-panel">
    <!-- 数据列表 -->
    <el-table ref="tabel" v-bind="_attrs" :data="tableList" v-on="new$listeners">
      <!-- 展开行 -->
      <el-table-column
        v-if="showExpand === undefined ? false : showExpand"
        type="expand"
      >
        <template slot-scope="props">
          <!-- 此处添加插槽:展开行 -->
          <slot name="tableExpand" :props="props"></slot>
        </template>
      </el-table-column>
      <!-- 复选框 -->
      <el-table-column
        v-if="showCheckbox"
        type="selection"
        :reserve-selection="true"
        :selectable="selectDisable"
        width="55"
        align="center"
      />
      <!-- 序号自增字段 -->
      <el-table-column
        v-if="showSelfIncreasing"
        label="序号"
        type="index"
        align="center"
        width="50px"
      >
        <template slot-scope="scope">
          <span>\{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <!-- 根据表格字段类型循环显示字段 -->
      <el-table-column
        v-if="column.visible !== undefined ? column.visible : true"
        v-for="(column, idx) in tableColumns"
        :key="idx"
        :align="column.align"
        :label="column.label"
        :prop="column.prop"
        :width="column.width"
        :min-width="column.minWidth"
        :show-overflow-tooltip="true"
        :sortable="column.sortable"
      >
        <!-- 二级表头，二级目录存在children，v-for遍历 -->
        <el-table-column
          v-if="column.type === 'multilevel'"
          v-for="(child, idxOne) in column.children"
          :key="idxOne"
          :label="child.label"
          :prop="child.prop"
          :align="child.align"
          :width="child.width"
          :min-width="child.minWidth"
          :show-overflow-tooltip="true"
          :sortable="child.sortable"
        >
          <template slot-scope="scope">
            <!-- 普通文本 -->
            <span v-if="child.type === 'text'">\{{
              scope.row[child.prop]
            }}</span>
            <!-- 按钮 -->
            <el-popover
              trigger="hover"
              placement="top"
              v-if="child.type === 'popoverButton'"
              :ref="'popover' + scope.row.id + scope.column.property"
            >
              <p style="white-space: pre-line">
                \{{ scope.row[child.propShow] }}
              </p>
              <div slot="reference" class="name-wrapper">
                <el-button
                  size="medium"
                  type="text"
                  v-if="child.type === 'popoverButton'"
                  :icon="child.icon"
                  v-hasPermi="child.permission || []"
                  @click="buttonFun(child, scope.row)"
                  :disabled="
                    (child.disabled &&
                      child.disabled.value == scope.row[child.disabled.prop]) ||
                    child.unUsable
                  "
                  >\{{ scope.row[child.prop] }}
                </el-button>
              </div>
            </el-popover>
            <!-- el-popover-Table-->
            <el-popover
              v-if="child.type === 'popover'"
              trigger="click"
              :open-delay="15000"
              placement="top"
              :ref="'popover' + scope.row.id + scope.column.property"
              class="popoverStyle"
            >
              <TabelPanel
                v-if="child.popoverTableColumn"
                :data="child.popoverTableData"
                :tableColumns="child.popoverTableColumn"
                :showCheckbox="false"
                :showSelfIncreasing="false"
              >
              </TabelPanel>
              <div
                slot="reference"
                class="name-wrapper"
                :class="scope.row.workStatus == 2 ? 'redText' : null"
              >
                \{{ scope.row[child.prop] }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <template slot-scope="scope">
          <!-- 普通文本 -->
          <span v-if="column.type === 'text'">\{{
            scope.row[column.prop]
          }}</span>
          <!-- 对象数组数据 -->
          <span v-if="column.type === 'objectList'">\{{
            formatList(
              scope.row[column.prop],
              column.propData,
              column.anotherLabel
            )
          }}</span>
          <!-- switch开关 -->
          <el-switch
            v-else-if="column.type === 'switch'"
            v-model="scope.row[column.prop]"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
          <!-- 根据字段大于0，进行判断格式化显示 -->
          <template slot-scope="scope" v-else-if="column.type === 'format'">
            \{{
              scope.row[column.prop] > 0
                ? '已' + column.label.slice(0, 2)
                : '未' + column.label.slice(0, 2)
            }}
          </template>
          <!-- 根据字段是否存在，进行判断格式化显示 -->
          <template slot-scope="scope" v-else-if="column.type === 'formatNull'">
            \{{
              scope.row[column.prop]
                ? '已' + column.label.slice(0, 2)
                : '未' + column.label.slice(0, 2)
            }}
          </template>
          <!-- progress进度条 -->
          <template slot-scope="scope" v-else-if="column.type === 'progress'">
            <el-progress
              :class="{ redBackground: scope.row[column.prop] == 1 }"
              status="success"
              :text-inside="true"
              :percentage="formatPercentage(scope.row[column.progressValue])"
              :stroke-width="20"
            ></el-progress>
          </template>
          <!-- 带鼠标移入的progress进度条 -->
          <template
            slot-scope="scope"
            v-else-if="column.type === 'progressWithPop'"
          >
            <el-popover trigger="hover" placement="top">
              <p
                style="white-space: pre-line"
                v-for="(item, key) in column.propData"
                :key="key"
              >
                \{{
                  item.key +
                  ':' +
                  (scope.row[item.value] ? scope.row[item.value] : '')
                }}
              </p>
              <div slot="reference" class="name-wrapper">
                <processBar
                  :processValue="processValue(scope.row)"
                ></processBar>
              </div>
            </el-popover>
          </template>
          <!-- 超链接 -->
          <router-link
            v-else-if="column.type === 'router-link'"
            :to="column.to + scope.row[column.router]"
            class="link-type"
          >
            <span>\{{ scope.row[column.prop] }}</span>
          </router-link>
          <!-- 图标 -->
          <template v-else-if="column.type === 'icon'" slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon" />
          </template>
          <!-- 日期格式化 -->
          <span
            v-if="['datetime', 'date', 'month', 'year'].includes(column.type)"
          >
            \{{ parseTime(scope.row[column.prop], formatTime(column.type)) }}
            \{{
              scope.row[column.prop] || scope.row[column.props]
                ? column.connector
                : ''
            }}
            \{{ parseTime(scope.row[column.props], formatTime(column.type)) }}
          </span>
          <!-- 字典格式化/翻译：单个数据 -->
          <span v-if="column.type === 'dict-data'">
            \{{ selectDictLabel(column.options, scope.row[column.prop]) }}
          </span>
          <!-- 字典格式化/翻译：多个数据 -->
          <span v-if="column.type === 'dict-data-multiple'">
            \{{
              selectDictLabelMultiple(column.options, scope.row[column.prop])
            }}
          </span>
          <!-- 字典格式化/翻译（以tag标签样式显示）-->
          <span v-if="column.type === 'dict-data-tag'">
            <el-tag
              size="medium"
              :class="
                column.tagInfo.tags.color
                  ? column.tagInfo.tags.color[scope.row[column.tagInfo.prop]]
                  : ''
              "
              :effect="column.effect ? column.effect : 'light'"
              :type="
                column.tagInfo.tags.type
                  ? column.tagInfo.tags.type[scope.row[column.tagInfo.prop]]
                  : ''
              "
              v-if="column.tagInfo.tags.color || column.tagInfo.tags.type"
              >\{{ selectDictLabel(column.options, scope.row[column.prop]) }}
            </el-tag>
            <el-tooltip
              v-else
              class="item"
              effect="dark"
              :content="scope.row[column.tooltips]"
              placement="top-start"
            >
              <el-tag
                size="medium"
                :class="
                  column.tagInfo.tips.color[scope.row[column.tagInfo.prop]]
                "
                >\{{
                  selectDictLabel(column.options, scope.row[column.prop])
                }}</el-tag
              >
            </el-tooltip>
          </span>
          <!-- 父组件传值（以tag标签样式显示）-->
          <span v-if="column.type === 'tag'">
            <el-tag size="medium" :class="scope.row['tagColor']"
              >\{{ scope.row['tagName'] }}
            </el-tag>
          </span>
          <!-- select选择框 -->
          <div class="item" v-if="column.type === 'select'">
            <div class="item__text">
              <a style="color: #66b1ff; text-decoration: underline">\{{
                scope.row[column.prop]
              }}</a>
            </div>
            <el-select
              v-model="scope.row[column.prop]"
              :multiple="column.multiple ? column.multiple : false"
              :placeholder="
                column.placeholder
                  ? column.placeholder
                  : '请选择' + column.label
              "
              class="item__input"
              :clearable="
                typeof column.clearable === 'undefined'
                  ? false
                  : column.clearable
              "
              @change="changeSelect(column, scope.row[column.prop])"
            >
              <el-option
                v-for="(item, index) in column.options"
                :key="index"
                :label="item.label || item.dictLabel || item.classDictName"
                :value="item.value || item.dictValue || item.classDictCode"
                style="overflow: hidden"
              >
                <span>
                  \{{ item.label || item.dictLabel || item.classDictName }}
                </span>
              </el-option>
            </el-select>
          </div>
          <!-- 元转换成万元并且保留两位小数 -->
          <span v-if="column.type === 'conversion'">\{{
            scope.row[column.prop]
              ? $math.divide(scope.row[column.prop], 10000).toFixed(2)
              : '0.00'
          }}</span>
          <!-- 百分比显示 -->
          <span v-if="column.type === 'percentage'"
            >\{{ scope.row[column.prop] ? parseInt(scope.row[column.prop] * 100) : '0' }}%</span
          >
        </template>
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
          <span v-if="scope.row.viewBtn.length > 0">
            <span v-for="(btn, idx) in scope.row.viewBtn">
              <el-button
                v-if="!btn.children"
                :key="idx"
                size="mini"
                type="text"
                :icon="btn.icon"
                @click="buttonFun(btn, scope.row)"
                >\{{ btn.label }}</el-button
              >
              <span v-else>
                <el-dropdown
                    placement="left"
                    :key="idx + 100"
                  >
                    <span>\{{ btn.label }}</span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="(subBtn, ids) in btn.children"
                        :key="ids"
                        @click.native="buttonFun(subBtn, scope.row)"
                        >\{{ subBtn.label }}</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
              </span>
            </span>
          </span>
          <el-dropdown
            placement="bottom"
            trigger="click"
             v-if="scope.row.moreBtn.length > 0"
          >
            <span class="el-dropdown-link"
              >更多<i class="el-icon-arrow-down el-icon--right"></i
            ></span>
            <el-dropdown-menu slot="dropdown">
              <div v-for="(btn, idx) in scope.row.moreBtn" :key="idx">
                <el-dropdown-item
                  v-if="!btn.children"
                  @click.native="buttonFun(btn, scope.row)"
                  >\{{ btn.label }}</el-dropdown-item
                >
                <el-dropdown-item
                  v-else
                >
                  <el-dropdown
                    placement="left"
                    :key="idx + 100"
                    :disabled="
                      handleDisabled(btn, scope.row) ||
                      scope.row[btn.fun] ||
                      false
                    "
                  >
                    <span>\{{ btn.label }}</span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="(subBtn, ids) in btn.children"
                        :key="ids"
                        @click.native="buttonFun(subBtn, scope.row)"
                        >\{{ subBtn.label }}</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
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
 * 表格+分页条组件
 * 功能：
 * 1、展示表格数据，包括普通和级联树形数据展示
 * 2、根据分页条页码查询表格数据
 * 3、支持展示的字段类型（type）包括：普通文本（text）、对象数组数据（objectList）、switch开关（switch）、
 *    根据字段大于0，进行判断格式化显示（format）、根据字段是否存在，进行判断格式化显示（formatNull）、
 *    progress进度条(progress)、带鼠标移入的progress进度条（progressWithPop）、超链接（router-link）、
 *    图标（icon）、日期格式化（datetime, date, month, year）、字典格式化/翻译：单个数据（dict-data）、
 *    字典格式化/翻译：多个数据（dict-data-multiple）、字典格式化/翻译（以tag标签样式显示）（dict-data-tag）、
 *    父组件传值（以tag标签样式显示）（tag）、select选择框（select）、元转换成万元并且保留两位小数（conversion）、
 *    百分比显示（percentage）、自定义节点内容的el-tree（el-tree）、树形选择器（tree-select）、
 *    上传单张图片，以图片方式展示（avatar-uploader）、上传单个文件,一般是证书等照片 （file）、按钮（button）、
 *    自定义插槽字段（tableExpand）
 */
import { math as $math } from '../../utils/math'
import ProcessBar from '../../components/ProcessBar'
import { scrollTo } from '../../utils/scroll-to'

export default {
  name: 'TabelPanel',
  components: { ProcessBar },
  props: {
    //表格数据
    tableData: {
      type: Array,
      default: () => []
    },
    // 表格字段集合
    tableColumns: {
      type: Array,
      default: () => []
    },
    // 是否展示展开行功能
    showExpand: {
      type: Boolean,
      default: false
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
      type: Number,
      default: 1
    },
    // 每页数据条数
    pageSize: {
      type: Number,
      default: 1
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
    // 设置需要显示的内容，用逗号分隔，布局元素会依次显示。
    // prev:上一页，next:下一页，pager:页码列表，jumper:跳页元素，total:总条目数，sizes:设置每页显示的页码数量
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    // 为分页按钮添加背景色
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
    }
  },
  data() {
      return {
        // 表格数据
        tableList: []
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
    },
    // 数学计算
    $math() {
      return $math
    }
  },
  watch: {
    /**
     * 监听表格数据变化，更新操作列按钮
     */
    tableData: {
      deep: true,
      handler(){
        this.setTableDate()
      }
    }
  },
  created(){
    //表格数据中增加操作按钮数据
    this.setTableDate()
  },
  methods: {
    /**
     * 表格数据中增加操作按钮数据
     */
    setTableDate() {
      let that=this
      this.tableList = JSON.parse(JSON.stringify(this.tableData))
      //全部按钮
      let allShowBtn = []
      //操作列普通按钮
      let viewBtnList = []
      //操作列更多中的按钮
      let moreBtnList = []
      this.tableList.forEach((row,index) => {
        if (this.buttonList && Array.isArray(this.buttonList)) {
          allShowBtn=this.getAllShowBtn(row)
          if (allShowBtn.length > 2) {
            viewBtnList = [allShowBtn[0]]
            moreBtnList = allShowBtn.slice(1,allShowBtn.length)
          } else {
            viewBtnList = allShowBtn
            moreBtnList = []
          }
        } else {
          viewBtnList = []
          moreBtnList = []
        }
        that.tableList[index].viewBtn = viewBtnList
        that.tableList[index].moreBtn = moreBtnList
      })
    },
    /**
     * 获取所有可显示的按钮
     * allShowBtn：获取所有可显示的按钮
     *  |-> row(Array): 表格行数据
     */
    getAllShowBtn(row) {
      let that=this
      let allShowBtn = []
      this.buttonList.forEach(btn => {
        if (!btn.children) {
          if (
            (btn.ifShow
              ? btn.ifShow.value.includes(row[btn.ifShow.prop])
              : true) &&
            (row[btn.funShow] !== undefined ? row[btn.funShow] : true) &&
            that.handleShow(btn, row) &&
            that.hasPermi(btn.permission || [])
          ) {
            allShowBtn.push(btn)
          }
        } else {
          let index = 0
          btn.children.forEach(btnChild => {
            if (
              (btnChild.ifShow
                ? btnChild.ifShow.value.includes(row[btnChild.ifShow.prop])
                : true) &&
              (row[btnChild.funShow] !== undefined
                ? row[btnChild.funShow]
                : true) &&
              that.handleShow(btnChild, row) &&
              that.hasPermi(btnChild.permission || [])
            ) {
              index=1
            }
          })
          if(index == 1){
            allShowBtn.push(btn)
          }
        }
      })
      return allShowBtn
    },
    /**
     * 二次封装的组件暴露组件实例，利用实例再调用element内部的方法
     * @returns {Object} 返回表格
     */
    getTable() {
      return this.$refs.table
    },
    /**
     * 修改数据状态
     * @param {Object} row 行数据
     */
    handleStatusChange(row) {
      this.$emit('handleStatusChange', row)
    },
    /**
     * 按钮点击方法
     * @param {Object} button 当前按钮
     * @param {Object} row 行数据
     */
    buttonFun(button, row) {
      this.$emit(button.fun, row, button.options)
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
    formatProp(child, row) {
      return row.deptShortName
    },
    /**
     * 按钮禁用方法
     * @param {Object} btn 父组件传值按钮配置数据
     * @param {Object} row 行数据
     */
    handleDisabled(btn, row) {
      let disabled = false

      if (btn.disabled) {
        btn.disabled.forEach(item => {
          // 通过字段设置的条件和字段值判断按钮是否可用
          if (item.value) {
            disabled =
              item.relationship === 'add'
                ? disabled && item.value.indexOf(row[item.prop]) !== -1
                : disabled || item.value.indexOf(row[item.prop]) !== -1
          } else {
            disabled =
              item.relationship === 'add'
                ? disabled && row[item.prop]
                : disabled || row[item.prop]
          }
        })
      }

      return disabled
    },
    /**
     * 按钮显示方法
     * @param {Object} btn 父组件传值按钮配置数据
     * @param {Object} row 行数据
     */
    handleShow(btn, row) {
      let show = false
      if (btn.show) {
        btn.show.forEach(item => {
          // 通过字段设置的条件和字段值判断按钮是否显示
          if (item.value) {
            show =
              item.relationship === 'add'
                ? show && item.value.indexOf(row[item.prop]) !== -1
                : show || item.value.indexOf(row[item.prop]) !== -1
          } else {
            show =
              item.relationship === 'add'
                ? show && row[item.prop]
                : show || row[item.prop]
          }
        })
      } else {
        show = true
      }
      return show
    },
    /**
     * 日期格式化
     **/
    formatTime(type) {
      if (type === 'datetime') {
        return '{y}-{m}-{d} {h}:{i}:{s}'
      } else if (type === 'date') {
        return '{y}-{m}-{d}'
      } else if (type === 'month') {
        return '{y}-{m}'
      } else if (type === 'year') {
        return '{y}'
      }
    },
    /**
     * 字典格式化/翻译：多个数据
     **/
    selectDictLabelMultiple(option, val) {
      if (val && val !== '') {
        const arr = val.split(',') // 将字符串分割成数组
        return arr.map(item => this.selectDictLabel(option, item)).join('/')
      } else {
        return ''
      }
    },
    /**
     * 多选框禁用方法
     */
    selectDisable(row) {
      if (row.isDisabled) {
        return !row.isDisabled
      } else {
        return true
      }
    },
    /**
     * 下拉框选项变化触发事件
     * @param {Object} field 字段属性
     * @param {String} value 字段值
     */
    changeSelect(field, value) {
      if (field.click !== undefined) {
        this.$emit(field.click, value)
      }
    },
    /**
     * 传入的数据为对象数组，需要进行格式化
     * 有值处理数据，无值返回传入的label
     * prop为数组，存储需要处理的数据字段和数量字段
     */
    formatList(data, prop, label) {
      if (data == null) {
        return label
      }
      let stringResident = ''
      data.forEach((el, index) => {
        if (data.length - index != 1) {
          stringResident += el[prop[0]] + '(' + el[prop[1]] + ')' + '、'
        } else {
          stringResident += el[prop[0]] + '(' + el[prop[1]] + ')'
        }
      })
      return stringResident
    },
    /**
     * 格式化数据（*100）
     */
    formatPercentage(progressValue) {
      if (progressValue) {
        if (progressValue <= 1) {
          return Number((progressValue * 100).toFixed(2))
        } else {
          return 100
        }
      } else {
        return 0
      }
    },
    /**
     * 进度条
     */
    processValue(row) {
      let progressVal = row.progress
        ? parseFloat((row.progress * 100).toFixed(2))
        : 0
      let newProgressVal = row.newProgress
        ? parseFloat((row.newProgress * 100).toFixed(2))
        : 0
      return [progressVal, newProgressVal]
    },
    /**
     * 判断按钮权限
     */
    hasPermi(value) {
      let show = true
      const permissions = this.$store.getters && this.$store.getters.permissions
      if (value && value instanceof Array && value.length > 0) {
        const permissionFlag = value
        let index = permissions.findIndex(
          permission => permission && permissionFlag.includes(permission) !== -1
        )
        if(index !== -1){
          show=true
        }else{
          show=false
        }
      }
      return show
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tag{
  background-color: #fff;
  border: none;
}
#table-panel {
  width: 100%;
}
.el-dropdown:not(.el-dropdown-menu__item .el-dropdown) {
  padding-left: 10px;
  font-size: 12px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #4eb0f3;
}
.el-icon-arrow-down {
  font-size: 12px;
  margin-left: 5px;
}
.greenTag {
  background-color: rgba(49, 170, 79, 1);
  color: white;
}

.blueTag {
  background-color: rgba(68, 166, 253, 1);
  color: white;
}

.yellowTag {
  background-color: rgba(248, 185, 76, 1);
  color: white;
}
.redTag {
  background-color: rgba(243, 67, 67, 0.98);
  color: white;
}
.redText {
  color: red;
}
::v-deep .name-wrapper > div {
  display: block !important;
}
::v-deep .name-wrapper > div .pB_Container {
  width: calc(100% - 105px);
  float: left;
}
::v-deep .name-wrapper > div .shouldNum {
  width: 50px;
  float: left;
}
::v-deep .name-wrapper > div .brownNum {
  width: 50px;
  float: left;
}
::v-deep .redBackground .el-progress-bar__outer {
  background-color: rgba(255, 0, 0, 0.3) !important;
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
