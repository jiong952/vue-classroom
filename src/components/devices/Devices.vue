<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb name1="设备管理" name2="设备列表" />
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="10">
        <!-- 教室选择区域 -->
        <el-col :span="6">
          <div class="block">
            <el-cascader
                :options="options"
                :props="{ checkStrictly: false }"
                clearable filterable></el-cascader>
          </div>
        </el-col>
        <!-- 查询区域 -->
        <el-col :span="4">
          <el-button type="primary">查询</el-button>
        </el-col>
      </el-row>
      <!-- 分页 -->
      <el-pagination
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          @size-change="handleSizeChange"
          :page-size="queryInfo.pagesize"
          :page-sizes="[2, 5, 15]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="devicesData.total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
export default {
  name: "Devices",
  components: {
    //面包屑组件
    Breadcrumb
  },
  data(){
    return{
      //查询参数
      queryInfo: {
        // 搜索值
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每次显示多少条数据
        pagesize: 6
      },
      //校区楼宇的级联选择器
      options: [
        {
          value: 'campus1',
          label: '大学城校区',
          children: [
            {
              value: 'campus1_build1',
              label: '教学一号楼',
              children:[
                {
                  value: 'room_1',
                  label: '教1-201',
                }, {
                  value: 'room_2',
                  label: '教1-202',
                },{
                  value: 'room_3',
                  label: '教1-203',
                },{
                  value: 'room_4',
                  label: '教1-204',
                },{
                  value: 'room_5',
                  label: '教1-205',
                },
              ]
            }, {
              value: 'campus1_build2',
              label: '教学二号楼',
            }, {
              value: 'campus1_build3',
              label: '教学三号楼',
            },{
              value: 'campus1_build4',
              label: '教学四号楼',
            },{
              value: 'campus1_build5',
              label: '教学五号楼',
            },
          ]
        }, {
          value: 'campus2',
          label: '龙洞校区',
          children: [
            {
              value: 'campus1_build1',
              label: '教学一号楼',
            }, {
              value: 'campus1_build2',
              label: '教学二号楼',
            }, {
              value: 'campus1_build3',
              label: '教学三号楼',
            },{
              value: 'campus1_build4',
              label: '教学四号楼',
            },{
              value: 'campus1_build5',
              label: '教学五号楼',
            },
          ]

        }, {
          value: 'campus3',
          label: '番禺校区',
          children: [
            {
              value: 'campus1_build1',
              label: '教学一号楼',
            }, {
              value: 'campus1_build2',
              label: '教学二号楼',
            }, {
              value: 'campus1_build3',
              label: '教学三号楼',
            },{
              value: 'campus1_build4',
              label: '教学四号楼',
            },{
              value: 'campus1_build5',
              label: '教学五号楼',
            },
          ]

        }, {
          value: 'campus4',
          label: '东风路校区',
          children: [
            {
              value: 'campus1_build1',
              label: '教学一号楼',
            }, {
              value: 'campus1_build2',
              label: '教学二号楼',
            }, {
              value: 'campus1_build3',
              label: '教学三号楼',
            },{
              value: 'campus1_build4',
              label: '教学四号楼',
            },{
              value: 'campus1_build5',
              label: '教学五号楼',
            },
          ]

        }, {
          value: 'campus5',
          label: '揭阳校区',
        }, ],
      devicesData:{

        total: 5
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
  }
}
</script>

<style lang="less" scoped>

</style>