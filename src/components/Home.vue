<template>
  <el-container class="home-container">
    <!-- 首部栏 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>智能教室管理系统</span>
      </div>
      <div>
        <div style="font-size: medium; padding-right: 15px" contenteditable="true" v-text="username"></div>
        <el-button type="info" @click="logout">退出</el-button>
      </div>

    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '61px' : '200px'">
        <div class="toggle-button" @click="toggleCollpase">|||</div>
        <!-- 侧边栏菜单区域 -->
<!--        unique-opened :保证每次只有一个展开
            :router="true" 开启侧边栏的路由，会默认用index作为跳转路径，就不用一一配置
            :default-active="activePath" 使得侧边栏永远会高亮选中的组件
-->
        <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="activePath"
        >
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
              <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveActivePath('/' + subItem.path)">
                <!-- 二级菜单的模板区域 -->
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import * as echarts from 'echarts'
export default {
  name: "Home.vue",
  data() {
    return {
      username: '',
      // 左侧菜单数据
      menuList: [
        {
          "id": 101,
          "authName": "校区管理",
          "path": "campus",
          "children": [
            {
              "id": 1001,
              "authName": "校区列表",
              "path": "campus"
            }
          ]
        },
        {
          "id": 102,
          "authName": "楼宇管理",
          "path": "buildings",
          "children": [
            {
              "id": 1002,
              "authName": "楼宇列表",
              "path": "buildings"
            }
          ]
        },
        {
          "id": 103,
          "authName": "教室管理",
          "path": "classrooms",
          "children": [
            {
              "id": 1003,
              "authName": "教室列表",
              "path": "classrooms"
            }
          ]
        },
        {
          "id": 105,
          "authName": "用户管理",
          "path": "users",
          "children": [
            {
              "id": 1005,
              "authName": "用户列表",
              "path": "users"
            }
          ]
        }
      ],
      iconsObj: {
        // 一级菜单的icon图标
        101: 'iconfont icon-xiaoquguanli',
        102: 'iconfont icon-louyushu',
        103: 'iconfont icon-jiaoshi',
        104: 'iconfont icon-shebei',
        105: 'iconfont icon-yonghu',
        106: 'iconfont icon-baobiao'
      },
      isCollapse: false, // 是否折叠属性
      activePath: '', //当前页面的激活菜单路径
      welcome: {
        authName: '欢迎光临',
        id: 147,
        order: 1,
        path: '/welcome',
        children: [
          {
            authName: 'Welcome',
            id: 124,
            order: 1,
            path: 'welcome',
            children: []
          }
        ]
      }
    }
  },
  created() {
    this.username = window.sessionStorage.getItem("username");
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      // const { data: res } = await this.$http.get('/menus')
      // if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success(res.meta.msg)
      // res.data.unshift(this.welcome)
      // this.menuList = res.data
      // console.log(res, 'menus')

      //先用假数据
    },
    // 点击按钮,切换菜单的折叠和展开
    toggleCollpase() {
      this.isCollapse = !this.isCollapse
    },
    saveActivePath(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
      // console.log(this.$route.path)
    }
  }
}
</script>

<style lang="less" scoped>
.hwelcome {
  color: #fff;
  font-size: 15px;
  height: 25px;
  text-align: center;
  background: green;
  span {
    margin-left: 10px;
  }
}
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  background-color: #373d3f;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-left: 10px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  padding-right: 10px;
}
.toggle-button {
  background: #4a5064;
  font-size: 10px;
  text-align: center;
  line-height: 24px;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>