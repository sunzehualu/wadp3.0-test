<template>
    <div class="statusList" style="height:100%;width:100%;">
							<ul class="seTable">
								<li style="width:50px">序号</li>
								<li style="width:90px">操作人员</li>
								<li style="width:100px">日期</li>
								<li style="width:calc(100% - 400px)">系统模块</li>
								<li style="width:90px">操作地址</li>
                <li style="width:70px">类型</li>
							</ul>
							<div id="orderItems" class="outlineBorder">
								<ul class="rolling rolStyle" v-for="(item,index) in list" :key="item.operId">
									<li style="width:50px">\{{index+1}}</li>
									<li style="width:90px">\{{item.operName}}</li>
									<li style="width:100px">\{{item.operTime.slice(0,10)}}</li>
									<li style="width:calc(100% - 400px)">\{{item.title}}</li>
									<li style="width:90px">\{{item.operLocation}}</li>
                  <li style="width:70px">\{{selectDictLabel(typeOptions, item.businessType)}}</li>
								</ul>              
							</div>
		</div>
</template>

<script>
/**
 * 操作监控
 * 功能：
 *  显示用户的操作信息
 */
import { list } from "@/api/monitor/operlog";

export default {
    name:'operationTable',
    props: {},
    components:{},
    data() {
      return {  
        // 类型数据字典
        typeOptions: [],
        // 表格数据
        list: [],   
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 20,
          title: undefined,
          operName: undefined,
          businessType: undefined,
          status: undefined
        },
        timer:null  
      }
    },
    created() {
      this.getList();
      //类型字典
      this.getDicts("sys_oper_type").then(response => {
        this.typeOptions = response.data;
      });
    },
    mounted() {
      let that=this
      this.timer=setInterval(function(){
				that.getList();
			}, 56000)
    },
    methods: {      
      /** 查询操作监控 */
      getList() {
        this.loading = true;
        list(this.queryParams).then( response => {
            this.list = response.rows;
          }
        );
      },      
    }
}
</script>
<style lang="scss" scoped>
.statusList {
 	width: 90%;
 	margin: 0 auto;
 	margin-top: 5px;
 }

.statusList .seTable {
	width: calc(100% + 40px);
	padding-bottom: 0px;
	overflow:  hidden;
  display:  flex;
      margin-left: -40px;
      margin-bottom: 0;
}
.statusList .seTable li {
	float: left;
	width: 16.66%;
	font-size: 15px;
	color: #66dffb;
	background: #143c6994;
	padding: 10px 0;
	margin-right: 6px;
  text-align:  center;
  &:last-of-type{
    margin-right: 0;
  }
}
.statusList .seTable .outlineBorder {
	font-size: 14px;
}
.statusList .outlineBorder ul {
  height: 40px;
  margin: 0;
}
.statusList .outlineBorder ul:nth-child(odd) {
	color: #3e90f7;
}
.statusList .outlineBorder ul:nth-child(even) {
	color: #8ec0ff;
}
.statusList .outlineBorder ul li {
	  float: left;
    width: 16.66%;
    height: 40px;
    line-height: 20px;
    padding: 10px 0;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis; 
    font-size: 12px;
}
.statusList .outlineBorder ul li:first-child {
	font-size: 12px!important;
}
/* 无缝滚动  */
@-webkit-keyframes scrollText1 {
	0%{
		transform: translateY(0px);
  }
  7%{
    transform: translateY(-40px);
  }
  14%{
    transform: translateY(-80px);
  }
  21%{
    transform: translateY(-120px);
  }
  28%{
    transform: translateY(-160px);
  }
  35%{
    transform: translateY(-200px);
  }
  42%{
    transform: translateY(-240px);
  }
  49%{
    transform: translateY(-280px);
  }
  56%{
    transform: translateY(-320px);
  }
  63%{
    transform: translateY(-360px);
  }
  70%{
    transform: translateY(-400px);
  }
  77%{
    transform: translateY(-440px);
  }
  84%{
    transform: translateY(-480px);
  }
  91%{
    transform: translateY(-520px);
  }
  98%{
    transform: translateY(-560px);
  }
}

@keyframes scrollText1 {
  0%{
		transform: translateY(0px);
  }
  7%{
    transform: translateY(-40px);
  }
  14%{
    transform: translateY(-80px);
  }
  21%{
    transform: translateY(-120px);
  }
  28%{
    transform: translateY(-160px);
  }
  35%{
    transform: translateY(-200px);
  }
  42%{
    transform: translateY(-240px);
  }
  49%{
    transform: translateY(-280px);
  }
  56%{
    transform: translateY(-320px);
  }
  63%{
    transform: translateY(-360px);
  }
  70%{
    transform: translateY(-400px);
  }
  77%{
    transform: translateY(-440px);
  }
  84%{
    transform: translateY(-480px);
  }
  91%{
    transform: translateY(-520px);
  }
  98%{
    transform: translateY(-560px);
  }
}
.outlineBorder {
	position: relative;
	width: calc(100% + 40px);
	overflow: hidden;
  height: 230px;
  margin-left: -40px;
}
.rolling {
	top: 0px;
	-webkit-animation:scrollText1 28s infinite  cubic-bezier(1, 0, 0.5, 0);
	animation:scrollText1 28s infinite  cubic-bezier(1, 0, 0.5, 0);
}
.outlineBorder:hover  .rolling {
	animation-play-state:paused;
	-webkit-animation-play-state:paused;
}
li{list-style: none;}
</style>
    