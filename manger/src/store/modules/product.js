import request from '@/utils/request'
import { post, post_array } from '@/utils/request'

export default {
  namespaced: true,
  state: {
    products: [],
    visible: false,
    title: '添加产品信息',
    loading: false,
    params: {
      page: 0,
      pageSize: 5,
      name: ''
    },
    categories: []
  },
  getters: {
    productSize(state) {
      return state.products.length
    },
    orderProduct: (state) => {
      return function(flag) {
        state.products.sort((a, b) => {
          if (a[flag] > b[flag]) {
            return -1
          } else {
            return 1
          }
        })
        return state.products
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
    refreshProducts(state, products) {
      state.products = products
    },
    setTitle(state, title) {
      state.title = title
    },
    beginLoading(state) {
      state.loading = true
    },
    endLoading(state) {
      state.loading = false
    },
    pageChange(state, cuttentPage) {
      state.params.page = cuttentPage - 1
    },
    refreshCategories(state, categories) {
      state.categories = categories
    }
  },
  actions: {
    async batchDeleteProduct(context, ids) {
      // 1. 批量删除
      const response = await post_array('/product/batchDelete', { ids })
      // 2. 分发
      context.dispatch('queryProducts')
      // 3. 返回结果
      return response
    },
    async deleteProductById(context, id) {
      const response = await request.get('/product/deleteById?id=' + id)
      context.dispatch('queryProducts')
      return response
    },
    async queryProducts(context) {
      context.commit('beginLoading')
      // 1. ajax查询
      const response = await post('/product/queryProductCascadeCategory', context.state.params)
      // 2. 将查询结果更新到state中
      // console.log(response.data)
      context.commit('refreshProducts', response.data)
      setTimeout(() => {
        context.commit('endLoading')
      }, 1000)
    },
    async categoriesData(context) {
      const response = await request.get('/category/findAll')
      context.commit('refreshCategories', response.data)
    },
    // payload 产品信息
    async saveOrUpdateProduct({ commit, dispatch }, payload) {
      // 1. 保存或更新
      const response = await post('/product/saveOrUpdate', payload)
      // 2. 刷新页面
      dispatch('queryProducts')
      // 3. 关闭模态框
      commit('closeModal')
      // 4. 提示
      return response
    }
  }
}
