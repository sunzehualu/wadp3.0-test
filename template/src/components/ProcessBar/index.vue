<template>
  <div>
    <!-- 线型进度条 -->
    <div v-if="type === 'line'" style="display: flex; border-radius: 8px">
      <div
        id="ProcessBar"
        class="pB_Container"
        :style="{ height: lineWidth + 'px' }"
      >
        <!-- 已完成进度部分 -->
        <div
          class="first"
          :style="{ width: error, backgroundColor: color }"
          :class="{ firstVal: processValue[0] == 0 }"
        ></div>
        <!-- 未完成进度部分 -->
        <div
          class="second"
          :style="{ width: cancel, backgroundColor: bgColor }"
          :class="{ secondVal: processValue[1] == 0 }"
        >
          <!-- 未完成进度部分 -->
          <span
            v-if="processValue[1] > 18 && lineVisable"
            style="color: brown"
            >\{{ getProcessDesc(processValue[1]) }}</span
          >
        </div>
        <span
          v-if="processValue[1] <= 18 && processValue[0] < 82 && lineVisable"
          style="color: brown"
          >\{{ getProcessDesc(processValue[1]) }}</span
        >
      </div>
      <!-- 未完成进度值 -->
      <div
        class="brownNum"
        style="margin-left: 5px; line-height: 15px; color: brown"
      >
        <span v-if="processValue[1] <= 18 && processValue[0] >= 82">\{{
          getProcessDesc(processValue[1])
        }}</span>
      </div>
      <!-- 已完成进度值 -->
      <div class="shouldNum" style="line-height: 15px">
        \{{ getProcessDesc(processValue[0]) }}
      </div>
    </div>
    <!-- 环形进度条 -->
    <div v-else-if="type === 'circle'">
      <el-progress
        type="circle"
        :percentage="processValue"
        :status="status"
        :stroke-width="strokeWidth"
        :color="color"
      ></el-progress>
    </div>
  </div>
</template>

<script>
/**
 * 进度条组件
 * 功能：用于展示操作进度，告知用户当前状态和预期，类型分线型进度条line和环形进度条circle
 */
export default {
  name: 'ProcessBar',
  props: {
    // 进度条值 processValue[0]当前进度 processValue[1]未完成进度
    processValue: {
      type: Array,
      default: () => [0]
    },
    //进度条类型
    type: {
      type: String,
      default: 'line'
    },
    // 进度条颜色
    color: {
      type: String,
      default: ''
    },
    //背景色,未完成进度颜色
    bgColor: {
      type: String,
      default: ''
    },
    //环形进度条状态
    status: {
      type: String,
      default: ''
    },
    //线型进度条宽度
    lineWidth: {
      type: Number,
      default: 12
    },
    //环形进度条宽度
    strokeWidth: {
      type: Number,
      default: 8
    },
    //是否显示未完成数值
    lineVisable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      //线型进度条已完成长度
      error: this.processValue[0] + '%',
      //线型进度条未完成长度
      cancel: this.processValue[1] + '%'
    }
  },
  methods: {
    /**
      将进度条数值转为完成进度长度
     */
    getProcessDesc(data) {
      return data == 0 ? ' ' : data + '%'
    }
  }
}
</script>

<style scoped>
.pB_Container {
  font-size: 10px;
  width: 100%;
  background-color: #f5f5f5;
  height: 10px;
  display: inline-flex;
  line-height: 12px;
  text-align: right;
  overflow: hidden;
  color: white;
  box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  flex: 72;
}
.brownNum {
  flex: 14;
}
.shouldNum {
  flex: 14;
}
.pB_Container div {
  float: left;
  /* border-radius: 8px; */
}
.first {
  background-color: #409eff;
  padding-right: 10px;
}
.firstVal {
  padding-right: 0px !important;
}
.second {
  background-color: rgba(0, 0, 0, 0.1);
  padding-right: 10px;
}
.secondVal {
  padding-right: 0px !important;
}
.third {
  background-color: #7ea6e0;
  padding-right: 10px;
}
.last {
  background-color: white;
  padding-right: 10px;
}
@media screen and (max-device-height: 1070px) {
  .pB_Container {
    flex: 68;
  }
  .brownNum {
    flex: 9;
  }
  .shouldNum {
    flex: 23;
  }
}
</style>
