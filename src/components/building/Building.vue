<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb name1="楼宇管理" name2="楼宇列表" />
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="2">
        <!-- 校区选择区域 -->
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <template>
              <el-select v-model="queryInfo.query" filterable clearable placeholder="请选择校区" size="">
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
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
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
  </div>
</template>

<script>
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
export default {
  name: "Building",
  data() {
    return {
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