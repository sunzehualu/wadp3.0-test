<template>
  <el-dialog
    class="selectDialog"
    :title="title"
    :visible.sync="showDialog"
    :append-to-body="true"
    :close-on-click-modal="false"
    :width="dialogWidth"
    @opened="opened"
    @close="closed"
  >
    <div class="dialogLeft" style="display: inline-block">
      <el-input
        style="padding: 20px 0px 10px 0px"
        v-model="inputValue"
        placeholder="请输入"
        @input="searchValue"
      />
      <!-- 此处添加插槽 -->
      <slot name="treeSlot"></slot>
      <!-- 树 -->
      <div style="height: 370px; width: 350px; overflow: auto">
        <el-tree
          :lazy="lazy"
          ref="trees"
          :class="{ 'tree-border': !type }"
          node-key="value"
          empty-text="暂无数据"
          :load="loadNode"
          :data="treeOptions"
          :show-checkbox="true"
          :props="defaultProps"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          :default-checked-keys="treekeydata"
          :default-expand-all="!lazy"
          :check-strictly="!formDialog.deptCheckStrictly"
          @check="changeCascader"
          @check-change="checkChange"
        >
        </el-tree>
      </div>
    </div>
    <!-- 中间分割线 -->
    <template>
      <el-divider
        class="empDriver"
        direction="vertical"
        v-if="type"
      ></el-divider>
    </template>
    <!-- 右侧已选数据列表 -->
    <div
      class="dialogRight"
      style="display: inline-block; vertical-align: top; padding-top: 20px"
      v-if="type"
    >
      <el-row>
        <span style="font-size: 13px">已选择的成员</span>
      </el-row>
      <el-row style="padding-top: 15px; height: 370px; overflow: auto">
        <el-table :show-header="false" :data="selectList" empty-text="无数据">
          <el-table-column align="left" width="180">
            <template slot-scope="scope">
              <i class="el-icon-user"></i>
              <span style="margin-left: 10px">\{{ scope.row.label }}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" width="30">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-close"
                @click="handleDelete(scope.$index, scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
    <!--父子联动复选框， 确定、删除按钮 -->
    <span slot="footer">
      <el-checkbox
        v-show="pcBoxShow"
        style="float: left"
        v-model="formDialog.deptCheckStrictly"
        >父子联动</el-checkbox
      >
      <el-button type="primary" @click="dialogSub">确 定</el-button>
      <el-button @click="dialogCancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
/**
 * 树形选择器
 * 功能：
 *   1、用清晰的层级结构展示信息，可展开或折叠
 *   2、可对树中数据进行检索并显示结果
 *   3、树的数据可懒加载，也可一次性展示
 *   4、可设置父子联动
 *   5、可在树右侧同步显示已选数据列表
 */

export default {
  data() {
    return {
      //dialog右侧存放表单
      selectList: [],
      //指定标签节点的名称
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'isLeaf'
      },
      //表单
      formDialog: {},
      //搜索框绑定
      inputValue: ''
    }
  },
  props: {
    // 是否懒加载
    lazy: {
      type: Boolean,
      default: true
    },
    // 弹窗宽度
    dialogWidth: {
      default: '700px',
      type: String
    },
    // 树形选择器样式
    type: {
      type: Boolean,
      default: false
    },
    // 树形结构数据
    treeOptions: {
      type: Array,
      default: () => []
    },
    // 用于dialog显示隐藏
    show: {
      type: Boolean,
      default: false
    },
    // 树是否单选
    isSingle: {
      type: Boolean,
      default: false
    },
    // 默认勾选key
    treekeydata: {
      type: Array,
      default: () => []
    },
    // 默认选中数据集合
    selectedData: {
      type: Array,
      default: () => []
    },
    // 是否显示父子联动
    pcBoxShow: {
      type: Boolean,
      default: false
    },
    // 弹窗标题
    title: {
      type: String,
      default: null
    }
  },
  computed: {
    // dialog打开与关闭
    showDialog: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      }
    }
  },
  watch: {
    /**
     * 监听是否打开弹窗,打开弹窗时重置相关数据
     */
    showDialog(val) {
      if (val) {
        this.resetDialog()
      }
    }
  },
  methods: {
    /**
     * 节点选中状态发生变化时的回调
     */
    checkChange(node, flag) {
      // 右侧数据列表
      if (this.type === true) {
        let index = undefined
        let select = this.selectList.find((selected, idx) => {
          if (selected.value === node.value) {
            index = idx
          }
          return selected.value === node.value
        })
        if (flag && select === undefined && node.isLeaf == true) {
          if (this.isSingle === true) {
            //单选
            this.$refs.trees.setCheckedKeys([node.value])
            this.selectList = [node]
          } else {
            //多选
            this.selectList.push({
              label: node.label,
              value: node.value
            })
          }
        } else if (!flag && index !== undefined) {
          this.selectList.splice(index, 1)
        }

        this.$nextTick(() => {
          // 遍历所有数据，将同value的数据都设置成与当前节点相同的状态
          let nodes = this.$refs.trees.getNode(this.treeOptions[0].value)
          this.setChecked(nodes, node.value, flag)
        })
      }
    },
    /**
     * 遍历所有数据，将同value的数据都设置成与当前节点相同的状态
     */
    setChecked(node, value, flag) {
      // 同一用户可能属于多个部门，选中/取消选中操作时，将所有同value数据都同步状态
      if (node && node !== null && node.data.value === value) {
        node.checked = flag
      }
      node &&
        node !== null &&
        node.childNodes &&
        node.childNodes.forEach(node => {
          this.setChecked(node, value, flag)
        })
    },
    /**
     * 右侧table删除按钮
     */
    handleDelete(index) {
      this.selectList.splice(index, 1)
      const keyValue = this.selectList.map(item => item.value)
      this.$refs.trees.setCheckedKeys(keyValue)
    },
    /**
     * load方法
     */
    loadNode(node, resolve) {
      this.$nextTick(() => {
        if (this.lazy === true) {
          this.$emit('load', node, resolve)
        }
      })
    },
    /**
     * 搜索数据
     */
    searchValue() {
      this.$nextTick(() => {
        if (
          this.inputValue &&
          this.inputValue !== '' &&
          this.inputValue !== null
        ) {
          if (this.lazy) {
            //关闭懒加载
            this.$refs.trees.$data.store.lazy = false
            //全部展开
            this.$refs.trees.$data.store.defaultExpandAll = true
            this.$emit('search', this.inputValue)
          } else {
            this.$refs.trees.filter(this.inputValue)
          }
        } else {
          if (this.lazy) {
            //打开懒加载
            this.$refs.trees.$data.store.lazy = true
            //全部关闭
            this.$refs.trees.$data.store.defaultExpandAll = false
            this.$emit('search', this.inputValue)
          } else {
            this.$refs.trees.filter(this.inputValue)
          }
        }
      })
    },
    /**
     * 节点过滤事件
     */
    filterNode(val, data) {
      //1.默认返回true
      let flag = true
      //2.按名字过滤
      if (data.label == undefined || (val && data.label.indexOf(val) === -1)) {
        flag = false
      }
      return flag
    },
    /**
     * 确定按钮 提交selectList
     */
    dialogSub() {
      if (this.type === true) {
        this.$refs.trees.$data.store.lazy = true
        this.$refs.trees.$data.store.defaultExpandedKeys = []
        this.$emit('submit', this.selectList)
      } else {
        //选中的节点
        let checkedNodes = this.$refs.trees.getCheckedNodes()
        this.$emit('submit', checkedNodes)
      }
    },
    /**
     * 取消按钮
     */
    dialogCancel() {
      if (this.lazy === true) {
        this.$refs.trees.$data.store.lazy = true
      }
      this.$refs.trees.$data.store.defaultExpandedKeys = []
      this.$emit('close')
    },
    /**
     * 弹出框打开回调方法,给右侧赋值
     */
    opened() {
      if (this.type === true) {
        if (this.selectList.length == 0) {
          let rData = this.selectedData.map(item =>
            item && item.label ? { label: item.label, value: item.value } : []
          )
          for (let item of rData) {
            if (item.length !== 0) {
              this.selectList.push(item)
            }
          }
        }
      } else {
        this.$refs.trees.setCheckedKeys(this.treekeydata)
      }
    },
    /**
     * 弹出框关闭回调方法
     */
    closed() {
      this.inputValue = ''
    },
    /**
     * 重置组件
     */
    resetDialog() {
      this.selectList = []
      this.inputValue = ''
    },
    /**
     * 当复选框被点击的时候触发(当前节点,已选中的节点)
     */
    changeCascader(currentNode, checkedNode) {
      // el-tree不支持单选，这里特殊处理一下
      if (this.isSingle && this.type === false) {
        if (checkedNode.checkedNodes.length > 0) {
          this.$refs.trees.setCheckedNodes([currentNode])
        } else {
          this.$refs.trees.setCheckedNodes([])
        }
      }
    }
  }
}
</script>

<style scoped>
.selectDialog >>> .el-table {
  min-width: 100%;
}
.selectDialog >>> .el-table__row > td {
  border: none;
  padding: 0;
}
.selectDialog >>> .el-table .cell {
  padding: 0;
}
.el-divider--vertical {
  display: inline-block;
  width: 1px;
  height: 31em;
  margin: 0 32px;
  position: relative;
  vertical-align: baseline;
}
.selectDialog >>> .el-dialog__body {
  padding: 0 30px 0 30px;
  padding-left: 35px;
}
.selectDialog >>> .el-dialog__footer {
  border-top: 1px solid gainsboro;
}

.selectDialog >>> .el-input--medium .el-input__inner {
  width: 330px;
  height: 32px;
}

.selectDialog ::v-deep .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
::v-deep .el-table__empty-block {
  min-height: 0px !important;
}
.el-table::before {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0px;
}
.tree-border {
  margin-top: 5px;
  border: 1px solid #e5e6e7;
  background: #ffffff none;
  border-radius: 4px;
  height: 350px;
  overflow: auto;
}
</style>
