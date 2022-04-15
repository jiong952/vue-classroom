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
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加用户区域 -->
          <el-button type="primary">添加校区</el-button>
        </el-col>
      </el-row>
      <!-- 校区数据表格区域 -->
      <el-table :data="campusData.campusList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="campusName" label="校区名称"></el-table-column>
        <el-table-column prop="buildNum" label="楼宇数量"></el-table-column>
        <el-table-column prop="roomNum" label="教室数量"></el-table-column>
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
          :page-sizes="[2, 5, 15]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="campusData.total"
      >
      </el-pagination>
    </el-card>
  </div>

</template>

<script>
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
export default {
  name: "Campus",
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
      // 存放校区的数据和数量
      campusData: {
        campusList: [
          {
            "id": 1,
            "campusName": "大学城校区",
            "buildNum": "38",
            "roomNum": "268",
            "create_time": "2017-11-09T20:36:26.000Z",
          },
          {
            "id": 2,
            "campusName": "龙洞校区",
            "buildNum": "13",
            "roomNum": "142",
            "create_time": "2017-11-09T20:36:26.000Z",
          },
          {
            "id": 3,
            "campusName": "东风路校区",
            "buildNum": "20",
            "roomNum": "200",
            "create_time": "2017-11-09T20:36:26.000Z",
          },
          {
            "id": 4,
            "campusName": "番禺校区",
            "buildNum": "8",
            "roomNum": "40",
            "create_time": "2017-11-09T20:36:26.000Z",
          },
          {
            "id": 5,
            "campusName": "揭阳校区",
            "buildNum": "10",
            "roomNum": "60",
            "create_time": "2017-11-09T20:36:26.000Z",
          },
        ],
        total: 5
      }
    }
  },
  methods:{
    getCampusList(){
      this.$message.success('获取校区列表成功!')
    }
  },
  created() {
    this.getCampusList()
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