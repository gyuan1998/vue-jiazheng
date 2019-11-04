import request from '@/utils/request'
import { post, post_array } from '@/utils/request'
export default {
  namespaced: true,
  state: {
    categories: [],
    allCategories:[],
    visible: false,
    title: '添加栏目信息',
    params: {
      page: 0,
      pageSize:5,
      name:''
    }
  },
  getters: {
    categorySize(state) {
      return state.categories.length
    },
    orderCategory: (state) => {
      return function(flag) {
        state.categories.sort((a, b) => {
          if (a[flag] > b[flag]) {
            return -1
          } else {
            return 1
          }
        })
        return state.categories
      }
    }
  },
  mutations: {
    showModal(state) {
      state.visible = true
    },
    closeModal(state) {
      state.visible = false
    },
    refreshCategories(state, categories) {
      state.categories = categories
    },
    refreshAllCategories(state,allCategories){
      state.allCategories = allCategories
    },
    setTitle(state, title) {
      state.title = title
    },
    pageChange(state, page) {
      state.params.page = page - 1
    },
    sizeChange(state,pageSize){
      state.params.pageSize= pageSize;
    }
  },
  actions: {
    // 批量删除
    async batchDeleteCategory(context, ids) {
      // 1. 批量删除
      const response = await post_array('/category/batchDelete', { ids })
      console.log(response)
      // 2. 分发
      context.dispatch('queryCategories')
      context.dispatch('findAllCategories')

      // 3. 返回结果
      return response
    },

    // 根据id删除
    async deleteCategoryById(context, id) {
      const response = await request.get('/category/deleteById?id=' + id)
      context.dispatch('queryCategories')
      context.dispatch('findAllCategories')
      return response
    },

    // 分页查询栏目信息
    async queryCategories(context) {
      // 1. ajax查询
      const response = await post('/category/query', context.state.params)
      // 2. 将查询结果更新到state中
      context.commit('refreshCategories', response.data)
    },

    // 查询全部的栏目信息
    async findAllCategories(context){
      const response = await request.get('/category/findAll')
      context.commit('refreshAllCategories',response.data)
    },

    // 保存和修改栏目信息
    async saveOrUpdateCategory({ dispatch, commit }, payload) {
      // 1. 提交请求
      const response = await post('/category/saveOrUpdate', payload)
      // 2. 刷新页面
      dispatch('queryCategories')
      dispatch('findAllCategories')
      // 3. 关闭模态框
      commit('closeModal')
      // 4. 提示
      return response
    }
  }
}
