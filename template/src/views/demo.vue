<template>
  <div class="app-container">
    <!-- 搜索条件 -->
    <base-form
      ref="queryForm"
      :form-attr="searchFormAttr"
      :model="queryParams"
      :formData="queryParams"
      label-width="90px"
      v-show="showSearch"
      :searchForm="true"
      size="small"
    >
      <template slot="formItem">
        <el-form-item class="searchStyle" label-width="15px">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </template>
    </base-form>

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:file:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:file:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:file:remove']"
          >删除</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <!-- 数据列表 -->
    <table-panel
      v-loading="loading"
      row-key="id"
      :total="total"
      :data="dataList"
      :buttonList="buttonList"
      :showPagination="total > 0"
      :tableColumns="tableColumns"
      :pageNum.sync="queryParams.pageNum"
      :pageSize.sync="queryParams.pageSize"
      @pageChange="getList"
      @handleAdd="handleAdd"
      @handleUpdate="handleUpdate"
      @handleDelete="handleDelete"
      @selection-change="handleSelectionChange"
    />

    <!-- 添加或修改上传文件信息对话框 -->
    <el-drawer
      :title="title"
      :visible.sync="open"
      append-to-body
      size="auto"
      :wrapperClosable="false"
    >
      <div class="drawer__content">
        <base-form
          ref="info-form"
          :form-attr="formAttr"
          :model="form"
          :formData="form"
          :rules="rules"
          label-width="80px"
        />
        <div class="drawer-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
/**
 * 文件信息
 * 功能：
 *   显示文件信息列表
 */
import { listDemo, getDemo, delDemo, addDemo } from '@/api/system/demo'
import BaseForm from '@/components/Form/base-form.vue'
import TablePanel from '@/components/TablePanel/table-panel.vue'

export default {
  name: 'File',
  components: { BaseForm, TablePanel },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 示例信息表格数据
      dataList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        fileName: null,
        filePath: null,
        fileType: null,
        fileSize: null,
        version: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      // 表格列头集合
      tableColumns: [
        {
          prop: 'username',
          label: '姓名',
          type: 'text',
          align: 'center'
        },
        {
          label: '年龄',
          prop: 'age',
          type: 'text',
          align: 'center'
        }
      ],
      // 表格按钮集合
      buttonList: [
        {
          label: '修改',
          icon: 'el-icon-edit',
          permission: ['test:edit'],
          fun: 'handleUpdate'
        },
        {
          label: '删除',
          icon: 'el-icon-delete',
          permission: ['test:remove'],
          fun: 'handleDelete'
        }
      ],
      // 新增、编辑数据表单字段配置
      formAttr: [
        {
          prop: 'username',
          label: '姓名',
          type: 'text',
          placeholder: '请输入姓名',
          clearable: true
        },
        {
          prop: 'age',
          label: '年龄',
          type: 'number',
          placeholder: '请输入年龄',
          min: 0,
          controlsPosition: 'right'
        }
      ],
      //搜索表单字段配置
      searchFormAttr: [
        {
          prop: 'username',
          label: '姓名',
          type: 'text',
          placeholder: '请输入姓名',
          clearable: true
        },
        {
          prop: 'age',
          label: '年龄',
          type: 'number',
          placeholder: '请输入年龄',
          min: 0,
          controlsPosition: 'right'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询上传文件信息列表 */
    getList() {
      this.loading = true
      listDemo(this.queryParams)
        .then(response => {
          this.dataList = response.rows
          this.total = response.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        fileName: null,
        filePath: null,
        fileType: null,
        fileSize: null,
        version: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.$refs['queryForm'].$refs.form.resetFields()
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加测试信息'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getDemo(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改测试信息'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['info-form'].$refs['form'].validate(valid => {
        if (valid) {
          addDemo(this.form).then(() => {
            this.msgSuccess('新增成功')
            this.open = false
            this.getList()
          })
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const demoIds = row.id || this.ids
      this.$confirm(
        '是否确认删除测试信息编号为"' + demoIds + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function () {
          return delDemo(demoIds)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
    }
  }
}
</script>
