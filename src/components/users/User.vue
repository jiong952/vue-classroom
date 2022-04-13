<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb name1="用户管理" name2="用户列表" />
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索栏 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加用户区域 -->
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户数据表格区域 -->
      <!-- 用户列表 -->
      <el-table :data="userData.userList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="100"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="250"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="userStatuChanged(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRoles(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          @size-change="handleSizeChange"
          :page-size="queryInfo.pagesize"
          :page-sizes="[2, 5, 15]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="userData.total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
export default {
  name: "User",
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 搜索值
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每次显示多少条数据
        pagesize: 5
      },
      // 存放用户的数据和数量
      userData: {
        userList: [
          {
            "id": 1,
            "username": "张工",
            "mobile": "18616358651",
            "type": 1,
            "email": "tige112@163.com",
            "create_time": "2017-11-09T20:36:26.000Z",
            "mg_state": true, // 当前用户的状态
            "role_name": "教师管理员"
          },
          {
            "id": 2,
            "username": "洪俊章",
            "mobile": "18612458651",
            "type": 1,
            "email": "1017328759@163.com",
            "create_time": "2017-11-09T20:36:26.000Z",
            "mg_state": true, // 当前用户的状态
            "role_name": "学生管理员"
          },
          {
            "id": 3,
            "username": "刘智",
            "mobile": "19426558651",
            "type": 1,
            "email": "zjh1017328759@gmail.com",
            "create_time": "2017-11-09T20:36:26.000Z",
            "mg_state": true, // 当前用户的状态
            "role_name": "教师管理员"
          }
        ],
        total: 3
      }
    }
  },
  components: {
    //面包屑组件
    Breadcrumb
  },
  created() {
    this.getUserList()
  },
  methods: {
    //获取用户数据
    getUserList(){
      let list = this.userData.userList;
      let total = this.userData.total;
      this.userData.userList = list;
      this.userData.total = total;
      this.$message.success('获取用户列表成功!')
      // const { data: res } = await this.$http.get('users', {
      //   params: this.queryInfo
      // })
      // if (res.meta.status !== 200) {
      //   this.$message.error('获取用户列表失败!')
      // }
      // this.$message.success('获取用户列表成功!')
      // this.userData.userList = res.data.users
      // this.userData.total = res.data.total
      // console.log(res)
    },
    // 监听 pagesize 改变事件 每页显示的个数
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值 改变的事件 当前页面值
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },

  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
</style>