import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
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
    component: Home
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
export default router
