// 发送json字符串
import request from '@/utils/request'
// 发送查询字符串
import { post, post_array } from '@/utils/request'

export default {
  namespaced: true,
  state: {
    visible: false,
    addresses: [],
    title: '添加地址信息',
    loading: false,
    params: {
      page: 0,
      pageSize: 5
    }
  },
  getters: {
    countAddresses: (state) => {
      return state.addresses.length
    },
    // 需要为获取器传递参数的写法
    addressStatusFilter: (state) => {
      return function(status) {
        if (status) {
          return state.addresses.filter(item => item.status === status)
        } else {
          return state.addresses
        }
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
    // 需要接受一个参数，这个参数就是customers
    refreshAddresses(state, addresses) {
      console.log('state->', state)
      state.addresses = addresses
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
    pageChangeHandler(currentPage, context) {
      context.params.page = currentPage - 1
      context.loadData()
    }
  },
  actions: {
    // 批量删除
    async batchDeleteAddresses(context, ids) {
      const response = await post_array('/address/batchDelete', { ids })
      context.dispatch('findAllAddresses')
      return response
    },
    // async findAllCustomers({commit,dispatch,getters,state}){
    async findAllAddresses(context) {
      // 1. ajax查询所有地址信息
      context.commit('beginLoading')
      const response = await post('/address/query', context.state.params)
      // 2. 将地址信息设置到state.addresses
      context.commit('refreshAddresses', response.data)
      // 超时调用loading
      setTimeout(() => {
        context.commit('endLoading')
      }, 2000)
    },
    async deleteAddressById({ dispatch }, id) {
      // 1. 删除地址信息
      const response = await request.get('/address/deleteById?id=' + id)
      // 2. 刷新
      dispatch('findAllAddresses')
      // 3. 提示成功
      return response
    },
    async saveOrUpdateAddress({ dispatch, commit }, address) {
      // 1. 提交请求
      const response = await post('/address/saveOrUpdate', address)
      // 2. 关闭模态
      commit('closeModal')
      // 3. 刷新页面
      dispatch('findAllAddresses')
      // 4. 提示成功 react
      return response
    }
  }
}
