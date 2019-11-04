<template>
  <div class="order">
    <h2>订单管理</h2>
    <!-- 按钮 -->
    <div class="btns">
      <el-button type="primary" size="small" @click="toAddHandler">添加</el-button>
      <el-button type="danger" size="small" @click="batchDeleteHandler">批量删除</el-button>
    </div>
    <!-- 表单 -->
    <el-dialog :title="title" :visible.sync="visible" @close="dialogCloseHandler">
      <el-form ref="orderForm" :model="form" :rules="rules">
        <el-form-item label="栏目名称" label-width="80px" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="序号" label-width="80px" prop="num">
          <el-input v-model="form.num" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeModal">取 消</el-button>
        <el-button type="primary" size="small" @click="submitHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table :data="orders" size="small" @selection-change="idsChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="orderTime" label="下单时间" />
      <el-table-column prop="total" label="数量" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作" width="100px" align="center">
        <template #default="record">
          <a href="" class="el-icon-delete" @click.prevent="deleteHandler(record.row.id)" /> &nbsp;
          <a href="" class="el-icon-edit-outline" @click.prevent="editHandler(record.row)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      ids: [],
      form: {},
      rules: {
        name: [
          { required: true, message: '请输入栏目名称', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入序号', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.findAllorders()
  },
  computed: {
    ...mapState('order', ['orders', 'visible', 'title']),
    ...mapGetters('order', ['countorders', 'orderstatusFilter'])
    // 普通属性

  },
  methods: {
    ...mapActions('order', ['findAllorders', 'deleteorderById', 'saveOrUpdateorder', 'batchDeleteorder']),
    ...mapMutations('order', ['showModal', 'closeModal', 'setTitle']),
    // 普通方法
    batchDeleteHandler() {
      this.batchDeleteorder(this.ids)
        .then((response) => {
          this.$message({ type: 'success', message: response.statusText })
        })
    },
    idsChangeHandler(val) {
      this.ids = val.map(item => item.id)
    },
    dialogCloseHandler() {
      this.$refs.orderForm.clearValidate()
    },
    toAddHandler() {
      this.form = {}
      this.setTitle('添加订单信息')
      this.showModal()
    },
    submitHandler() {
      // 1.表单验证
      this.$refs.orderForm.validate((valid) => {
        if (valid) {
          // 2.提交表单
          this.saveOrUpdateorder(this.form)
            .then((response) => {
              this.$message({ type: 'success', message: response.statusText })
            })
        } else {
          return false
        }
      })
    },
    deleteHandler(id) {
      const promise = this.deleteorderById(id)
      promise.then((response) => {
        this.$message({ type: 'success', message: response.statusText })
      })
    },
    editHandler(row) {
      this.form = row
      this.setTitle('修改订单信息')
      this.showModal()
    }
  }

}
</script>
<style scoped>

</style>
