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
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户数据表格区域 -->
      <!-- 用户列表 -->
      <el-table :data="userData.userList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" label="姓名" width="100"></el-table-column>
        <el-table-column prop="mail" label="邮箱" width="250"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column label="角色">
          <template slot-scope="scope">
            <span v-if="scope.row.role === 1">学生管理员</span>
            <span v-else>教师管理员</span>
          </template>
        </el-table-column>
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
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDislogClosed">
      <!-- 内容主题区域 -->
      <el-form label-width="70px" ref="addFormRef" :model="addForm" :rules="addFormRules">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="addForm.mail"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="addForm.role">
            <el-radio label= '1' border>学生管理员</el-radio>
            <el-radio label= '2' border>教师管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息对话框 -->
    <el-dialog title="修改用户" @close="updateClosed" :visible.sync="updateDialogVisble" width="50%">
      <el-form :model="updateForm" :rules="updateFormRules" ref="updateFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="updateForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="updateForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
export default {
  name: "User",
  data() {
    return {
      // 控制添加用户对话框的显示和隐藏
      addDialogVisible: false,
      // 添加用户数据的表单对象
      addForm: {
        name: '',
        role: '',
        mail: '',
        phone: ''
      },
      //增加用户的校验规则
      addFormRules:{
        name:[
          { required: true, message: '请输入用户姓名', trigger: 'blur' }
        ],
        mail: [
          {type: 'email',message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
        ],
        role: [
          { required: true, message: '请选择角色', trigger: ['blur', 'change'] }
        ],
        phone: [
            { pattern: /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/,
              message: '请输入正确的手机号',
              trigger: 'blur'}
        ]
      },
      // 控制修改用户对话框的显示和隐藏
      updateDialogVisble:false,
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
      },
      //修改用户表单
      updateForm:{},
      //修改用户的校验规则
      updateFormRules:{},

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
    //提交增加用户表单
    addUser(){
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // 可以发起添加用户请求
        const { data: res } = await this.$http.get('http://localhost:8088/users/add',{
          params:this.addForm
        } )
        if (res === false) {
          return this.$message.error('用户添加失败了~')
        }
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 添加成后重新获取用户数据,不需要用户手动刷新
        this.getUserList()
        return this.$message.success('用户添加成功了~')
      })
    },
    // 监听添加用户的对话框关闭事件
    addDislogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    // 监听修改用户对话框的关闭事件
    updateClosed(){
      this.$refs.updateFormRef.resetFields();
    },
    //修改用户按钮提交
    updateUser(){},
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