<template>
  <div class="product">
    <el-row>
      <!-- 左侧按钮 -->
      <!-- {{params}} -->
      <el-col :span="18">
        <el-button size="small" type="primary" @click="toAddHandler">添加</el-button>
        <el-button size="small" type="danger" @click="batchDeleteHandler">批量删除</el-button>
      </el-col>
      <!-- 右侧搜索 -->
      {{ params.name }}
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
    <!-- {{products}} -->
    <div v-loading="loading">
      <el-table :data="products.list" size="mini" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="编号" />
        <el-table-column prop="name" label="产品名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="status" label="状态" />
        <!-- <el-table-column prop="photo" label="预览"></el-table-column> -->
        <el-table-column prop="category.name" label="所属栏目" />
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
      <!-- {{product}} -->
      <el-form ref="productForm" :model="product" :rules="rules">
        <el-form-item label="产品名称" label-width="100px" prop="name">
          <el-input v-model="product.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="所属栏目" label-width="100px" prop="categoryId">
          <el-select v-model="product.categoryId" placeholder="请选择栏目">
            <el-option v-for="c in categories" :key="c" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" label-width="100px" prop="price">
          <el-input v-model="product.price" auto-complete="off" />
        </el-form-item>
        <el-form-item label="描述" label-width="100px" prop="description">
          <el-input v-model="product.description" type="textarea" :rows="2" placeholder="请输入内容" auto-complete="off" />
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
      :page-size="products.pageSize"
      :total="products.total"
      @current-change="pageChangeHandler"
    />
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      product: {},
      ids: [],
      rules: {
        name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入产品价格', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 映射
    ...mapState('product', ['products', 'visible', 'title', 'loading', 'params', 'categories']),
    ...mapGetters('product', ['orderProduct', 'productSize'])
  },
  created() {
    this.loadData()
    this.loadCategoryData()
  },
  methods: {
    // 映射
    ...mapMutations('product', ['showModal', 'closeModal', 'setTitle', 'pageChange']),
    ...mapActions('product', ['queryProducts', 'categoriesData', 'deleteProductById', 'saveOrUpdateProduct', 'batchDeleteProduct']),
    // 普通方法
    toDetailsHandler(product) {
      // 跳转到详情页面
      this.$router.push({
        path: '/product/details',
        query: { id: product.id }
      })
    },
    toAddHandler() {
      // 1. 重置表单
      this.product = {}
      this.setTitle('添加产品信息')
      // 2. 显示模态框
      this.showModal()
    },
    submitHandler() {
      // 校验
      this.$refs.productForm.validate((valid) => {
        // 如果校验通过
        if (valid) {
          const promise = this.saveOrUpdateProduct(this.product)
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
      this.queryProducts()
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
      this.$refs.productForm.resetFields()
    },
    editHandler(row) {
      this.product = row
      this.setTitle('修改产品信息')
      this.showModal()
    },
    deleteHandler(id) {
      this.deleteProductById(id)
        .then((response) => {
          this.$message({ type: 'success', message: response.statusText })
        })
    },
    batchDeleteHandler() {
      this.batchDeleteProduct(this.ids)
        .then((response) => {
          this.$message({ type: 'success', message: response.statusText })
        })
    }
  }
}
</script>
