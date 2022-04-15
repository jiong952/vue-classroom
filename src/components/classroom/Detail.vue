<template>
  <div class="box">
    <el-row :gutter="10">
      <el-col :span="11">
        <div>
          <!--动态将图片轮播图的容器高度设置成与图片一致-->
          <el-carousel class="banner" height="550px">
            <!--遍历图片地址,动态生成轮播图-->
            <el-carousel-item v-for="item in img_list" :key="item">
              <img :src="item" alt />
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-col>
      <el-col :span="13">
        <div>
          <!--信息显示区域-->
          <el-card class="content">
            <el-row :gutter="30">
              <!--echarts图表-->
              <el-col :span="24" style="padding-left: 0;padding-right: 0">
                <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
                <div id="main" style="width: 520px;height:250px;"></div>
              </el-col>
              <!--教室设备使用情况-->
              <el-col :span="24">
                <el-descriptions class="descriptions" :column="4" border size="mini">
                  <!--温度湿度-->
                  <el-descriptions-item span="2">
                    <template slot="label" style="font-size: large">
                      <i class="iconfont icon-shidu" style="color: #2381BF"></i>
                      湿度
                    </template>
                    {{this.state.Humidity}}
                  </el-descriptions-item>
                  <el-descriptions-item span="2">
                    <template slot="label">
                      <i class="iconfont icon-shiwen"></i>
                      温度
                    </template>
                    {{this.state.Temperature}}
                  </el-descriptions-item>
                  <!--火灾烟雾情况-->
                  <el-descriptions-item span="2">
                    <template slot="label">
                      <i class="iconfont icon-huozaishigu" style="color:#D90C0C;"></i>
                      火灾情况
                    </template>
                    <el-tag size="mini"
                            :type="this.state.fire_state === ('safe') ? 'success':'danger'">{{this.state.fire_state === ('safe') ? "安全":"火灾危害"}}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item span="2">
                    <template slot="label">
                      <i class="iconfont icon-yanwu"></i>
                      烟雾情况
                    </template>
                    <el-tag size="mini"
                            :type="this.state.smoke_state === ('safe') ? 'success':'danger'">{{this.state.smoke_state === ('safe') ? "安全":"烟雾危害"}}</el-tag>
                  </el-descriptions-item>
                  <!--教室总人数以及智能模式情况-->
                  <el-descriptions-item span="2">
                    <template slot="label">
                      <i class="iconfont icon-zongrenshu"></i>
                      教室总人数
                    </template>
                    {{this.state.deep_state.have_person.person_nums}}
                  </el-descriptions-item>
                  <el-descriptions-item span="2">
                    <template slot="label">
                      <i class="iconfont icon-zongrenshu"></i>
                      智能模式
                    </template>
                    <el-switch
                        v-model="!this.state.web_state.web_ctrl"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="switchChange"
                    >
                    </el-switch>
                  </el-descriptions-item>
                  <!--风扇-->
                  <el-descriptions-item span="4">
                    <template slot="label">
                      <i class="iconfont icon-fengshan" style="color: #1C86E5"></i>
                      风扇
                    </template>
                    <el-tag size="mini"
                            :type="this.state.web_state.ctrl_state.fan_state === -1 ? 'success':'danger'">{{this.state.web_state.ctrl_state.fan_state === -1 ? "关":"开"}}</el-tag>
                  </el-descriptions-item>
                  <!--区域-->
                  <el-descriptions-item span="1">
                    <template slot="label">
                      <i class="el-icon-place" style="color: #1296DB"></i>
                      区域1
                    </template>
                    <el-tag size="mini"
                            :type="this.state.deep_state.have_person.area_1 === -1 ? 'success':'danger'">{{this.state.deep_state.have_person.area_1 === -1 ? "空闲":"有人"}}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item span="1">
                    <template slot="label">
                      <i class="el-icon-place" style="color: #1296DB"></i>
                      区域2
                    </template>
                    <el-tag size="mini"
                            :type="this.state.deep_state.have_person.area_2 === -1 ? 'success':'danger'">{{this.state.deep_state.have_person.area_2 === -1 ? "空闲":"有人"}}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item span="1">
                    <template slot="label">
                      <i class="el-icon-place" style="color: #1296DB"></i>
                      区域3
                    </template>
                    <el-tag size="mini"
                            :type="this.state.deep_state.have_person.area_3 === -1 ? 'success':'danger'">{{this.state.deep_state.have_person.area_3 === -1 ? "空闲":"有人"}}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item span="1">
                    <template slot="label">
                      <i class="el-icon-place" style="color: #1296DB"></i>
                      区域4
                    </template>
                    <el-tag size="mini"
                            :type="this.state.deep_state.have_person.area_4 === -1 ? 'success':'danger'">{{this.state.deep_state.have_person.area_4 === -1 ? "空闲":"有人"}}</el-tag>
                  </el-descriptions-item>
                  <!--灯-->
                  <el-descriptions-item span="1">
                    <template slot="label">
                      <i class="el-icon-s-opportunity" style="color: #FDB813"></i>
                      灯1
                    </template>
                    <el-tag size="mini"
                            :type="this.state.web_state.web_ctrl === true ? this.state.web_state.ctrl_state.light_state.light_1 === -1 ? 'success':'danger' : this.state.deep_state.have_person.area_1 === -1 ? 'success':'danger'">
                      {{this.state.web_state.web_ctrl === true ? this.state.web_state.ctrl_state.light_state.light_1 === -1 ? "关":"开" : this.state.deep_state.have_person.area_1 === -1 ? "关":"开"}}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item span="1">
                    <template slot="label">
                      <i class="el-icon-s-opportunity" style="color: #FDB813"></i>
                      灯2
                    </template>
                    <el-tag size="mini"
                            :type="this.state.web_state.web_ctrl === true ? this.state.web_state.ctrl_state.light_state.light_2 === -1 ? 'success':'danger' : this.state.deep_state.have_person.area_2 === -1 ? 'success':'danger'">
                      {{this.state.web_state.web_ctrl === true ? this.state.web_state.ctrl_state.light_state.light_2 === -1 ? "关":"开" : this.state.deep_state.have_person.area_2 === -1 ? "关":"开"}}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item span="1">
                    <template slot="label">
                      <i class="el-icon-s-opportunity" style="color: #FDB813"></i>
                      灯3
                    </template>
                    <el-tag size="mini"
                            :type="this.state.web_state.web_ctrl === true ? this.state.web_state.ctrl_state.light_state.light_3 === -1 ? 'success':'danger' : this.state.deep_state.have_person.area_3 === -1 ? 'success':'danger'">
                      {{this.state.web_state.web_ctrl === true ? this.state.web_state.ctrl_state.light_state.light_3 === -1 ? "关":"开" : this.state.deep_state.have_person.area_3 === -1 ? "关":"开"}}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item span="1">
                    <template slot="label">
                      <i class="el-icon-s-opportunity" style="color: #FDB813"></i>
                      灯4
                    </template>
                    <el-tag size="mini"
                            :type="this.state.web_state.web_ctrl === true ? this.state.web_state.ctrl_state.light_state.light_4 === -1 ? 'success':'danger' : this.state.deep_state.have_person.area_4 === -1 ? 'success':'danger'">
                      {{this.state.web_state.web_ctrl === true ? this.state.web_state.ctrl_state.light_state.light_4 === -1 ? "关":"开" : this.state.deep_state.have_person.area_4 === -1 ? "关":"开"}}
                    </el-tag>
                  </el-descriptions-item>
                </el-descriptions>
              </el-col>
              <!--按钮-->
              <el-col :span="24">
                <el-button type="primary" @click="control" style="float:left; margin-left: 340px;" size="small">控制</el-button>
                <el-button type="info" @click="exit" style="float:right; margin-right: 15px;" size="small">退出</el-button>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-dialog
        title="控制教室设备"
        :visible.sync="dialogVisible"
        width="50%"
        >
      <el-form ref="form" :model="control_form" label-width="80px">
        <el-form-item label="风扇控制">
          <el-switch v-model="control_form.fan_state" name="fan"></el-switch>
        </el-form-item>
        <el-form-item label="灯光控制">
            <el-checkbox label="灯管1" name="light1" v-model="control_form.light_1"></el-checkbox>
            <el-checkbox label="灯管2" name="light2" v-model="control_form.light_2"></el-checkbox>
            <el-checkbox label="灯管3" name="light3" v-model="control_form.light_3"></el-checkbox>
            <el-checkbox label="灯管4" name="light4" v-model="control_form.light_4"></el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="update">修 改</el-button>
      </span>
    </el-dialog>
  </div>





</template>

<script>
import * as echarts from 'echarts'
export default {
  name: "Detail",
  data(){
    return {
      //封装传给后端
      state_s: {
        web_state:{}
      },
      //教室的所有状态
      state: {
        //湿度
        Humidity: 3,
        //温度
        Temperature: 3,
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
            area_1: -1,
            area_2: 1,
            area_3: 1,
            area_4: 1
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
      //表单
      control_form: {
        fan_state: false,
        light_1: false,
        light_2: false,
        light_3: false,
        light_4: false
      },
      //表单的开关
      dialogVisible:false,
      // 图片父容器高度
      bannerHeight: 1000,
      // 浏览器宽度
      screenWidth: 0,
      img_list: [
          "https://myblogimgbed.oss-cn-shenzhen.aliyuncs.com/img/202204142258426.jpg",
          "https://myblogimgbed.oss-cn-shenzhen.aliyuncs.com/img/202204142258427.jpg",
          "https://myblogimgbed.oss-cn-shenzhen.aliyuncs.com/img/202204142258807.jpg",
          "https://myblogimgbed.oss-cn-shenzhen.aliyuncs.com/img/202204142258808.jpg"
      ],
    }
  },
  methods: {
    switchChange(){
      console.log(this.state.web_state.web_ctrl)
    },
    //点击修改数据按钮弹出修改界面
    async update(){
      await this.$confirm('确认修改？')
          .then(_ => {
            console.log("修改")
            this.send();
            console.log(this.state)
          })
          .catch(_ => {});
      this.dialogVisible = false
    },
    //接受后端数据 id是教室对应的id
    async request(id){
      var url = this.HOME + '/web_get_state';
      await this.$axios({  //this代表vue对象，之前在入口文件中把axios挂载到了vue中，所以这里直接用this.$axios调用axios对象
        method: 'post',
        url: url,
      }).then(response => (
          //修改对应教室的状态
          this.state = response.data
      )).catch(function (err) {
        console.log(err);
      })
      console.log(this.state)
      console.log("打印状态")
      console.log(this.state.web_state.web_ctrl)
      console.log("打印人数")
      console.log(this.state.deep_state.have_person.person_nums)
    },
    //发送后端数据
    async send(){
      this.state.web_state.ctrl_state.fan_state = this.control_form.fan_state === true ? 1: -1;
      this.state.web_state.ctrl_state.light_state.light_1 = this.control_form.light_1 === true ? 1: -1;
      this.state.web_state.ctrl_state.light_state.light_2 = this.control_form.light_2 === true ? 1: -1;
      this.state.web_state.ctrl_state.light_state.light_3 = this.control_form.light_3 === true ? 1: -1;
      this.state.web_state.ctrl_state.light_state.light_4 = this.control_form.light_4 === true ? 1: -1;
      console.log(this.state)
      this.state_s.web_state = this.state.web_state;
      const url = this.HOME + '/web_state';
      await this.$axios({  //this代表vue对象，之前在入口文件中把axios挂载到了vue中，所以这里直接用this.$axios调用axios对象
        method: 'post',
        url: url,
        data:this.state_s
      }).then(function (res) {
        console.log(res);
      }).catch(function (err) {
        console.log(err);
      })
    },
    //调出控制表单
    control(){
      this.control_form.fan_state = this.state.web_state.ctrl_state.fan_state === 1;
      this.control_form.light_1 = this.state.web_state.ctrl_state.light_state.light_1 === 1;
      this.control_form.light_2 = this.state.web_state.ctrl_state.light_state.light_2 === 1;
      this.control_form.light_3 = this.state.web_state.ctrl_state.light_state.light_3 === 1;
      this.control_form.light_4 = this.state.web_state.ctrl_state.light_state.light_4 === 1;
      this.dialogVisible = true;
    },
    //退出到教室详情页
    exit(){
      this.$router.push('/classrooms')
    },
  },
  async mounted() {
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);
    let option;
    option = {
      title: {
        text: '教室日用电量使用情况',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      toolbox: {
        show: true,

      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        // prettier-ignore
        data: ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45']
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} W'
        },
        axisPointer: {
          snap: true
        }
      },
      visualMap: {
        show: false,
        dimension: 0,
        pieces: [
          {
            lte: 7,
            color: 'green'
          },
          {
            gt: 7,
            lte: 10,
            color: 'red'
          },
          {
            gt: 10,
            lte: 12,
            color: 'green'
          },
          {
            gt: 12,
            lte: 14,
            color: 'red'
          },
          {
            gt: 14,
            color: 'green'
          }
        ]
      },
      series: [
        {
          name: '用电量',
          type: 'line',
          smooth: true,
          // prettier-ignore
          data: [50, 0,0, 0, 70,150, 300,650, 700, 750, 670, 400, 640, 750, 700, 500, 600, 620, 300, 130],
          markArea: {
            itemStyle: {
              color: 'rgba(255, 173, 177, 0.4)'
            },
            data: [
              [
                {
                  name: '早高峰',
                  xAxis: '08:45'
                },
                {
                  xAxis: '12:30'
                }
              ],
              [
                {
                  name: '午高峰',
                  xAxis: '15:00'
                },
                {
                  xAxis: '17:30'
                }
              ]
            ]
          }
        }
      ],
      grid: {
        x: 50,
        y: 50,
        x2: 30,
        y2: 35
      },
    };
    option && myChart.setOption(option);
    //定时器
    setInterval(() => {
      this.request();
    }, 2000);

    // //设置表单的数值
    // this.control_form.fan_state = this.state.web_state.ctrl_state.fan_state
    // this.control_form.light_1 = this.state.web_state.ctrl_state.light_state.light_1 === 1;
    // this.control_form.light_2 = this.state.web_state.ctrl_state.light_state.light_2 === 1;
    // this.control_form.light_3 = this.state.web_state.ctrl_state.light_state.light_3 === 1;
    // this.control_form.light_4 = this.state.web_state.ctrl_state.light_state.light_4 === 1;
  },
  //初始化刷新，此处刷新第二个，写后端应该根据pageSize，pageNum请求到教室id封装List然后通过request来请求State进行封装classroomData
  async created() {
    console.log("初始化")
    await this.request(1)
    console.log(this.state)
  },

}
</script>

<style lang="less" scoped>
/deep/.el-main{
  padding-top: 10px;
  padding-left: 5px;
}
/deep/.el-card__body {
  padding-left: 30px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.descriptions{
  margin-bottom: 5px;
}
.el-radio {
  //添加边框
  // border: 1px solid rgb(207, 204, 204);
  //选中时边框的颜色
  &.is-checked {
    // border: 1px solid #28AC5D !important;
  }

  //鼠标滑过改变字体和小圆圈边框的样式
  &:hover {
    border-color: #28AC5D !important;
    // color: #28AC5D !important;
    //鼠标滑过时小圆点边框显示
    .el-radio__inner {
      border-color: #28AC5D;
    }
  }
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.banner{
  width: 520px;
}
img {
  width: 100%;
  height: inherit;
}
.descriptions{
  font-size: small;
}
</style>