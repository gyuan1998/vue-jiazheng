import Vue from 'vue'
import VueRouter from 'vue-router'

//管理页面
import Manager from '../pages/manager/Layout.vue'
//登陆页面
import Login from '../pages/Login'
// 账户与安全界面
import Safe from '../pages/manager/Safe'


Vue.use(VueRouter)



const routes = [
  {
    path:"/",
    redirect:"/login"
  },
  {
    path: '/',
    name: 'manager',
    component: Manager,
    children:[{
      path:"home",
      component: () => import('../pages/manager/Home.vue')
    },{
      path:"order", 
      component: () => import('../pages/manager/Order.vue')
    },{
      path:"user",
      component: () => import('../pages/manager/User.vue')
    }]
  },{
    path: '/login',
    name: 'login',
    component: Login,
  },{
    path: '/safe',
    name: 'safe',
    component: Safe,
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
