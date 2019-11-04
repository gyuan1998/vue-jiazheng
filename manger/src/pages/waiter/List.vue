<template>
  <div class="waiter">
    <el-row>
      <!-- 左侧按钮 -->
      <!-- {{params}} -->
      <el-col :span="18">
        <el-button size="small" type="primary" @click="toAddHandler">添加</el-button>
        <el-button size="small" type="danger" @click="batchDeleteHandler">批量删除</el-button>
      </el-col>
      <!-- 右侧搜索 -->
      <el-col :span="6">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="params.name" placeholder="请输入关键字" />
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="success" @click="loadData">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <!-- {{waiters}} -->
    <div v-loading="loading">
      <el-table :data="waiters.list" size="mini" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="编号" />
        <el-table-column prop="realname" label="员工姓名" />
        <el-table-column prop="gender" label="性别" />
        <el-table-column prop="score" label="分数" />
        <el-table-column prop="status" label="状态" />
        <!-- <el-table-column prop="photo" label="预览"></el-table-column> -->
        <el-table-column prop="registerTime" label="注册时间" />
        <el-table-column label="操作">
          <template #default="record">
            <i class="el-icon-delete" href="" @click.prevent="deleteHandler(record.row.id)" /> &nbsp;
            <i class="el-icon-edit-outline" href="" @click.prevent="editHandler(record.row)" /> &nbsp;
            <a href="" @click.prevent="toDetailsHandler(record.row)">详情</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" @close="dialogCloseHandler">
      <!-- {{waiter}} -->
      <el-form ref="waiterForm" :model="waiter" :rules="rules">
        <el-form-item label="员工姓名" label-width="100px" prop="realname">
          <el-input v-model="waiter.realname" auto-complete="off" />
        </el-form-item>
        <el-form-item label="性别" label-width="100px" prop="gender">
          <el-input v-model="waiter.gender" auto-complete="off" />
        </el-form-item>
        <el-form-item label="描述" label-width="100px" prop="description">
          <el-input v-model="waiter.description" type="textarea" :rows="2" placeholder="请输入内容" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeModal">取 消</el-button>
        <el-button size="small" type="primary" @click="submitHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination
      layout="prev, pager, next"
      :current-page="params.page+1"
      :page-size="waiters.pageSize"
      :total="waiters.total"
      @current-change="pageChangeHandler"
    />
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      waiter: {},
      ids: [],
      rules: {
        name: [
          { required: true, message: '请输入员工名称', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入性别', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 映射
    ...mapState('waiter', ['waiters', 'visible', 'title', 'loading', 'params', 'categories']),
    ...mapGetters('waiter', ['orderWaiter', 'waiterSize'])
  },
  created() {
    this.loadData()
    this.loadCategoryData()
  },
  methods: {
    // 映射
    ...mapMutations('waiter', ['showModal', 'closeModal', 'setTitle', 'pageChange']),
    ...mapActions('waiter', ['queryWaiters', 'categoriesData', 'deleteWaiterById', 'saveOrUpdateWaiter', 'batchDeleteWaiter']),
    // 普通方法
    toDetailsHandler(waiter) {
      // 跳转到详情页面
      this.$router.push({
        path: '/waiter/details',
        query: { id: waiter.id }
      })
    },
    toAddHandler() {
      // 1. 重置表单
      this.waiter = {}
      this.setTitle('添加员工信息')
      // 2. 显示模态框
      this.showModal()
    },
    submitHandler() {
      // 校验
      this.$refs.waiterForm.validate((valid) => {
        // 如果校验通过
        if (valid) {
          const promise = this.saveOrUpdateWaiter(this.waiter)
          promise.then((response) => {
            // promise为action函数的返回值，异步函数的返回值就是promise的then回调函数的参数
            this.$message({ type: 'success', message: response.statusText })
          })
        } else {
          return false
        }
      })
    },
    loadData() {
      this.queryWaiters()
    },
    loadCategoryData() {
      this.categoriesData()
    },
    pageChangeHandler(currentPage) {
      this.pageChange(currentPage)
      this.loadData()
    },
    handleSelectionChange(val) {
      this.ids = val.map(item => item.id)
    },
    dialogCloseHandler() {
      this.$refs.waiterForm.resetFields()
    },
    editHandler(row) {
      this.waiter = row
      this.setTitle('修改员工信息')
      this.showModal()
    },
    deleteHandler(id) {
      this.deleteWaiterById(id)
        .then((response) => {
          this.$message({ type: 'success', message: response.statusText })
        })
    },
    batchDeleteHandler() {
      this.batchDeleteWaiter(this.ids)
        .then((response) => {
          this.$message({ type: 'success', message: response.statusText })
        })
    }
  }
}
</script>
