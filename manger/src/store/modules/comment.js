import request from '@/utils/request'
import { post, post_array } from '@/utils/request'

export default {
  namespaced: true,
  state: {
    comments: [],
    params: {
      page: 0,
      pageSize: 3
      // content:""
    },
    orders: [],
    orderDetail:{},
    visible: false,
    title: '添加评价信息',
    loading: false
  },
  getters: {

  },
  mutations: {
    // 刷新state中的comments数据
    refreshComments(state,comments) {
      state.comments = comments;
    },
    // 分页
    pageChange(state,currentpage) {
      state.params.page = currentpage - 1;
    },
    // 弹出模态框
    showModal(state) {
      state.visible = true;
    },
    // 关闭模态框
    closeModal(state) {
      state.visible = false;
    },
    // 刷新state中的orders数据
    refreshOrders(state, orders){
      state.orders = orders;
    },
    setTitle(state, title){
      state.title = title;
    },
    beginLoading(state) {
      state.loading = true;
    },
    endLoading(state) {
      state.loading = false;
    }
  },
  actions: {
    // 加载数据
    async findAllComments(context) {
      // ajax查询
      context.commit('beginLoading');
      const response = await post('/comment/query', context.state.params);
      // 通过突变将查询结果更新到state中
      context.commit('refreshComments', response.data);
      setTimeout(() => {
		        context.commit('endLoading');
		    }, 1000)
    },
    // 加载order编号
    async findAllOrders({commit}) {
      // ajax查询
      const response = await request.get('/order/findAll');
      // 通过突变将查询结果更新到state中
      commit('refreshOrders', response.data);
      return response;
    },
    // 保存
    async saveOrUpdateComment({commit,dispatch},payload) {
    	// 1. 保存或更新
    	const response = await post('/comment/saveOrUpdate', payload);
    	// 2. 刷新页面
    	dispatch('findAllComments');
    	// 3. 关闭模态框
    	commit('closeModal');
    	// 4. 提示
    	return response;
    },
    // 删除
    async deleteCommentById({dispatch},id) {
    	// ajax
    	const response = await request.get('/comment/deleteById?id=' + id);
    	// 更新数据
    	dispatch('findAllComments');
    	// 提示
    	return response;
    },
    // 批量删除
    async batchDeleteComment({dispatch},ids) {
    	// ajax
    	const response = await post_array('/comment/batchDelete', { ids });
    	// 更新数据
    	dispatch('findAllComments');
    	// 提示
    	return response;
    }
  }
}
