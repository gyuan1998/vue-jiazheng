<template>
  <div id="comment">
    <!-- 按钮 -->
    <div class="btns">
      <el-row>
        <el-col :span="3">
          <!-- 添加按钮 -->
          <el-button size="small" type="primary" @click="toAddHandler">添加</el-button>
          <!-- 批量删除按钮 -->
          <el-button size="small" type="danger" @click="batchDeleteHandler">批量删除</el-button>
        </el-col>
        <!-- 搜索 -->
        <el-col :span="21" align="right">
          <el-form :inline="true">
            <el-form-item>
              <el-input v-model="params.content" size="small" placeholder="请输入关键字" />
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="success" @click="findAllComments">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <!-- 按钮 -->
    <!-- 表格 -->
    <div v-loading="loading">
      <el-table :data="comments.list" size="mini" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="orderId" label="订单编号" align="center" />
        <el-table-column prop="content" label="内容" align="center" />
        <el-table-column prop="commentTime" label="评论时间" align="center" />
        <el-table-column label="操作" width="300px" align="center">
          <template #default="record">
            <!-- 删除询问框 -->
            <i slot="reference" class="el-icon-delete" href="" @click="deleteHandler(record.row.id)" /> &nbsp;
            <!-- <el-popover placement="top" width="160" v-model="visibleDel">
						  	<p>这是一段内容这是一段内容确定删除吗？</p>
						  	<div style="text-align: right; margin: 0">
						    	<el-button size="mini" type="text" @click="visible = false">取消</el-button>
						    	<el-button type="primary" size="mini" @click="visible = false">确定</el-button>
						  	</div>

						</el-popover> -->
            <i class="el-icon-edit-outline" href="" @click="editHandler(record.row)" /> &nbsp;
            <a href="" @click.prevent="toDetailsHandler(record.row.orderId)">详情</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- /表格 -->
    <!-- 分页 -->
    <el-pagination
      layout="prev, pager, next"
      :current-page="comments.page+1"
      :page-size="comments.pageSize"
      :total="comments.total"
      @current-change="pageChangeHandler"
    />
    <!-- /分页 -->
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" width="40%" @close="dialogCloseHandler">
      <el-form ref="commentForm" :model="comment" :rules="rules">
        <el-form-item label="订单编号" label-width="80px" prop="orderId">
          <el-select v-model="comment.orderId" placeholder="请选择订单编号">
            <el-option v-for="item in orders" :key="item" :label="item.id" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" label-width="80px" prop="content">
          <el-input v-model="comment.content" type="textarea" placeholder="请输入内容" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeModal">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
    <!-- 询问框 -->

  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  	data(){
    	return{
    		order:[],
    		rules:{
		        content: [
		          	{ required: true, message: '请输入评价', trigger: 'blur' },
		          	{ min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
		        ]
		    },
		    comment:{},
		    ids:[]
		    // visibleDel:false
    	}
  	},
  	computed:{
    	// 映射
    	...mapState('comment', ['comments', 'params', 'orders', 'visible', 'title', 'loading',"orderDetail"])
  	},
  	created(){
    	this.findAllComments()
    	this.findAllOrders()
  	},
 	methods:{
    	// 映射
    	...mapMutations('comment', ['pageChange', 'showModal', 'closeModal', 'setTitle']),
    	...mapActions('comment', ['findAllComments', 'findAllOrders', 'saveOrUpdateComment', 'deleteCommentById', 'batchDeleteComment']),
    	// 分页
    	pageChangeHandler(currentpage){
    		this.pageChange(currentpage);
    		this.findAllComments();
    	},
    	// 加载数据
    	// 添加数据
    	toAddHandler(){
    		// 清空表单数据
    		this.comment = {};
      		this.setTitle('添加顾客信息');
    		// 弹出模态框
    		this.showModal();
    	},
    	// 提交表单数据
    	submitHandler(){
		    // 校验
		    this.$refs.commentForm.validate((valid)=>{
		        // 如果校验通过
		        if(valid){
		        	const date = new Date();
		    		this.comment['commentTime'] = date.getTime();
		          	const promise = this.saveOrUpdateComment(this.comment);
		          	promise.then((response) => {
		            	// promise为action函数的返回值，异步函数的返回值就是promise的then回调函数的参数
		            	this.$message({ type: 'success', message: response.statusText })
		          	});
		        }else{
		          	return false;
		        }
		    })
	    },
	    // 重置表单验证
    	dialogCloseHandler(){
    		this.$refs.commentForm.resetFields();
    	},
    	// 删除
    	deleteHandler(id){
    		this.deleteCommentById(id)
    		.then((response) => {
    			this.$message({ type: 'success', message: response.statusText });
    		})
    	},
    	// 获取要删除行的所有id
    	handleSelectionChange(val){
     		this.ids = val.map(item => item.id);
    	},
    	// 批量删除
    	batchDeleteHandler(){
    		this.batchDeleteComment(this.ids)
    		.then((response) => {
    			this.$message({ type: 'success', message: response.statusText })
    		})
    	},
    	// 修改
    	editHandler(row){
    		// 显示数据
    		this.comment = row;
    		// 修改模态框的标题
      		this.setTitle('修改顾客信息');
      		// 弹出模态框
      		this.showModal();
    	},
    	// 详情
    	toDetailsHandler(comment,orderId){
		    // 跳转到详情页面
		    // this.$router.push("/customerDetails")
		    this.$router.push({
		        path: '/comment/details',
		        query:{id:comment.orderId}
		    });
    	}
  	}
}
</script>
<style scoped>

</style>
