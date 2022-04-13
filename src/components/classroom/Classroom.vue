<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb name1="教室管理" name2="教室列表" />
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="10">
        <!-- 楼宇选择区域 -->
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
      <!-- 教室数据区域 -->
      <el-table :data="classroomData.classroomList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="campusName" label="校区"></el-table-column>
        <el-table-column prop="buildingName" label="楼宇编号"></el-table-column>
        <el-table-column prop="classroomName" label="教室编号"></el-table-column>
        <el-table-column label="空闲状态" >
          <template slot-scope="scope">
            <el-popover placement="top-start" title="" trigger="hover">
              <img slot="reference" :src="scope.row.address" style="width: 30px;height: 30px">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="智能模式">
          <template v-slot="scope">
            <el-switch v-model="scope.row.auto_state" active-color="#13ce66" inactive-color="#ff4949" @change="userStatuChanged(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="adminName" label="管理员"></el-table-column>
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
          :total="classroomData.total"
      >
      </el-pagination>
    </el-card>
    <el-button type="primary" @click="request">请求</el-button>
    <el-button type="primary" @click="send">发送</el-button>
  </div>
</template>

<script>
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
export default {
  name: "Classroom",
  data(){
    return{
      // 获取用户列表的参数对象
      queryInfo: {
        // 搜索值
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每次显示多少条数据
        pagesize: 6
      },
      state1:1,
      //校区选项
      campusValue: '',
      //教室的所有状态
      state: {
        Humidity: 3,
        Temperature: 3,
        fire_state: "safe1",
        smoke_state: "safe1",
        deep_state: {
          have_person: {
            person_nums: 3,
            area_1: 3,
            area_2: 0,
            area_3: 0,
            area_4: 0
          },
          person_state: {
            person_1: 0,
            person_2: 0,
            person_3: 0,
            person_4: 0
          }
        },
        web_state: {
          web_ctrl: 0,
          ctrl_state: {
            light_state: {
              light_1: 0,
              light_2: 0,
              light_3: 0,
              light_4: 0
            },
            fan_state: 0
          }
        }
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
      //教室数据
      classroomData:{
        classroomList: [
          {
            "id": 1,
            "campusName": "大学城校区",
            "buildingName": "教学二号楼",
            "classroomName":"教2-201",
            "empty_state": 1,
            "auto_state": true, //true时为智能模式
            "adminName":"洪俊章",
            "address": "https://myblogimgbed.oss-cn-shenzhen.aliyuncs.com/img/empty.png",
            "create_time": "2017-11-09T20:36:26.000Z",
          },
          {
            "id": 1,
            "campusName": "大学城校区",
            "buildingName": "教学二号楼",
            "classroomName":"教2-201",
            "empty_state": "not_empty",
            "auto_state": true, //true时为智能模式
            "adminName":"洪俊章",
            "address": "https://myblogimgbed.oss-cn-shenzhen.aliyuncs.com/img/not_empty.png",
            "create_time": "2017-11-09T20:36:26.000Z",
          },
          {
            "id": 1,
            "campusName": "大学城校区",
            "buildingName": "教学二号楼",
            "classroomName":"教2-201",
            "empty_state": "empty",
            "auto_state": true, //true时为智能模式
            "adminName":"洪俊章",
            "address": "https://myblogimgbed.oss-cn-shenzhen.aliyuncs.com/img/empty.png",
            "create_time": "2017-11-09T20:36:26.000Z",
          },
          {
            "id": 1,
            "campusName": "大学城校区",
            "buildingName": "教学二号楼",
            "classroomName":"教2-201",
            "empty_state": "empty",
            "auto_state": true, //true时为智能模式
            "adminName":"洪俊章",
            "address": "https://myblogimgbed.oss-cn-shenzhen.aliyuncs.com/img/empty.png",
            "create_time": "2017-11-09T20:36:26.000Z",
          },
          {
            "id": 1,
            "campusName": "大学城校区",
            "buildingName": "教学二号楼",
            "classroomName":"教2-201",
            "empty_state": "empty",
            "auto_state": true, //true时为智能模式
            "adminName":"洪俊章",
            "address": "https://myblogimgbed.oss-cn-shenzhen.aliyuncs.com/img/empty.png",
            "create_time": "2017-11-09T20:36:26.000Z",
          },
          {
            "id": 1,
            "campusName": "大学城校区",
            "buildingName": "教学二号楼",
            "classroomName":"教2-201",
            "empty_state": "empty",
            "auto_state": true, //true时为智能模式
            "adminName":"洪俊章",
            "address": "https://myblogimgbed.oss-cn-shenzhen.aliyuncs.com/img/empty.png",
            "create_time": "2017-11-09T20:36:26.000Z",
          },
        ],
        total: 6
      }
      }
    },
  components: {
    //面包屑组件
    Breadcrumb
  },
  methods: {
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
    //接受后端数据
    request(){
      var url = this.HOME + '/web_get_state';
      this.$axios({  //this代表vue对象，之前在入口文件中把axios挂载到了vue中，所以这里直接用this.$axios调用axios对象
        method: 'post',
        url: url,
      }).then(function (res) {
        console.log(res);
      }).catch(function (err) {
        console.log(err);
      })
    },
    //发送后端数据
    send(){
      var url = this.HOME + '/web_state';
      this.$axios({  //this代表vue对象，之前在入口文件中把axios挂载到了vue中，所以这里直接用this.$axios调用axios对象
        method: 'post',
        url: url,
        data:this.state
      }).then(function (res) {
        console.log(res);
      }).catch(function (err) {
        console.log(err);
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