import request from '@/utils/request'
import { post, post_array } from '@/utils/request'
export default {
  namespaced: true,
  state: {
    orders: [],
    visible: false,
    title: '添加订单信息'
  },
  getters: {
    orderSize(state) {
      return state.orders.length
    },
    orderorder: (state) => {
      return function(flag) {
        state.orders.sort((a, b) => {
          if (a[flag] > b[flag]) {
            return -1
          } else {
            return 1
          }
        })
        return state.orders
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
    refreshorders(state, orders) {
      state.orders = orders
    },
    setTitle(state, title) {
      state.title = title
    }
  },
  actions: {
    async batchDeleteorder(context, ids) {
      // 1. 批量删除
      const response = await post_array('/order/batchDelete', { ids })
      console.log(response)
      // 2. 分发
      context.dispatch('findAllorders')
      // 3. 返回结果
      return response
    },
    async deleteorderById(context, id) {
      const response = await request.get('/order/deleteById?id=' + id)
      context.dispatch('findAllorders')
      return response
    },
    async findAllorders(context) {
      // 1. ajax查询
      const response = await request.get('/order/findAll')
      // 2. 将查询结果更新到state中
      context.commit('refreshorders', response.data)
    },
    // payload 顾客信息
    async saveOrUpdateorder({ dispatch, commit }, payload) {
      // 1. 提交请求
      const response = await post('/order/saveOrUpdate', payload)
      // 2. 刷新页面
      dispatch('findAllorders')
      // 3. 关闭模态框
      commit('closeModal')
      // 4. 提示
      return response
    }
  }
}
