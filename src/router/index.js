import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/components/Login";
import Home from "@/components/Home";
import Welcome from "@/components/Welcome";
import User from "@/components/users/User";
import Right from "@/components/rights/Right";
import Classroom from "@/components/classroom/Classroom";
import Devices from "@/components/devices/Devices";
import Campus from "@/components/campus/Campus";
import Building from "@/components/building/Building";
import Detail from "@/components/classroom/Detail";
import Echarts from "@/components/Echarts";
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
    //子路由
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: User
      },
      {
        path: '/classrooms',
        component: Classroom
      },
      {
        path: '/devices',
        component: Devices
      },
      {
        path: '/campus',
        component: Campus
      },
      {
        path: '/buildings',
        component: Building
      },
      {
        path: '/detail',
        component: Detail
      },
      {
        path: '/echarts',
        component: Echarts
      },

    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})
//页面导航守卫，没登录就跳转回登录页面
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})
export default router
