<template>
  <div class="category">
    <h2>栏目管理</h2>
    <!-- 按钮 -->
    <div class="btns">
      <el-button type="primary" size="small" @click="toAddHandler">添加</el-button>
      <el-button type="danger" size="small" @click="batchDeleteHandler">批量删除</el-button>
    </div>
    <!-- 输入框 -->
    <div class="search">
      <el-input placeholder="请输入关键字" v-model="params.name" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="queryCategories"></el-button>
      </el-input>
    </div>
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" @close="dialogCloseHandler">
      <el-form ref="categoryForm" :model="form" :rules="rules">
        <el-form-item label="栏目名称" label-width="80px" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="序号" label-width="80px" prop="num">
          <el-input v-model="form.num" autocomplete="off" />
        </el-form-item>
        <el-form-item label="父栏目" label-width="80px" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择">
            <el-option
              v-for="ad in allCategories"
              :key="ad.id"
              :label="ad.parentId"
              :value="ad.parentId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeModal">取 消</el-button>
        <el-button type="primary" size="small" @click="submitHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 模态框结束 -->

    <!-- 页面表格 -->
    <el-table :data="categories.list" size="small" @selection-change="idsChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="栏目名称" />
      <el-table-column prop="num" label="序号" />
      <el-table-column prop="parentId" label="父栏目" />
      <el-table-column label="操作" width="100px" align="center">
        <template #default="record">
          <a href="" class="el-icon-delete" @click.prevent="deleteHandler(record.row.id)" /> &nbsp;
          <a href="" class="el-icon-edit-outline" @click.prevent="editHandler(record.row)" /> &nbsp;
        </template>
      </el-table-column>
    </el-table>
    <!-- 页面表格结束 -->
    <!-- <el-pagination
      layout="prev, pager, next"
      :current-page="categories.page+1"
      :page-size="categories.pageSize"
      :total="categories.total"
      @current-change="pageChangeHandler"
    /> -->
    <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="pageChangeHandler"
      :current-page.sync="categories.page+1"
      :page-size="categories.pageSize"
      layout="prev, pager, next, jumper"
      :total="categories.total"
      style="text-align:center">
    </el-pagination> -->
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="pageChangeHandler"
      :current-page="categories.page+1"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="categories.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="categories.total"
      style="text-align:center">
    </el-pagination>
    <!-- 分页结束 -->
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { param } from '../../utils'
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
    this.queryCategories()
    this.findAllCategories()
  },
  computed: {
    ...mapState('category', ['allCategories','options','categories', 'visible', 'title', 'params']),
    ...mapGetters('category', ['countCategories', 'categoryStatusFilter'])
    // 普通属性

  },
  methods: {
    ...mapActions('category', ['findAllCategories','refreshAllCategories','queryCategories', 'deleteCategoryById', 'saveOrUpdateCategory', 'batchDeleteCategory']),
    ...mapMutations('category', ['sizeChange','refreshAllCategories','refreshCategories','pageChange', 'showModal', 'closeModal', 'setTitle']),
    // 普通方法
    // 改变每页的信息条数
    handleSizeChange(val){
      // console.log(`每页 ${val} 条`);
      this.sizeChange(val)
      this.queryCategories()
    },
    // 改变页数
    pageChangeHandler(val) {
      console.log(`当前页: ${val}`);
      this.pageChange(val)
      this.queryCategories()
    },
  
    idsChangeHandler(val) {
      this.ids = val.map(item => item.id)
    },
    // 模态框的“X”号
    dialogCloseHandler() {
      this.$refs.categoryForm.clearValidate()
      this.closeModal()
    },
    // 添加栏目，显示模态框
    toAddHandler() {
      this.form = {}
      this.setTitle('添加栏目信息')
      this.showModal()
    },
    // 提交表单，保存、修改事件
    submitHandler() {
      // 1.表单验证
      this.$refs.categoryForm.validate((valid) => {
        if (valid) {
          // 2.提交表单
          this.saveOrUpdateCategory(this.form)
            .then((response) => {
              this.$message({ type: 'success', message: response.statusText })
            })
        } else {
          return false
        }
      })
    },
    // 删除事件，提示框
    deleteHandler(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            const promise = this.deleteCategoryById(id)
            promise.then((response) => {
              this.$message({ type: 'success', message: response.statusText })
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      // 批量删除事件，提示框
      batchDeleteHandler() {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            const promise = this.batchDeleteCategory(this.ids)
            promise.then((response) => {
              this.$message({ type: 'success', message: response.statusText })
            });   
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
    //修改事件 
    editHandler(row) {
      this.form = row
      this.setTitle('修改栏目信息')
      this.showModal()
    }
  }

}
</script>
<style scoped>
  .search{
    width: 300px;
    height: 32px;
    position: absolute;
    right: 10px;
    top: 63px;
  }
</style>
