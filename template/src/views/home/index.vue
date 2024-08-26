<template>
  <div class="home">
    <div class="header">
      <span class="title_br"></span>
      <img src="../../assets/images/index/index_title.png" style="height:40px"/>
      <span class="title_br" style="margin-left: -7px;"></span>
    </div>
    <div class="content">
      <el-row :gutter="24">
        <el-col :sm="24" :lg="24">
          <el-row :gutter="24">
            <el-col :span="7" style="margin-top:15px;">
              <div>
                <!--左上边框-->
                <div class="t_line_box" style="width: calc(29.1666666667% - 24px);height: 340px;">
                  <i class="t_l_line"></i>
                  <i class="l_t_line"></i>
                </div>
                <!--右上边框-->
                <div class="t_line_box" style="width: calc(29.1666666667% - 24px);height: 340px;">
                  <i class="t_r_line"></i>
                  <i class="r_t_line"></i>
                </div>
                <!--左下边框-->
                <div class="t_line_box" style="width: calc(29.1666666667% - 24px);height: 340px;">
                  <i class="l_b_line"></i>
                  <i class="b_l_line"></i>
                </div>
                <!--右下边框-->
                <div class="t_line_box" style="width: calc(29.1666666667% - 24px);height: 340px;">
                  <i class="r_b_line"></i>
                  <i class="b_r_line"></i>
                </div>
                <el-card class="box-card leftCon">
                  <div slot="header" class="clearfix">
                    <span>日访量</span>
                  </div>
                  <div class="text item">
                    <visitChart ref="visitChart" />
                  </div>
                </el-card>
              </div>
            </el-col>
            <el-col :span="10" style="margin-top:15px;">
              <div>
                <!--左上边框-->
                <div class="t_line_box" style="width: calc(41.6666666667% - 24px);height: 340px;">
                  <i class="t_l_line"></i>
                  <i class="l_t_line"></i>
                </div>
                <!--右上边框-->
                <div class="t_line_box" style="width: calc(41.6666666667% - 24px);height: 340px;">
                  <i class="t_r_line"></i>
                  <i class="r_t_line"></i>
                </div>
                <!--左下边框-->
                <div class="t_line_box" style="width: calc(41.6666666667% - 24px);height: 340px;">
                  <i class="l_b_line"></i>
                  <i class="b_l_line"></i>
                </div>
                <!--右下边框-->
                <div class="t_line_box" style="width: calc(41.6666666667% - 24px);height: 340px;">
                  <i class="r_b_line"></i>
                  <i class="b_r_line"></i>
                </div>
                <el-card class="box-card centerCon">
                  <div slot="header" class="clearfix">
                    <span>操作监控</span>
                  </div>
                  <div class="text item">
                    <operationTable ref="operationTable"/>
                  </div>
                </el-card>
              </div>
            </el-col>
            <el-col :span="7" style="margin-top:15px;">
              <div>
                <!--左上边框-->
                <div class="t_line_box" style="width: calc(29.1666666667% - 24px);height: 340px;">
                  <i class="t_l_line"></i>
                  <i class="l_t_line"></i>
                </div>
                <!--右上边框-->
                <div class="t_line_box" style="width: calc(29.1666666667% - 24px);height: 340px;">
                  <i class="t_r_line"></i>
                  <i class="r_t_line"></i>
                </div>
                <!--左下边框-->
                <div class="t_line_box" style="width: calc(29.1666666667% - 24px);height: 340px;">
                  <i class="l_b_line"></i>
                  <i class="b_l_line"></i>
                </div>
                <!--右下边框-->
                <div class="t_line_box" style="width: calc(29.1666666667% - 24px);height: 340px;">
                  <i class="r_b_line"></i>
                  <i class="b_r_line"></i>
                </div>
                <el-card class="box-card rightCon">
                  <div slot="header" class="clearfix">
                    <span>缓存监控</span>
                  </div>
                  <div class="text item">
                    <dataChart ref="dataChart" />
                  </div>
                </el-card>
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <!--左上边框-->
                <div class="t_line_box" style="width: calc(50% - 24px);height: 340px;">
                  <i class="t_l_line"></i>
                  <i class="l_t_line"></i>
                </div>
                <!--右上边框-->
                <div class="t_line_box" style="width: calc(50% - 24px);height: 340px;">
                  <i class="t_r_line"></i>
                  <i class="r_t_line"></i>
                </div>
                <!--左下边框-->
                <div class="t_line_box" style="width: calc(50% - 24px);height: 344px;">
                  <i class="l_b_line"></i>
                  <i class="b_l_line"></i>
                </div>
                <!--右下边框-->
                <div class="t_line_box" style="width: calc(50% - 24px);height: 344px;">
                  <i class="r_b_line"></i>
                  <i class="b_r_line"></i>
                </div>
                <el-card class="box-card leftBot">
                  <div slot="header" class="clearfix">
                    <span>服务监控</span>
                  </div>
                  <ul class="text item">
                    <monitorChart ref="monitorChart" />
                  </ul>
                </el-card>
              </div>
            </el-col>
            <el-col :span="12" style="padding-left:5px;">
              <div>
                <!--左上边框-->
                <div class="t_line_box" style="width: calc(50% - 24px);height: 340px;">
                  <i class="t_l_line"></i>
                  <i class="l_t_line"></i>
                </div>
                <!--右上边框-->
                <div class="t_line_box" style="width: calc(50% - 17px);height: 340px;">
                  <i class="t_r_line"></i>
                  <i class="r_t_line"></i>
                </div>
                <!--左下边框-->
                <div class="t_line_box" style="width: calc(50% - 24px);height: 344px;">
                  <i class="l_b_line"></i>
                  <i class="b_l_line"></i>
                </div>
                <!--右下边框-->
                <div class="t_line_box" style="width: calc(50% - 17px);height: 344px;">
                  <i class="r_b_line"></i>
                  <i class="b_r_line"></i>
                </div>
                <el-card class="box-card rightBot">
                  <div slot="header" class="clearfix">
                    <span>模块使用情况</span>
                  </div>
                  <ul class="text item">
                    <networkChart ref="networkChart"/>
                  </ul>
                </el-card>
              </div>
            </el-col>
          </el-row>     
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
/**
 * 首页图表
 * 功能：
 *  设置每个图表显示的位置
 */
import echarts from 'echarts';
require('echarts/theme/macarons') 
import networkChart from "@/views/home/homePageEchart/networkChart";
import visitChart from "@/views/home/homePageEchart/visitChart";
import dataChart from "@/views/home/homePageEchart/dataChart";
import monitorChart from "@/views/home/homePageEchart/monitorChart";
import operationTable  from "@/views/home/homePageEchart/operationTable";

export default {
  name: "index",
  components:{echarts,networkChart,visitChart,dataChart,monitorChart,operationTable},
  data() {
    return {
      userId:this.$store.getters.userId,
      zcKq:0,
      ycKq:0,
      cdKq:0,
      ztKq:0,
      kgKq:0,
      qkKq:0,
      ddycKq:0,
      sbycKq:0,
      square:"square",
      percentage: 0,
      colors: [
          {color: '#3a8ee6'}
      ],
    };
  },
};
</script>
<style scoped>
ul{list-style: none;padding: 0;}
.home{background-color: #0C1943;}
.home >>> .el-alert--success.is-light{    background-color: #409eff2e;color: #409eff;}
.home >>> .el-alert__icon{font-size: 38px;width: 38px;}
.home >>> .el-alert__title{font-size: 15px;font-weight: 700;}
.home >>> .el-alert{margin-top: 10px;padding: 10px 16px;}
.header{
  display: flex;
  flex-direction: row;
  /* text-align: center; */
  font-size: 27px;
  color: #ffff;
  font-weight:510;
  height: 80px;
  align-items: center;
} 
.content{
  padding: 20px;
  padding-top: 10px;
}
.leftCon{height:340px;}
.leftCon >>> .el-card__header {
  border-bottom: 0 !important;
  box-sizing: border-box;
    
    width: calc(29.1667% - 24px);
    
}
.centerCon{height:340px;}
.centerCon >>> .el-card__header {
  border-bottom: 0 !important;
  box-sizing: border-box;
  width: calc(41.6667% - 24px);
}
.rightCon{height:340px;}
.rightCon >>> .el-card__header {
  border-bottom: 0 !important;
  box-sizing: border-box;
  width: calc(29.1667% - 24px);
}
.leftBot{height:344px;margin-top: 40px;}
.leftBot >>> .el-card__header {
  border-bottom: 0 !important;
  box-sizing: border-box;
  width: calc(50% - 24px);
}
.rightBot{height:344px;margin-top: 40px;} 
.rightBot >>> .el-card__header {
  border-bottom: 0 !important;
  box-sizing: border-box;
  width: calc(50% - 24px);
}
.el-card {
  border-radius: 4px;
  border: none;
  background-color: #0c1943b0;
  overflow: hidden;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}
.item{height:250px;margin-top: 40px;}
.clearfix{color: #aaddff;font-weight:bold;    display: flex;
    justify-content: center;
    
  }
.title_br{
  width: calc((100% - 803px) / 2 + 7px);
  height: 3px;
  display: inline-block;
  background: #094d8e;
  margin-top: -10px;
    margin-right: -7px;
}
::v-deep .el-card__body{padding: 0 20px 20px 20px !important;height: 100%;}
::v-deep .el-card__header {
  padding: 0;
    background: url('../../assets/images/index/title_bg.png');
    background-size: 334px 45px;
    background-position: center;
    background-repeat: no-repeat;
    height: 45px;
    padding-top: 4px;
    position: absolute;
    margin-top: -20px;
}
</style>
<style lang="scss" scoped>
.clearfix{
  span{
    font-size: 19px;
  }
}
  .l_t_line{
    width: 3px;
    height: 23px;
    left: -1px;
    top: -1px;
  }
  .t_l_line{
    height: 3px;
    width: 20px;
    left: -1px;
    top: -1px;
  }
  .t_line_box {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .t_line_box i{
    background-color: #3DA7F1;
    // box-shadow: 0px 0px 10px #4788fb;
    position: absolute;
  }
  .t_r_line{
    height: 3px;
    width: 20px;
    right: -1px;
    top: -1px;
  }
  .r_t_line{
    width: 3px;
    height: 23px;
    right: -1px;
    top: -1px;
  }
  .l_b_line{
    width: 3px;
    height: 23px;
    left: -1px;
    bottom: -1px;
  }
  .b_l_line{
    height: 3px;
    width: 20px;
    left: -1px;
    bottom: -1px;
  }
  .r_b_line{
    width: 3px;
    height: 23px;
    right: -1px;
    bottom: -1px;
  }
  .b_r_line{
    height: 3px;
    width: 20px;
    right: -1px;
    bottom: -1px;
  }
  .el-card{
    background: rgba(170,221,255,0.01);
    //  background: rgba(11,21,57,0.7);
    border:1px solid #33A2F8;
  }
</style>

