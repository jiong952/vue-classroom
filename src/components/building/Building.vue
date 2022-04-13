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
              <el-select v-model="campusValue" clearable placeholder="请选择校区" size="">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </template>
          </div>
        </el-col>
        <!-- 查询区域 -->
        <el-col :span="4">
          <el-button type="primary">查询</el-button>
        </el-col>
      </el-row>
      <!-- 楼宇数据表格区域 -->
      <el-table :data="buildingData.buildingList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="campusName" label="校区"></el-table-column>
        <el-table-column prop="buildingName" label="楼宇编号"></el-table-column>
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
        pagesize: 6
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
      campusValue: '',
      buildingData:{
        buildingList: [
          {
            "id": 1,
            "campusName": "大学城校区",
            "buildingName": "教学一号楼",
            "roomNum": "42",
            "create_time": "2017-11-09T20:36:26.000Z",
          },
          {
            "id": 2,
            "campusName": "大学城校区",
            "buildingName": "教学二号楼",
            "roomNum": "38",
            "create_time": "2017-11-09T20:36:26.000Z",
          },
          {
            "id": 3,
            "campusName": "大学城校区",
            "buildingName": "教学三号楼",
            "roomNum": "35",
            "create_time": "2017-11-09T20:36:26.000Z",
          },
          {
            "id": 4,
            "campusName": "大学城校区",
            "buildingName": "教学四号楼",
            "roomNum": "46",
            "create_time": "2017-11-09T20:36:26.000Z",
          },
          {
            "id": 5,
            "campusName": "大学城校区",
            "buildingName": "教学五号楼",
            "roomNum": "47",
            "create_time": "2017-11-09T20:36:26.000Z",
          },
          {
            "id": 6,
            "campusName": "大学城校区",
            "buildingName": "教学六号楼",
            "roomNum": "41",
            "create_time": "2017-11-09T20:36:26.000Z",
          },
        ],
        total: 6
      }
    }
  },
  methods:{
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