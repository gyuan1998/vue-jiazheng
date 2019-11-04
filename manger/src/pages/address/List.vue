<template>
  <div class="address">
    <h2>地址管理</h2>
    <!-- 按钮 -->
    <div class="btns">
      <el-row>
        <!-- 左侧搜索 -->
        <el-col :span="20">
          <el-form :inline="true">
            <el-form-item>
              <el-input v-model="params.province" placeholder="请输入" />
            </el-form-item>
            <el-form-item>
              <el-button @click="findAllAddresses">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- /搜索结束 -->
        <el-button type="primary" size="small" @click="toAddHandler">添加</el-button>
        <el-button type="danger" size="small" @click="batchDeleteHandler">批量删除</el-button>
      </el-row>
    </div>
    <!-- 表单 -->
    <div>
      <el-dialog :title="title" :visible.sync="visible" @close="dialogCloseHandler">
        <el-form ref="addressForm" :model="form" :rules="rules">
          <el-form-item label="省份" label-width="80px" prop="province">
            <el-input v-model="form.province" autocomplete="off" />
          </el-form-item>
          <el-form-item label="城市" label-width="80px" prop="city">
            <el-input v-model="form.city" autocomplete="off" />
          </el-form-item>
          <el-form-item label="地区" label-width="80px" prop="area">
            <el-input v-model="form.area" autocomplete="off" />
          </el-form-item>
          <el-form-item label="地址" label-width="80px" prop="address">
            <el-input v-model="form.address" autocomplete="off" />
          </el-form-item>
          <el-form-item label="电话" label-width="80px" prop="telephone">
            <el-input v-model="form.telephone" autocomplete="off" />
          </el-form-item>
          <!-- <el-form-item label="顾客ID" label-width="80px" prop="customerId">
                    <el-input v-model="form.customerId" autocomplete="off"></el-input>
                </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeModal">取 消</el-button>
          <el-button type="primary" size="small" @click="submitHandler">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- /表单 -->
    <!-- 表格 -->
    <div
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      style="width: 100%"
    >
      <el-table :data="addresses.list" size="small" @selection-change="idsChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="province" label="省份" />
        <el-table-column prop="city" label="城市" />
        <el-table-column prop="area" label="地区" />
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="telephone" label="电话" />
        <el-table-column prop="customerId" label="顾客ID" />
        <el-table-column label="操作" width="100px" align="center">
          <template #default="record">
            <a href="" class="el-icon-delete" @click.prevent="deleteHandler(record.row.id)" /> &nbsp;
            <a href="" class="" @click.prevent="toDetailsHandler(record.row.id)">详情</a> &nbsp;
            <a href="" class="el-icon-edit-outline" @click.prevent="editHandler(record.row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- /表格 -->
    <!-- 分页 -->
    <el-pagination
      layout="prev, pager, next"
      :current-page="params.page+1"
      :page-size="addresses.pageSize"
      :total="addresses.total"
      @current-change="pageChangeHandler"
    />
    <!-- /分页 -->
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
        province: [
          { required: true, message: '请输入省份', trigger: 'blur' },
          { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入城市', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入地区', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { min: 7, max: 11, message: '长度在 7 到 11 个字符', trigger: 'blur' }
        ],
        customerId: [
          { required: true, message: '请输入顾客ID', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.findAllAddresses()
  },
  computed: {
    ...mapState('address', ['addresses', 'visible', 'title', 'loading', 'params']),
    ...mapGetters('address', ['countAddresses', 'addressStatusFilter'])
    // 普通属性

  },
  methods: {
    ...mapActions('address', ['findAllAddresses', 'deleteAddressById', 'saveOrUpdateAddress', 'batchDeleteAddresses', 'pageChangeHandler']),
    ...mapMutations('address', ['showModal', 'closeModal', 'setTitle']),
    // 普通方法
    toDetailsHandler(address) {
      // 跳转到详情页面
      // this.$router.push("/customerDetails")
      this.$router.push({
        path: '/address/Details',
        query: { id: address.id }
      })
    },
    batchDeleteHandler() {
      this.batchDeleteAddresses(this.ids)
        .then((response) => {
          this.$message({ type: 'success', message: response.statusText })
        })
    },
    idsChangeHandler(val) {
      this.ids = val.map(item => item.id)
    },
    dialogCloseHandler() {
      this.$refs.addressForm.clearValidate()
    },
    toAddHandler() {
      this.form = {}
      this.setTitle('添加地址信息')
      this.showModal()
    },
    submitHandler() {
      // 1.表单验证
      this.$refs.addressForm.validate((valid) => {
        if (valid) {
          // 2.提交表单
          this.saveOrUpdateAddress(this.form)
            .then((response) => {
              this.$message({ type: 'success', message: response.statusText })
            })
        } else {
          return false
        }
      })
    },
    deleteHandler(id) {
      const promise = this.deleteAddressById(id)
      promise.then((response) => {
        this.$message({ type: 'success', message: response.statusText })
      })
    },
    editHandler(row) {
      this.form = row
      this.setTitle('修改地址信息')
      this.showModal()
    }
  }
}
</script>
<style scoped>

</style>
