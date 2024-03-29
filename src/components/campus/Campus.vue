<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb name1="校区管理" name2="校区列表" />
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索栏 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getCampusList">
            <el-button slot="append" icon="el-icon-search" @click="getCampusList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加用户区域 -->
          <el-button type="primary" @click="addDialogVisible = true">添加校区</el-button>
        </el-col>
      </el-row>
      <!-- 校区数据表格区域 -->
      <el-table :data="campusData.campusList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="campusName" label="校区名称"></el-table-column>
        <el-table-column prop="buildingCount" label="楼宇数量"></el-table-column>
        <el-table-column prop="classroomCount" label="教室数量"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCampusById(scope.row.campusId)"></el-button>
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
          :total="campusData.total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加校区对话框 -->
    <el-dialog title="添加校区" :visible.sync="addDialogVisible" width="50%" @close="addDislogClosed">
      <!-- 内容主题区域 -->
      <el-form label-width="70px" ref="addFormRef" :model="addForm" :rules="addFormRules">
        <el-form-item label="校区名" prop="campusName">
          <el-input v-model="addForm.campusName"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCampus">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改校区对话框 -->
    <el-dialog title="修改校区" :visible.sync="updateDialogVisible" width="50%" @close="updateDislogClosed">
      <!-- 内容主题区域 -->
      <el-form label-width="70px" ref="updateFormRef" :model="updateForm" :rules="addFormRules">
        <el-form-item label="校区名" prop="campusName">
          <el-input v-model="updateForm.campusName"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCampus">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
export default {
  name: "Campus",
  data() {
    return {
      //增加校区表单
      addForm:{
        campusName:'',
      },
      //修改校区表单
      updateForm:{
        campusId:'',
        campusName:'',
      },
      //增加校验
      addFormRules:{
        campusName:[
          { required: true, message: '请输入校区名', trigger: 'blur' }
        ],
      },
      // 控制添加校区对话框的显示和隐藏
      addDialogVisible: false,
      // 控制修改校区对话框的显示和隐藏
      updateDialogVisible:false,
      // 获取用户列表的参数对象
      queryInfo: {
        // 搜索值
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每次显示多少条数据
        pagesize: 5
      },
      // 存放校区的数据和数量
      campusData: {
        campusList: [],
        total: 3
      }
    }
  },
  created() {
    this.getCampusList()
  },
  methods:{
    //修改校园
    updateCampus(){
      this.$refs.updateFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.get('http://localhost:8088/campus/update',{params:this.updateForm})
        if (res === false) {
          this.$message.error('更新校区信息失败!')
        }
        this.updateDialogVisible = false;
        this.getCampusList()
        this.$message.success('更新校区信息成功!')
      })
    },
    //显示修改页面
    showEditDialog(row){
      this.updateForm.campusId = row.campusId;
      this.updateForm.campusName = row.campusName;
      this.updateDialogVisible = true;
    },
    // 监听修改校区的对话框关闭事件
    updateDislogClosed(){
      this.$refs.updateFormRef.resetFields();
    },
    //提交增加校区表单
    addCampus(){
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // 可以发起添加用户请求
        const { data: res } = await this.$http.get('http://localhost:8088/campus/add',{
          params:this.addForm
        } )
        if (res === false) {
          return this.$message.error('校区添加失败了~')
        }
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 添加成后重新获取用户数据,不需要用户手动刷新
        this.getCampusList()
        return this.$message.success('校区添加成功了~')
      })
    },
    // 监听添加校区的对话框关闭事件
    addDislogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    async getCampusList(){
      const { data: res } = await this.$http.get('http://localhost:8088/campus/get', {
        params: this.queryInfo
      })
      if (res === null) {
        this.$message.error('获取校区列表失败!')
      }
      this.$message.success('获取校区列表成功!')
      this.campusData.campusList = res.campusList;
      this.campusData.total = res.total;
    },
    // 监听 pagesize 改变事件 每页显示的个数
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getCampusList()
    },
    // 监听 页码值 改变的事件 当前页面值
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getCampusList()
    },
    async removeCampusById(campusId){
      // 询问用户是否删除校区
      const confirmRusult = await this.$confirm('此操作将永久删除该校区, 是否继续?', '永久删除该校区', {
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

      this.$http.get('http://localhost:8088/campus/delete',{params:{'campusId':campusId}}).then(res => {
        if (res === false) {
          return this.$message.error('该校区删除失败')
        }
        this.$message.success('该校区已经删除')
        this.getCampusList()
      })
    },
  },
  components: {
    //面包屑组件
    Breadcrumb
  },
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
</style>