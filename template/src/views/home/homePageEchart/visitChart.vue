<template>
  <div style="height:100%;width:100%;float:center">
    <div id='visitChart' style="height:100%; width:100%;" class="chart"></div>
  </div>
</template>

<script>
/**
 * 日访折线图
 * 功能：
 *  显示7天内用户的访问次数
 */
import { visits } from "@/api/monitor/logininfor";
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme

export default {
  name:'visitChart',
  props: {},
  components:{},
  data() {
    return {
      //数据
      visitsList:[],
      //x轴
      xDay:[],
      //y轴
      visits:[],
    }
  },
  created(){
    this.getVisits();
  },
  methods: {
    /** 查询访问量 */
    getVisits() {
      this.loading = true;
      visits().then( response => {
        this.visitsList = response.data.reverse();
        this. xDay = this.visitsList.map(i=>i.day)
        this.visits = this.visitsList.map(i=>i.visits)
        this.myvisitChart()
        }
      );
    },
    /** 图表初始化 */
    myvisitChart(){
      var myChart = echarts.init(document.getElementById('visitChart'));
      let dataT = this.visits
      var option = {
      color: ['#0C65F6', '#00D68A'],
      tooltip: {
          confine: true,
      },
      grid: {
          left: '2%',
          right: '4%',
          bottom: '5%',
          top: '30px',
          containLabel: true,
      },
      xAxis: {
          name:'(日期)',
          type: 'category',
          axisLine: {
            lineStyle: {
                color: '#26294F',
            },
          },
          nameTextStyle: {
            fontSize: 12,
            color: '#6A93B9',
            align: 'right',
          },
          axisLabel: {
          // interval:0,
          rotate: 30,//倾斜
          fontSize: 12,
          color: '#6A93B9',
          },
          axisTick: {
          show: false,
          },
          data: this. xDay,
      },
      yAxis: {
          name:'(人数)',
          type: 'value',
          min: 0,
          minInterval: 1,
          nameTextStyle: {
          fontSize: 12,
          color: '#6A93B9',
          align: 'center',
          },
          splitLine: {
          lineStyle: {
              color: '#26294F',
              // type: 'dashed', // dotted 虚线
          },
          },
          splitArea: { show: false },
          axisLine: {
            lineStyle: {
                color: '#26294F',
            },
          },
          axisTick: {
          show: false,
          },
          axisLabel: {
          fontSize: 12,
          fontFamily: 'Bebas',
          color: '#6A93B9',
          },
      },
      series: [
          {
          name: '回访数量',
          type: 'bar',
          barWidth: '2',
          itemStyle: {
              normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                  offset: 0,
                  color: '#29acff',
                  },

                  {
                  offset: 1,
                  color: 'rgba(0, 0, 0, 0.1)',
                  },
              ]),
              barBorderRadius: 6,
              },
          },
          data: dataT
          },
          {
          smooth: false, //平滑曲线显示
          showAllSymbol: true, //显示所有图形。
          symbol: "circle", //标记的图形为实心圆
          symbolSize: 5, //标记的大小
          itemStyle: {
              //折线拐点标志的样式
              normal: {
              color: "#29acff",
              borderWidth: 5,
              shadowColor: "#29acff",
              shadowBlur: 10,
              borderColor: "#29acff"
              }
              // color: "#FEBE36",
              // borderWidth: 3,
              // borderColor: "rgba(255,255,255,0.5)"
          },


          type: 'line',
          // showSymbol: false,
          smooth: true,
          name: '访问', // 图例对应类别
          data: dataT, // 纵坐标数据
          barWidth: 2,
          areaStyle: { // 区域颜色
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(12, 101, 246, 0.6)',
              }, {
              offset: 1,
              color: 'rgba(12, 101, 246, 0.1)',
              }]),
          },

          },
      ],
      };
      myChart.setOption(option);
      //根据窗口变化自动调节图表大小
      window.addEventListener("resize", () => {
        if(myChart){
          myChart.resize()
        }
      });
    }
  }
}
</script>
<style scoped>

</style>
