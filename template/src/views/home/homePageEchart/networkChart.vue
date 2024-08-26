<template>
  <div style="height:100%;width:100%;float:center">
    <div id='networkChart' style="height:100%; width:100%;" class="chart"></div>
  </div>
</template>

<script>
/**
 * 模块使用情况柱状图
 * 功能：
 *  显示各个模块的使用情况
 */
import { usage } from "@/api/monitor/logininfor";
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme


export default {
    name:'networkChart',
    data() {
      return {
        //模块使用量
        usageList:[],
        //y轴各模块使用次数
        usage:[],
        //x轴名称
        modular:[],
      }
    },
    created(){
      this.getUsage();
    },
    mounted() {},
    methods: {
      /** 查询模块使用次数 */
      getUsage() {
        this.loading = true;
        usage().then( response => {
          this.usageList = response.data;
          //代码生成、字典数据不显示柱状图(显示页面有点挤)
          this.usageList.splice(2,1)
          this.usageList.splice(6,1)
          this.modular = this.usageList.map(i=>i.modular)
          this.usage = this.usageList.map(i=>i.usage)
          this.myNetworkChart()
        });
      },
      /** 图表初始化 */
      myNetworkChart(){
        var myChart = echarts.init(document.getElementById('networkChart'));
        var data1 =this.usage
        var option = {
          // backgroundColor: '#0C1943',
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(17,95,182,0.5)',
            textStyle: {
              color: "#fff"
            },
            formatter: function (params) {
              var str = '使用情况'
              return str +
                "<div>" +
                "<span style='display:inline-block;border-radius:1px;width:10px;height:10px;background-color:#007AFF;option:0.5'></span>" +
                "<span style=''> " + params[1].name + ': ' + params[1].value + "\n" + ' </span>' +
                "</div>"
            }
          },
          grid: {
            left: '12%',
            right: '12%',
            top: '25%',
            bottom: '12%'
          },
          xAxis: {
            data: this.modular,
            show: true,
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                type: 'solid',
                color: '#2D4377',
                opacity: 1
              }
            },
            // lineStyle: {
            //     show: true,
            //     type: 'solid'
            // },
            axisLabel: {
              interval: 0,
              textStyle: {
                color: 'rgba(255,255,255,0.8)',
                fontSize: 14
              },
              margin: 12 // 刻度标签与轴线之间的距离。
            }

          },
          yAxis: [{
            min: 0,
            max: 150,
            name: '',
            nameTextStyle: {
              align: 'left',
              color: 'rgba(255,255,255,0.8)',
              padding: [0, 0, 0, -20],
              fontSize: 14
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: '#2D4377',
                opacity: 0.5
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#2D4377',
              }
            },
            axisLabel: {
              textStyle: {
                color: 'rgba(255,255,255,0.8)',
                fontSize: 14
              }
            }
          }],
          legend: {
            top: '5%',
            left: '50%',
            textStyle: {
              color: '#fff',
              fontSize: 14
            },

            itemGap: 12 // 设置间距
          },
          series: [
            { // 三个最低下的圆片
              'name': '',
              'type': 'pictorialBar',
              'symbolSize': [20, 10],
              'symbolOffset': [0, 2],
              'z': 12,
              itemStyle: {
                opacity: 1,
                color: function (params) {
                  var a = params.name.slice(0, 2)
                  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#12B9DB' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#007AFF' // 100% 处的颜色
                  }], false)
                }
              },
              'data': [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
            },
            // 下半截柱状图
            {
              type: 'bar',
              barWidth: 20,
              barGap: '-100%',
              itemStyle: { // lenged文本
                opacity: 0.7,
                color: function (params) {
                  var a = params.name.slice(0, 2)
                  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#12B9DB' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#007AFF' // 100% 处的颜色
                  }], false)
                }
              },
              data: data1
            },

            {
              'name': '',
              'type': 'pictorialBar',
              'symbolSize': [20, 12],
              'symbolOffset': [0, -4],
              'z': 5,
              itemStyle: {
                opacity: 1,
                color: function (params) {
                  var a = params.name.slice(0, 2)

                  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#12B9DB' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#007AFF' // 100% 处的颜色
                  }], false)
                }
              },
              'symbolPosition': 'end',
              'data': data1
            },
            {
              "name": "", //头部
              "type": "pictorialBar",
              "symbolSize": [20, 10],
              "symbolOffset": [0, -5],
              "z": 12,
              "symbolPosition": "end",
              itemStyle: {
                color: '#1E44B8',
                opacity: 1,
              },
              "data": [150, 150, 150, 150, 150, 150]
            },
            {
              name: '',
              type: 'bar',
              barWidth: 20,
              barGap: '-100%',
              z: 0,
              itemStyle: {
                color: '#163F7A',
                opacity: .7,
              },
              data: [150, 150, 150, 150, 150, 150]
            }
        ]};
        myChart.setOption(option);
        //根据窗口变化自动调节图表大小
        window.addEventListener("resize", () => {
          if(myChart){
              myChart.resize()
          }
		  	})
      }
    }
}
</script>