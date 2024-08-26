<template>
    <div style="height:100%;width:100%;float:center">
      <div id='monitorChart' style="height:100%; width:100%;" class="chart"></div>
    </div>
</template>

<script>
/**
 * 服务监控
 * 功能：
 *  显示内存、cpu、磁盘的使用情况
 */
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { getServer } from "@/api/monitor/server";

export default {
    name:'monitorChart',
    data() {
      return {
        //图表
        myChart:null,
        // 服务监控信息
        server: [],
        //CPU使用情况
        valueCpu:0,   
        //当前内存统计
        valueUsed:0, 
        // 磁盘使用情况
        valueFile:0,
      }
    },
    mounted() {
        this.findData()
    },
    methods: {
      /** 查询内存、cpu、磁盘的使用情况 */
      findData(){
        let that = this;
        getServer().then(res => {
            that.server = res.data;
            that.valueCpu = res.data.cpu.sys;
            that.valueUsed = res.data.mem.used;
            that.valueFile = res.data.sysFiles[0].free.slice(0,-2);
            this.$nextTick(() => {
                that.myMonitorChart();
            }) 
        })
      },
      /** 图表初始化 */
      myMonitorChart(){
        this.myChart = echarts.init(document.getElementById('monitorChart'));
        var myRate1 = 1000;
        var option = {
            title: [{
                x: "12%",
                bottom:10,
                text: '当前内存统计',
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: 16,
                    color: "#fff"
                },
            }, {
                x: "42%",
                bottom: 10,
                text: 'CPU使用情况',
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: 16,
                    color: "#fff"
                },
            }, {
                x: "73%",
                bottom: 10,
                text: '磁盘使用情况',
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: 16,
                    color: "#fff",
                },
            }],
            tooltip: {
                show: true,
            },
            series: [{
                type: 'gauge',
                center: ['50%', '55%'], // 默认全局居中  
                radius: '55%',
                splitNumber: 10, //刻度数量
                min: 0,
                max: 100,
                startAngle: 200,
                endAngle: -20,
                clockwise: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 2,
                        shadowBlur: 0,
                        color: [
                            [1, '#058ac9']
                        ]
                    }
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: '#058ac9',
                        width: 1
                    },
                    length: -15,
                    splitNumber: 10
                },
                splitLine: {
                    show: true,
                    length: -20,
                    lineStyle: {
                        color: '#058ac9',
                    }
                },
                axisLabel: {
                    distance: -20,
                    textStyle: {
                        color: "#058ac9",
                        fontSize: "12",
                        fontWeight: "bold"
                    }
                },
                pointer: { //仪表盘指针
                    show: 0
                },
                detail: {
                    show: false
                },
                data: [{
                    name: "",
                    value: 100
                }]
            }, {
                startAngle: 200,
                endAngle: -20,
                type: 'gauge',
                center: ['50%', '55%'], // 默认全局居中  
                radius: '50%',
                min: 0,
                max: 1000,
                splitNumber: 0,
                axisLine: { // 坐标轴线  
                    lineStyle: {
                        color: [
                            [0.66, '#dddddd'],
                            [1, '#dddddd']
                        ], // 属性lineStyle控制线条样式  
                        width: 3
                    }
                },
                axisLabel: { // 坐标轴小标记  
                    textStyle: { // 属性lineStyle控制线条样式  
                        fontWeight: 'bolder',
                        fontSize: 16,
                        color: 'rgba(30,144,255,0)',
                    }
                },
                splitLine: { // 分隔线  
                    length: 10, // 属性length控制线长  
                    lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式  
                        width: 0,
                        color: '#444'
                    }
                },
                pointer: { // 分隔线 指针  
                    color: '#666666',
                    width: 0,
                    length: 230
                },
                detail: {
                    show: false
                },

            }, {
                name: 'CPU使用情况',
                type: 'gauge',
                startAngle: 200,
                endAngle: -20,
                radius: '45%',
                // 默认全局居中  
                center: ['50%', '55%'], 

                min: 0,
                max: 100,

                //彩色圈
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 10,
                        shadowBlur: 0,
                        color: [
                            [0.2, '#00FAFC'],
                            [0.4, '#3BD542'],
                            [0.6, '#E3F424'],
                            [0.8, '#7E48DA'],
                            [1, '#E531A8']
                        ]
                    }
                },
                axisTick: {
                    show: false,
                },
                splitLine: {
                    show: false,
                    length: 20,
                },
                axisLabel: {
                    show: false
                },
                pointer: {
                    show: true,
                },
                detail: { 
                    show: true,
                    offsetCenter: [0, '56%'],
                    textStyle: {
                        fontSize: 17,
                        color: "#F9CD40",
                        fontWeight:'bold',
                        padding:[20,0,0,0],
                    },
                    formatter: ['{value} ' + '%'].join('\n'),
                },
                itemStyle: {
                    normal: {
                        color: "#058ac9",
                    }
                },
                data: [{
                    value: this.valueCpu,
                }]
            }, {
                type: 'gauge',
                // 默认全局居中 
                center: ['20%', '55%'],  
                radius: '40%',
                //刻度数量
                splitNumber: 10, 
                min: 0,
                max: 1000,
                endAngle: 45,
                clockwise: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 2,
                        shadowBlur: 0,
                        color: [
                            [1, '#058ac9']
                        ]
                    }
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: '#058ac9',
                        width: 1
                    },
                    length: -15,
                    splitNumber: 10
                },
                splitLine: {
                    show: true,
                    length: -20,
                    lineStyle: {
                        color: '#058ac9',
                    }
                },
                axisLabel: {
                    distance: -20,
                    textStyle: {
                        color: "#058ac9",
                        fontSize: "11",
                        fontWeight: "bold"
                    }
                },
                //仪表盘指针
                pointer: { 
                    show: 0
                },
                detail: {
                    show: false
                },
                data: [{
                    name: "",
                    value: myRate1
                }]
            }, {
                type: 'gauge',
                // 默认全局居中 
                center: ['20%', '55%'],  
                radius: '35%',
                min: 0,
                max: 1000,
                endAngle: 45,
                splitNumber: 0,
                 // 坐标轴线  
                axisLine: {
                    // 属性lineStyle控制线条样式  
                    lineStyle: {
                        color: [
                            [0.66, '#dddddd'],
                            [1, '#dddddd']
                        ], 
                        width: 3
                    }
                },
                // 坐标轴小标记  
                axisLabel: { 
                    textStyle: {   
                        fontWeight: 'bolder',
                        fontSize: 16,
                        color: 'rgba(30,144,255,0)',
                    }
                }, 
                // 分隔线 
                splitLine: { 
                    // 属性length控制线长
                    length: 10,   
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    lineStyle: {   
                        width: 0,
                        color: '#444'
                    }
                },
                // 分隔线 指针 
                pointer: {  
                    color: '#666666',
                    width: 0,
                    length: 230
                },
                detail: {
                    show: false
                },
            }, {
                name: '当前内存统计',
                type: 'gauge',
                endAngle: 45,
                radius: '30%',
                // 默认全局居中  
                center: ['20%', '55%'], 

                min: 0,
                max: 1000,

                //彩色圈
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 8,
                        shadowBlur: 0,
                        color: [
                            [0.2, '#00FAFC'],
                            [0.4, '#3BD542'],
                            [0.6, '#E3F424'],
                            [0.8, '#7E48DA'],
                            [1, '#E531A8']
                        ]
                    }
                },
                axisTick: {
                    show: false,
                },
                splitLine: {
                    show: false,
                    length: 20,
                },
                axisLabel: {
                    show: false
                },
                pointer: {
                    show: true,
                },
                detail: {
                    show: true,
                    offsetCenter: [0, '90%'],
                    textStyle: {
                        fontSize: 17,
                        color: "#02c3f1",
                        fontWeight:'bold',
                        padding:[20,0,0,0]
                    },
                    formatter: ['{value} ' + 'G'].join('\n'),
                },
                itemStyle: {
                    normal: {
                        //指针颜色
                        color: "#058ac9",
                    }
                },
                data: [{
                    value: this.valueUsed
                }]
            }, {
                type: 'gauge',
                // 默认全局居中  
                center: ['80%', '55%'], 
                radius: '40%', 
                //刻度数量
                splitNumber: 10,
                min: 0,
                max: 1000,
                startAngle: 140,
                endAngle: -45,
                clockwise: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 2,
                        shadowBlur: 0,
                        color: [
                            [1, '#058ac9']
                        ]
                    }
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: '#058ac9',
                        width: 1
                    },
                    length: -15,
                    splitNumber: 10
                },
                splitLine: {
                    show: true,
                    length: -20,
                    lineStyle: {
                        color: '#058ac9',
                    }
                },
                axisLabel: {
                    distance: -20,
                    textStyle: {
                        //表盘一圈数字颜色
                        color: "#058ac9",
                        fontSize: "11",
                        fontWeight: "bold"
                    }
                },
                //仪表盘指针
                pointer: { 
                    show: 0
                },
                detail: {
                    show: false
                },
                data: [{
                    name: "",
                    value: myRate1
                }]
            }, {
                type: 'gauge',
                // 默认全局居中  
                center: ['80%', '55%'], 
                radius: '35%',
                min: 0,
                max: 1000,
                startAngle: 140,
                endAngle: -45,
                splitNumber: 0,
                // 坐标轴线  
                axisLine: { 
                    // 属性lineStyle控制线条样式
                    lineStyle: {
                        color: [
                            [0.66, '#dddddd'],
                            [1, '#dddddd']
                        ],   
                        width: 3
                    }
                },

                // 坐标轴小标记  
                axisLabel: { 
                    textStyle: { 
                        fontWeight: 'bolder',
                        fontSize: 16,
                        color: 'rgba(30,144,255,0)',
                    }
                },
                // 分隔线
                splitLine: {    
                    // 属性length控制线长 
                    length: 10, 
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    lineStyle: {   
                        width: 0,
                        color: '#444'
                    }
                },
                // 分隔线 指针  
                pointer: { 
                    color: '#666666',
                    width: 0,
                    length: 230
                },
                detail: {
                    show: false
                },
            }, {
                name: '硬盘使用情况',
                type: 'gauge',
                startAngle: 140,
                endAngle: -45,
                radius: '30%',
                // 默认全局居中  
                center: ['80%', '55%'], 

                min: 0,
                max: 1000,
                
                //彩色圈
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 8,
                        shadowBlur: 0,
                        color: [
                            [0.2, '#00FAFC'],
                            [0.4, '#3BD542'],
                            [0.6, '#E3F424'],
                            [0.8, '#7E48DA'],
                            [1, '#E531A8']
                        ]
                    }
                },
                axisTick: {
                    show: false,

                },
                splitLine: {
                    show: false,
                    length: 20,
                },

                axisLabel: {
                    show: false
                },
                pointer: {
                    show: true,
                },
                detail: {
                    show: true,
                    offsetCenter: [0, '90%'],
                    textStyle: {
                        fontSize: 17,
                        color: "#02c3f1",
                        fontWeight:'bold',
                        padding:[20,0,0,0]
                    },
                    formatter: ['{value} ' + 'G'].join('\n'),
                },
                itemStyle: {
                    normal: {
                        //指针颜色
                        color: "#058ac9", 
                    }
                },
                data: [{
                    value:this.valueFile
                }]
            }]
        };
        this.myChart.setOption(option);
        //根据窗口变化自动调节图表大小
        window.addEventListener("resize", () => {
            if(this.myChart){
                this.myChart.resize()
            }
        })
      }
    }
}
</script>
    