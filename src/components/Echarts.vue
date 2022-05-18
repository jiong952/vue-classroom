<template>
  <el-card class="content">
    <h1>图表</h1>
    <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <div id="main" style="width: 500px;height:300px;"></div>
    <Video></Video>
  </el-card>
<!--  <div>-->
<!--    &lt;!&ndash; 摄像弹窗 &ndash;&gt;-->


<!--  </div>-->
</template>

<script>
import * as echarts from 'echarts'
import Video from "@/components/Video";
export default {
  name: "Echarts",
  data(){
    return{

    }
  },
  mounted() {
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      title: {
        text: '教室日用电量使用情况',
        subtext: '用电量(W)'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {}
        }
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
            lte: 6,
            color: 'green'
          },
          {
            gt: 6,
            lte: 8,
            color: 'red'
          },
          {
            gt: 8,
            lte: 14,
            color: 'green'
          },
          {
            gt: 14,
            lte: 17,
            color: 'red'
          },
          {
            gt: 17,
            color: 'green'
          }
        ]
      },
      series: [
        {
          name: 'Electricity',
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
      ]
    };

    option && myChart.setOption(option);
  }
}
</script>

<style scoped>

</style>