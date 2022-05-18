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
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
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
        <el-table-column prop="name" label="姓名" width="100"></el-table-column>
        <el-table-column prop="mail" label="邮箱" width="250"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.state"  :inactive-value = 0
                       :active-value = 1 active-color="#13ce66" inactive-color="#ff4949" @change="userStatuChanged(scope.row.id,scope.row.state)"> </el-switch>
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
        userList: [],
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
    async getUserList(){
      const { data: res } = await this.$http.get('http://localhost:8088/users/get', {
        params: this.queryInfo
      })
      if (res === null) {
        this.$message.error('获取用户列表失败!')
      }
      this.$message.success('获取用户列表成功!')
      this.userData.userList = res.userList;
      this.userData.total = res.total;
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
    async removeUserById(id) {
      // 询问用户是否删除用户
      const confirmRusult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '永久删除该用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmRusult)
      // 用户点击了删除,则返回字符串 confirm
      // 用户取消了删除,则返回字符串 cancel
      if (confirmRusult !== 'confirm') {
        return this.$message.info('已经取消了删除')
      }

      this.$http.get('http://localhost:8088/users/delete',{params:{'id':id}}).then(res => {
        if (res === false) {
          return this.$message.error('该用户删除失败')
        }
        this.$message.success('该用户已经删除')
        this.getUserList()
      })
    },
    async userStatuChanged(id,state){
      // 询问用户是否删除用户
      // const confirmRusult = await this.$confirm('此操作将使用户失效, 是否继续?', '使用户失效', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).catch(err => err)
      // console.log(confirmRusult)
      // // 用户点击了删除,则返回字符串 confirm
      // // 用户取消了删除,则返回字符串 cancel
      // if (confirmRusult !== 'confirm') {
      //   return this.$message.info('已经取消了')
      // }
      this.$http.get('http://localhost:8088/users/state',{params:{'id':id,'state':state}}).then(res => {
        if (res === false) {
          return this.$message.error('修改状态失败')
        }
        this.$message.success('修改状态成功')
        this.getUserList()
      })
    },

  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
</style>