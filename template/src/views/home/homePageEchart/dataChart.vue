<template>
  <div style="height: 100%; width: 100%; float: center">
    <div id="dataChart" style="height: 100%; width: 100%" class="chart"></div>
  </div>
</template>

<script>
/**
 * 缓存监控环状图
 * 功能：
 *  显示已用内存、未用内存所占比例
 */
import * as echarts from "echarts";
import "echarts-gl";
require("echarts/theme/macarons"); // echarts theme
import { getCache } from "@/api/monitor/cache";

export default {
  name: "dataChart",
  props: {},
  components: {},
  data() {
    return {
      //图表
      chart: null, 
      //用来显示的数组
      data:[
        {
          name: '已用内存',
          value: 0
        },
        {
          name: '未用内存',
          value: 0
        }
      ],
      //缓存信息
      cache: [],
      //未用内存
      valueXh:0,
      // 已用内存
      valueSy:0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.findData();
    })
  },
  methods: {
    /** 查询缓存监控(内存)使用 */
    findData() {
      let that = this;
      let max = 1000;
      getCache().then((res) => {
        that.cache = res.data;
        that.valueXh = Number(res.data.info.used_memory_human.slice(0, -1));
        that.valueSy = Number((max - that.valueXh).toFixed(2));
        that.data=[
            {
              name: '已用内存',
              value: Number(res.data.info.used_memory_human.slice(0, -1))
            },
            {
              name: '未用内存',
              value: Number((max - that.valueXh).toFixed(2))
            }
          ]
        this.$nextTick(() => {
          that.mydataChart();
        });
      });
    },
    /**初始化构建*/ 
    mydataChart() {
      this.chart = echarts.init(
          document.getElementById('dataChart')
      )      
      this.chart.setOption({
            backgroundColor: 'rgba(0,0,0,0)',
            tooltip: {
                trigger: 'item',
                formatter: "{b}: <br/>{c}K ({d}%)"
            },
            color: ['#0CA7D6','#72EEF8'],
            series: [{
                name: '资产类别',
                type: 'pie',
                //饼图的扇区是否是顺时针排布
                clockwise: true, 
                //最小的扇区角度（0 ~ 360）
                minAngle: 20, 
                //饼图的中心（圆心）坐标
                center: ['50%', '50%'], 
                //饼图的半径
                radius: [65, 95],
                //是否启用防止标签重叠
                avoidLabelOverlap: true, 
                //图形样式
                itemStyle: {
                    normal: {
                        borderColor: '#1e2239',
                        borderWidth: 2,
                    },
                },
                //标签的位置
                label: { 
                    normal: {
                        show: false,
                        //标签的位置
                        position: 'inside',
                        formatter:  [
                          '{d}%',
                          '{b}',
                        ].join('\n'), // 用\n来换行
                        textStyle: {
                            color: '#fff',
                        }
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            fontWeight: 'bold'
                        }
                    }
                },
                data: this.data
            }, {
                name: '',
                type: 'pie',
                clockwise: true,
                silent: true,
                //最小的扇区角度（0 ~ 360）
                minAngle: 20, 
                //饼图的中心（圆心）坐标
                center: ['50%', '50%'], 
                //饼图的半径
                radius: [0, 50], 
                //图形样式
                itemStyle: { 
                    normal: {
                        borderColor: '#1e2239',
                        borderWidth: 1.5,
                        opacity: 0.21,
                    }
                },
                //标签的位置
                label: { 
                    normal: {
                        show: false,
                    }
                },
                data: this.data
            }]
      }),
      /** 根据窗口变化自动调节图表大小 */
      window.addEventListener("resize", () => {
        if(this.chart){
          this.chart.resize()
        }
      })
    },   
  }
};
</script>
    