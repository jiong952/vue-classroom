<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb name1="设备管理" name2="设备列表" />
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!--echarts图表-->
      <el-row :gutter="10">
        <el-col :span="24" style="padding-left: 0;padding-right: 0">
          <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
          <div id="main" style="width: 550px;height:300px;"></div>
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
import * as echarts from 'echarts'
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
  },
  mounted() {
    //echarts图表
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
  }
}
</script>

<style lang="less" scoped>

</style>