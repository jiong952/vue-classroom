<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb name1="楼宇管理" name2="楼宇列表" />
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="2">
        <!-- 校区选择下拉列表 -->
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <template>
              <el-select v-model="queryInfo.query" filterable clearable @clear="getBuildingList" placeholder="请选择校区" size="">
                <el-option
                    v-for="item in campusList"
                    :key="item.campusId"
                    :label="item.campusName"
                    :value="item.campusId">
                </el-option>
              </el-select>
            </template>
          </div>
        </el-col>
        <!-- 查询区域 -->
        <el-col :span="4">
          <el-button type="primary" @click="getBuildingList">查询</el-button>
        </el-col>
        <!-- 查询区域 -->
        <el-col :span="3">
          <el-button type="primary" @click="addDialogVisible = true">新增楼宇</el-button>
        </el-col>
      </el-row>
      <!-- 楼宇数据表格区域 -->
      <el-table :data="buildingData.buildingList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="campusName" label="校区"></el-table-column>
        <el-table-column prop="buildingName" label="楼宇编号"></el-table-column>
        <el-table-column prop="classroomCount" label="教室数量"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeBuildingById(scope.row.buildingId)"></el-button>
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
          :page-sizes="[5, 8, 15]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="buildingData.total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加楼宇对话框 -->
    <el-dialog title="添加楼宇" :visible.sync="addDialogVisible" width="50%" @close="addDislogClosed">
      <!-- 内容主题区域 -->
      <el-form label-width="70px" ref="addFormRef" :model="addForm" :rules="addFormRules">
        <el-form-item label="校区名" prop="campusId">
          <template>
            <el-select v-model="addForm.campusId" filterable clearable placeholder="请选择校区" size="">
              <el-option
                  v-for="item in campusList"
                  :key="item.campusId"
                  :label="item.campusName"
                  :value="item.campusId">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="楼宇名" prop="buildingName">
          <el-input v-model="addForm.buildingName"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBuilding">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改校区对话框 -->
    <el-dialog title="修改楼宇" :visible.sync="updateDialogVisible" width="50%" @close="updateDislogClosed">
      <!-- 内容主题区域 -->
      <el-form label-width="70px" ref="updateFormRef" :model="updateForm" :rules="addFormRules">
        <el-form-item label="校区名" prop="campusId">
          <template>
            <el-select v-model="updateForm.campusId" filterable clearable placeholder="请选择校区" size="">
              <el-option
                  v-for="item in campusList"
                  :key="item.campusId"
                  :label="item.campusName"
                  :value="item.campusId">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="楼宇名" prop="buildingName">
          <el-input v-model="updateForm.buildingName"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateBuilding">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
export default {
  name: "Building",
  data() {
    return {
      //控制修改表单
      updateDialogVisible:false,
      //修改表单
      updateForm:{
        buildingId:'',
        campusId:'',
        buildingName:'',
      },
      //增加表单校验规则
      addFormRules: {
        campusId:[
          { pattern: /^(\-|\+)?\d+?$/, required: true, message: '校区不可为空', trigger: 'blur' }
        ],
        buildingName:[
          { required: true, message: '请输入楼宇名', trigger: 'blur' }
        ],
      },
      //增加框表单内容
      addForm:{
        campusId:'',
        buildingName:'',
      },
      //控制增加框
      addDialogVisible: false,
      // 获取用户列表的参数对象
      queryInfo: {
        // 搜索值
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每次显示多少条数据
        pagesize: 8
      },
      //搜索框数据
      options: [
          {
        value: 'campus1',
        label: '大学城校区'
      }, {
        value: 'campus2',
        label: '龙洞校区'
      }, {
        value: 'campus3',
        label: '番禺校区'
      }, {
        value: 'campus4',
        label: '东风路校区'
      }, {
        value: 'campus5',
        label: '揭阳校区'
      }],
      campusList: [],
      campusValue: '',
      buildingData:{
        buildingList: [ ],
        total: 6
      }
    }
  },
  created() {
    this.getBuildingList();
  },
  methods:{
    //修改楼宇
    updateBuilding(){
      this.$refs.updateFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.get('http://localhost:8088/building/update',{params:this.updateForm})
        if (res === false) {
          this.$message.error('更新楼宇信息失败!')
        }
        this.updateDialogVisible = false;
        this.getBuildingList()
        this.$message.success('更新楼宇信息成功!')
      })
    },
    // 监听修改楼宇的对话框关闭事件
    updateDislogClosed(){
      this.$refs.updateFormRef.resetFields();
    },
    //点击修改按钮事件
    showEditDialog(row){
      this.updateForm.buildingId = row.buildingId;
      this.updateForm.campusId = row.campusId;
      this.updateForm.buildingName = row.buildingName;
      this.updateDialogVisible = true;
    },
    //添加楼宇方法
    addBuilding(){
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // 可以发起添加用户请求
        const { data: res } = await this.$http.get('http://localhost:8088/building/add',{
          params:this.addForm
        } )
        if (res === false) {
          return this.$message.error('楼宇添加失败了~')
        }
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 添加成后重新获取用户数据,不需要用户手动刷新
        this.getBuildingList()
        return this.$message.success('楼宇添加成功了~')
      })
    },
    // 监听添加楼宇的对话框关闭事件
    addDislogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    //获取楼宇列表
    async getBuildingList(){
      const { data: res } = await this.$http.get('http://localhost:8088/building/get', {
        params: this.queryInfo
      })
      if (res === null) {
        this.$message.error('获取楼宇列表失败!')
      }
      this.$message.success('获取楼宇列表成功!')
      this.campusList = res.campusList;
      this.buildingData.buildingList = res.buildingList;
      this.buildingData.total = res.total;
    },
    // 监听 pagesize 改变事件 每页显示的个数
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getBuildingList();
    },
    // 监听 页码值 改变的事件 当前页面值
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getBuildingList();
    },
    async removeBuildingById(buildingId){
      // 询问用户是否删除楼宇
      const confirmRusult = await this.$confirm('此操作将永久删除该楼宇, 是否继续?', '永久删除该楼宇', {
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

      this.$http.get('http://localhost:8088/building/delete',{params:{'buildingId':buildingId}}).then(res => {
        if (res === false) {
          return this.$message.error('该楼宇删除失败')
        }
        this.$message.success('该楼宇已经删除')
        this.getBuildingList()
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