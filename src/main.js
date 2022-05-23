import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import TreeTable from 'vue-table-with-tree-grid'
// 导入全局样式表
import '@/assets/css/global.css'
// 导入字体图标
import '@/assets/fonts/iconfont.css'
// 导入axio包
import axios from 'axios'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
axios.defaults.baseURL = ' https://lianghj.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 固定写法最后必须返回
  return config
})
Vue.component('tree-tabel',TreeTable)
// 全局过滤器
Vue.filter('dateFoemat',function(originVl) {
  const dt = new Date(originVl)
  const year = dt.getFullYear()
  const month = (dt.getMonth() +1 + '').padStart(2,'0')
  const date = (dt.getDate() + '').padStart(2,'0')
  const hour = (dt.getHours() + '').padStart(2,'0')
  const minute = (dt.getHours() + '').padStart(2,'0')
  const second = (dt.getSeconds() + '').padStart(2,'0')
  return `${year}-${month}-${date} ${hour}:${minute}:${second}`
})
Vue.use(ElementUI)
// 注册富文本编辑器
Vue.use(VueQuillEditor)
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
