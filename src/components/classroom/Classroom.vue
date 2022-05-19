<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb name1="教室管理" name2="教室列表" />
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="3">
        <!-- 校区选择区域 -->
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <template>
              <el-select v-model="campusValue" filterable clearable placeholder="请选择校区" size="">
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
        <!-- 楼宇选择区域 -->
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <template>
              <el-select v-model="queryInfo.query" filterable clearable placeholder="请选择楼宇" size="">
                <el-option
                    v-for="item in buildingList"
                    :key="item.buildingId"
                    :label="item.buildingName"
                    :value="item.buildingId">
                </el-option>
              </el-select>
            </template>
          </div>
        </el-col>
        <!-- 查询区域 -->
        <el-col :span="4">
          <el-button type="primary" @click="getClassroomList">查询</el-button>
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
            <el-switch v-model="scope.row.state.web_state.web_ctrl"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       active-text="是"
                       inactive-text="否"
                       :inactive-value = true
                       :active-value = false
                       :width=60
                       @change="switchChange($event)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="adminName" label="管理员"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.classroomId)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeClassroomById(scope.row.classroomId)"></el-button>
            </el-tooltip>
            <!-- 查看按钮 -->
            <el-tooltip effect="dark" content="查看教室信息" placement="top" :enterable="false">
              <el-button type="success" icon="el-icon-data-analysis" size="mini" @click="showClassroomDetail()"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
<!--      已废弃-->
<!--      <el-dialog-->
<!--          :visible.sync="showClassroomSate"-->
<!--          width="15%"-->
<!--      >-->
<!--        <el-descriptions title="教室信息" :column="1">-->
<!--          <el-descriptions-item label="湿度" span="1">{{this.classroomData.classroomList[1].state.Humidity}}</el-descriptions-item>-->
<!--          <el-descriptions-item label="温度">{{this.classroomData.classroomList[1].state.Temperature}}</el-descriptions-item>-->
<!--          <el-descriptions-item label="火灾情况">{{this.classroomData.classroomList[1].state.fire_state === "safe" ? "安全":"火灾发生" }}</el-descriptions-item>-->
<!--          <el-descriptions-item label="烟雾情况">{{this.classroomData.classroomList[1].state.smoke_state === "safe" ? "安全":"烟雾危害"}}</el-descriptions-item>-->
<!--          <el-descriptions-item label="教室总人数">{{this.classroomData.classroomList[1].state.deep_state.have_person.person_nums}}</el-descriptions-item>-->
<!--        </el-descriptions>-->
<!--        <span slot="footer" class="dialog-footer">-->
<!--  </span>-->
<!--      </el-dialog>-->
      <!-- 分页 -->
      <el-pagination
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          @size-change="handleSizeChange"
          :page-size="queryInfo.pagesize"
          :page-sizes="[5, 8, 15]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="classroomData.total"
      >
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
export default {
  name: "Classroom",
  methods: {
    //智能模式切换调用send方法
    async switchChange(val) {
      console.log(val)
      console.log(this.$data.state)
      this.state.web_state.web_ctrl = !val;
      console.log("web的状态");
      console.log(this.state.web_state);
      await this.send()
    },
    //初始化获得classroom数据
    async getClassroomList(){
      const { data: res } = await this.$http.get('http://localhost:8088/classroom/get', {
        params: this.queryInfo
      })
      if (res === null) {
        this.$message.error('获取教室列表失败!')
      }
      this.$message.success('获取教室列表成功!')
      console.log(res)
      this.campusList = res.campusList;
      if(res.total === 0){
        this.classroomData.classroomList = []
        this.classroomData.total = 0
      }else {
        this.classroomData.classroomList = res.classroomList
        this.classroomData.total = res.total
      }
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
      this.getClassroomList();
    },
    // 监听 页码值 改变的事件 当前页面值
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getClassroomList();
    },
    //接受后端数据
    async request(){
      console.log("测试")
      console.log(this.$data.state)
      const url = this.HOME + '/web_get_state';
      await this.$axios({  //this代表vue对象，之前在入口文件中把axios挂载到了vue中，所以这里直接用this.$axios调用axios对象
        method: 'post',
        url: url,
      }).then(response => (
          // console.log(response.data)
          //修改对应教室的状态
          this.$data.state = response.data
      )).catch(function (err) {
        console.log(err);
      })
      console.log("打印状态")
      console.log(this.$data.state.web_state.web_ctrl)
      console.log("打印人数")
      console.log(this.$data.state.deep_state.have_person.person_nums)
    },
    //发送后端数据
    async send(){
      this.$data.state_s.web_state = this.$data.state.web_state;
      console.log(this.state)
      const url = this.HOME + '/web_state';
      await this.$axios({  //this代表vue对象，之前在入口文件中把axios挂载到了vue中，所以这里直接用this.$axios调用axios对象
        method: 'post',
        url: url,
        data:this.$data.state_s
      }).then(function (res) {
        console.log(res);
      }).catch(function (err) {
        console.log(err);
      })
    },
    async removeClassroomById(classroomId){
      // 询问用户是否删除教室
      const confirmRusult = await this.$confirm('此操作将永久删除该教室, 是否继续?', '永久删除该教室', {
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

      this.$http.get('http://localhost:8088/classroom/delete',{params:{'classroomId':classroomId}}).then(res => {
        if (res === false) {
          return this.$message.error('该教室删除失败')
        }
        this.$message.success('该教室已经删除')
        this.getClassroomList()
      })
    },

  },
  //定时器更新state
  async mounted() {
    // setInterval(()=>this.request(), 1000);
  },
  data(){
    return{
      //封装返回给后台的state
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
        pagesize: 8
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
      buildingList: [],
      campusList:[],
      //教室数据
      classroomData:{
        classroomList: [],
        total: 5
      }
      }
    },

  //初始化刷新，此处刷新第二个，写后端应该根据pageSize，pageNum请求到教室id封装List然后通过request来请求State进行封装classroomData
  async created() {
      console.log(this.$data.state)
      this.getClassroomList();
      console.log("初始化")
      await this.request()
     },
  components: {
    //面包屑组件
    Breadcrumb
  },
  //监听校区选择框属性动态加载楼宇框
  watch: {
    'campusValue':{
      handler(nval, oval){
        this.queryInfo.query = '';
        for (let i = 0; i < this.$data.campusList.length; i++) {
          if(nval === this.$data.campusList[i].campusId){
            this.$data.buildingList = this.$data.campusList[i].buildingList;
            break;
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
/deep/ .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}
/deep/ .el-switch__label--left {
  z-index: 9;
  left: 25px;
}
/deep/ .el-switch__label--right {
  z-index: 9;
  left: -2px;
}
/deep/ .el-switch__label.is-active {
  display: block;
}
/deep/ .el-switch.is-checked .el-switch__core::after {
  left: 94%;
}
/deep/ .el-switch .el-switch__core,.el-switch .el-switch__label {
  width: 48px !important;
  height: 22px !important;
}
/deep/ .el-switch__core{
  // border-radius:15px;
  &:after{
    width:20px;
    height:20px;
    top:0px;
    // left:3px;
    // z-index:10;
  }
}
/deep/ .el-switch__label.is-active {
  color: #ffffff;
}
</style>