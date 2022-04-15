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
              <img slot="reference" :src="scope.row.state.deep_state.have_person.person_nums === 0 ? require('../../assets/empty.png') : require('../../assets/not_empty.png')" style="width: 30px;height: 30px">
          </template>
        </el-table-column>
        <el-table-column label="智能模式">
          <template v-slot="scope">
            <el-switch v-model="scope.row.state.web_state.web_ctrl" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
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
            <!-- 查看按钮 -->
            <el-tooltip effect="dark" content="查看教室信息" placement="top" :enterable="false">
              <el-button type="success" icon="el-icon-data-analysis" size="mini" @click="showClassroomDetail()"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
          :visible.sync="showClassroomSate"
          width="15%"
      >
        <el-descriptions title="教室信息" :column="1">
          <el-descriptions-item label="湿度" span="1">{{this.classroomData.classroomList[1].state.Humidity}}</el-descriptions-item>
          <el-descriptions-item label="温度">{{this.classroomData.classroomList[1].state.Temperature}}</el-descriptions-item>
          <el-descriptions-item label="火灾情况">{{this.classroomData.classroomList[1].state.fire_state === "safe" ? "安全":"火灾发生" }}</el-descriptions-item>
          <el-descriptions-item label="烟雾情况">{{this.classroomData.classroomList[1].state.smoke_state === "safe" ? "安全":"烟雾危害"}}</el-descriptions-item>
          <el-descriptions-item label="教室总人数">{{this.classroomData.classroomList[1].state.deep_state.have_person.person_nums}}</el-descriptions-item>
        </el-descriptions>
        <span slot="footer" class="dialog-footer">
  </span>
      </el-dialog>
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
    <el-button type="primary" @click="request(1)">请求</el-button>
    <el-button type="primary" @click="send">发送</el-button>
  </div>
</template>

<script>
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
export default {
  name: "Classroom",
  methods: {
    getClassroomList(){
      this.$message.success('获取楼宇列表成功!')
    },
    //测试方法
    test(){
      console.log(this.state)
    },
    //点击按钮查看教室信息
    showClassroomDetail(){
      //点击跳转到详情界面
      //编程式导航实现页面跳转
      this.$router.push('/detail')
      //把对话框弹出
      // this.showClassroomSate = true;
      // this.request();
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
    //接受后端数据
    async request(id){
      var url = this.HOME + '/web_get_state';
      await this.$axios({  //this代表vue对象，之前在入口文件中把axios挂载到了vue中，所以这里直接用this.$axios调用axios对象
        method: 'post',
        url: url,
      }).then(response => (
          // console.log(response.data)
          //修改对应教室的状态
          this.classroomData.classroomList[id].state = response.data
      )).catch(function (err) {
        console.log(err);
      })
      console.log("打印状态")
      console.log(this.classroomData.classroomList[id].state.web_state.web_ctrl)
      console.log("打印人数")
      console.log(this.classroomData.classroomList[id].state.deep_state.have_person.person_nums)
    },
    //发送后端数据
    send(){
      this.state_s.web_state = this.state.web_state;
      var url = this.HOME + '/web_state';
      this.$axios({  //this代表vue对象，之前在入口文件中把axios挂载到了vue中，所以这里直接用this.$axios调用axios对象
        method: 'post',
        url: url,
        data:this.state_s
      }).then(function (res) {
        console.log(res);
      }).catch(function (err) {
        console.log(err);
      })
    },

  },
  //定时器更新state
  async mounted() {
    // this.state = setInterval(()=>this.request(), 1000);
  },
  data(){
    return{
      state_s: {
        web_state:{}
      },
      //查看教室基本信息对话框
      showClassroomSate: false,
      // 获取用户列表的参数对象
      queryInfo: {
        // 搜索值
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每次显示多少条数据
        pagesize: 6
      },
      //校区选项
      campusValue: '',
      //教室的所有状态
      state: {
        //湿度
        Humidity: 11,
        //温度
        Temperature: 11,
        //火灾
        fire_state: "safe",
        //火灾
        smoke_state: "safe",
        //深度学习状态
        deep_state: {
          have_person: {
            //教室人数
            person_nums: 3,
            //1区域有没有人
            area_1: 3,
            area_2: -1,
            area_3: -1,
            area_4: -1
          },
          person_state: {
            //人物状态
            person_1: 0,
            person_2: 0,
            person_3: 0,
            person_4: 0
          }
        },
        web_state: {
          //为0表示智能模式，为1表示网页控制
          web_ctrl: true,
          ctrl_state: {
            light_state: {
              //灯的状态
              light_1: 1,
              light_2: 1,
              light_3: 1,
              light_4: 1
            },
            //风扇状态
            fan_state: 1
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
            "state": {
              //湿度
              Humidity: 3,
              //温度
              Temperature: 3,
              //火灾
              fire_state: "safe",
              //火灾
              smoke_state: "safe",
              //深度学习状态
              "deep_state": {
                have_person: {
                  person_nums: 0,
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
                web_ctrl: false,
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
          },
          {
            "id": 2,
            "campusName": "大学城校区",
            "buildingName": "教学二号楼",
            "classroomName":"教2-201",
            "empty_state": "not_empty",
            "auto_state": true, //true时为智能模式
            "adminName":"洪俊章",
            "address": "https://myblogimgbed.oss-cn-shenzhen.aliyuncs.com/img/not_empty.png",
            "create_time": "2017-11-09T20:36:26.000Z",
            "state": {
              //湿度
              Humidity: 3,
              //温度
              Temperature: 3,
              //火灾
              fire_state: "safe",
              //火灾
              smoke_state: "safe",
              //深度学习状态
              "deep_state": {
                have_person: {
                  person_nums: 0,
                  area_1: -1,
                  area_2: -1,
                  area_3: -1,
                  area_4: -1
                },
                person_state: {
                  person_1: 0,
                  person_2: 0,
                  person_3: 0,
                  person_4: 0
                }
              },
              web_state: {
                web_ctrl: true,
                ctrl_state: {
                  light_state: {
                    light_1: -1,
                    light_2: -1,
                    light_3: -1,
                    light_4: -1
                  },
                  fan_state: -1
                }
              }
            },
          },
          {
            "id": 3,
            "campusName": "大学城校区",
            "buildingName": "教学二号楼",
            "classroomName":"教2-201",
            "empty_state": "empty",
            "auto_state": true, //true时为智能模式
            "adminName":"洪俊章",
            "address": "https://myblogimgbed.oss-cn-shenzhen.aliyuncs.com/img/empty.png",
            "create_time": "2017-11-09T20:36:26.000Z",
            "state": {
              //湿度
              Humidity: 3,
              //温度
              Temperature: 3,
              //火灾
              fire_state: "safe",
              //火灾
              smoke_state: "safe",
              //深度学习状态
              "deep_state": {
                have_person: {
                  person_nums: 0,
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
                web_ctrl: false,
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
          },
          {
            "id": 4,
            "campusName": "大学城校区",
            "buildingName": "教学二号楼",
            "classroomName":"教2-201",
            "empty_state": "empty",
            "auto_state": true, //true时为智能模式
            "adminName":"洪俊章",
            "address": "https://myblogimgbed.oss-cn-shenzhen.aliyuncs.com/img/empty.png",
            "create_time": "2017-11-09T20:36:26.000Z",
            "state": {
              //湿度
              Humidity: 3,
              //温度
              Temperature: 3,
              //火灾
              fire_state: "safe",
              //火灾
              smoke_state: "safe",
              //深度学习状态
              "deep_state": {
                have_person: {
                  person_nums: 0,
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
                web_ctrl: false,
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
          },
          {
            "id": 5,
            "campusName": "大学城校区",
            "buildingName": "教学二号楼",
            "classroomName":"教2-201",
            "empty_state": "empty",
            "auto_state": true, //true时为智能模式
            "adminName":"洪俊章",
            "address": "https://myblogimgbed.oss-cn-shenzhen.aliyuncs.com/img/empty.png",
            "create_time": "2017-11-09T20:36:26.000Z",
            "state": {
              //湿度
              Humidity: 3,
              //温度
              Temperature: 3,
              //火灾
              fire_state: "safe",
              //火灾
              smoke_state: "safe",
              //深度学习状态
              "deep_state": {
                have_person: {
                  person_nums: 0,
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
                web_ctrl: false,
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
          },
          {
            "id": 6,
            "campusName": "大学城校区",
            "buildingName": "教学二号楼",
            "classroomName":"教2-201",
            "empty_state": "empty",
            "auto_state": true , //true时为智能模式
            "adminName":"洪俊章",
            "address": "https://myblogimgbed.oss-cn-shenzhen.aliyuncs.com/img/empty.png",
            "create_time": "2017-11-09T20:36:26.000Z",
            "state": {
              //湿度
              Humidity: 3,
              //温度
              Temperature: 3,
              //火灾
              fire_state: "safe",
              //火灾
              smoke_state: "safe",
              //深度学习状态
              "deep_state": {
                have_person: {
                  person_nums: 0,
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
          },

        ],
        total: 6
      }
      }
    },
  //初始化刷新，此处刷新第二个，写后端应该根据pageSize，pageNum请求到教室id封装List然后通过request来请求State进行封装classroomData
  async created() {
      this.getClassroomList();
      console.log("初始化")
      await this.request(1)
      console.log(this.classroomData.classroomList[1].state)
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