import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welocome.vue'
import Users from '@/components/User/user.vue'
import Rights from '@/components/power/rights.vue'
import Role from '@/components/Role/role.vue'
import Cate from '@/components/goods/Cate.vue'
import Params from '@/components/goods/Params.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    },{
      path: '/users',
      component: Users
    },{
      path: '/rights',
      component: Rights
    },{
      path:'/roles',
      component: Role
    },{
      path:'/categories',
      component: Cate
    },{
      path: '/params',
      component: Params
    }]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航首位
router.beforeEach((to, from, next) => {
  // 访问登录页直接放行
  if(to.path === '/login') return next()
  // 不是访问登录页的情况
  const token = window.sessionStorage.getItem('token')
  if(!token) return next('/login')
  next()
})
const originalPush =  VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
