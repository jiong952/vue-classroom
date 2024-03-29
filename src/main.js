import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
import './assets/iconfont/iconfont.css'
// 引入echarts
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

// 导入全局样式表
import './assets/css/global.css'
import axios from 'axios'
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.HOME = '/api'
// axios.defaults.baseURL = 'http://localhost:8088'
Vue.prototype.$http = axios
axios.interceptors.request.use(config => {
  console.log(config)
  // 登录授权 请求验证是否有token  需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config // 必须返回否则没有值
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
