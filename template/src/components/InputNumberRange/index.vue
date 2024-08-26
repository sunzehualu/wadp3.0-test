<template>
  <div>
    <div :class="{ 'is-disabled': disabled }" class="input-number-range">
      <div class="flex">
        <div
          class="from"
          @mouseenter="fromHovering = true"
          @mouseleave="fromHovering = false"
        >
          <el-input-number
            style="width: 90%"
            ref="input_from"
            v-model="userInputForm"
            v-bind="_attr"
            :placeholder="placeholder[0]"
            @blur="handleBlurFrom"
            @focus="handleFocusFrom"
            @input="handleInputFrom"
            @change="handleInputChangeFrom"
          ></el-input-number>
          <!-- 清空按钮 -->
          <span class="input-number__suffix" v-if="showFromClear()">
            <span class="input-number__suffix-inner">
              <i
                v-if="showFromClear()"
                class="el-input__icon el-icon-circle-close el-input__clear"
                @mousedown.prevent
                @click="clearForm"
              ></i>
            </span>
          </span>
        </div>
        <div class="center">
          <span>至</span>
        </div>
        <div
          class="to"
          @mouseenter="toHovering = true"
          @mouseleave="toHovering = false"
        >
          <el-input-number
            style="width: 80%"
            ref="input_to"
            v-bind="_attr"
            v-model="userInputTo"
            :placeholder="placeholder[1]"
            @blur="handleBlurTo"
            @focus="handleFocusTo"
            @input="handleInputTo"
            @change="handleInputChangeTo"
          ></el-input-number>
          <!-- 清空按钮 -->
          <span class="input-number__suffix" v-if="showToClear()">
            <span class="input-number__suffix-inner">
              <i
                v-if="showToClear()"
                class="el-input__icon el-icon-circle-close el-input__clear"
                @mousedown.prevent
                @click="clearTo"
              ></i>
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputNumberRange',
  props: {
    // 初始化范围
    value: { required: true },
    //提示文本
    placeholder: {
      type: Array,
      default: () => ['最小值', '最大值']
    }
  },
  data() {
    return {
      userInputForm: undefined,
      userInputTo: undefined,
      fromHovering: false,
      toHovering: false,
      fromFocused: false,
      toFocused: false
    }
  },
  watch: {
    value: {
      handler(value) {
        /** 初始化范围 */
        if (value instanceof Array) {
          this.userInputForm =
            typeof value[0] === 'number' ? value[0] : undefined
          this.userInputTo = typeof value[1] === 'number' ? value[1] : undefined
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    //暴露原有属性,但过滤出placeholder不传入,强制设置controls不显示
    _attr() {
      const { placeholder, ...others } = this.$attrs
      return {  ...others,controls: false,label: null, }
    },
    //是否禁用
    disabled() {
      return (
        this.$attrs.disabled !== false &&
        Object.keys(this.$attrs).includes('disabled')
      )
    },
    //是否可清空
    clearable() {
      return (
        this.$attrs.clearable !== false &&
        Object.keys(this.$attrs).includes('clearable')
      )
    }
  },
  methods: {
    //显示小值清空按钮
    showFromClear() {
      return (
        this.clearable &&
        !this.disabled &&
        (this.fromFocused || this.fromHovering)
      )
    },
    //显示大值清空按钮
    showToClear() {
      return (
        this.clearable && !this.disabled && (this.toFocused || this.toHovering)
      )
    },
    //清空小值触发方法
    clearForm() {
      this.userInputForm = undefined
      this.$emit('inputFrom', null)
      this.$emit('change', [null, this.userInputTo ?? null])
      this.$emit('changeFrom', null)
      this.$emit('clearForm')
      this.$emit('clear')
    },
    //清空大值触发方法
    clearTo() {
      this.userInputTo = undefined
      this.$emit('inputTo', null)
      this.$emit('change', [this.userInputForm ?? null, null])
      this.$emit('changeTo', null)
      this.$emit('clearTo')
      this.$emit('clear')
    },
    //小值失焦
    handleBlurFrom(event) {
      this.fromFocused = false
      this.$emit('blurFrom', event)
    },
    //小值获取焦点
    handleFocusFrom(event) {
      this.fromFocused = true
      this.$emit('focusFrom', event)
    },
    //大值失焦
    handleBlurTo(event) {
      this.toFocused = false
      this.$emit('blurTo', event)
    },
    //大值获取焦点
    handleFocusTo(event) {
      this.toFocused = true
      this.$emit('focusTo', event)
    },
    //小值输入
    handleInputFrom(value) {
      this.$emit('inputFrom', value ?? null)
    },
    //大值输入
    handleInputTo(value) {
      this.$emit('inputTo', value ?? null)
    },
    // 小值change事件
    handleInputChangeFrom() {
      this.$nextTick(() => {
        // 如果from > to 将from值替换成to
        if (this.userInputForm > this.userInputTo) {
          this.userInputForm = this.userInputTo
        }
        this.$emit('change', [
          this.userInputForm ?? null,
          this.userInputTo ?? null
        ])
        this.$emit('changeFrom', this.userInputForm ?? null)
      })
    },
    // 大值change事件
    handleInputChangeTo() {
      this.$nextTick(() => {
        // 如果to < from 将to值替换成from
        if (this.userInputForm > this.userInputTo) {
          this.userInputTo = this.userInputForm
        }
        this.$emit('change', [
          this.userInputForm ?? null,
          this.userInputTo ?? null
        ])
        this.$emit('changeFrom', this.userInputTo ?? null)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/*取消element原有的input框样式*/
::v-deep .el-input__inner {
  border: 0;
  margin: 0;
  padding: 0 15px;
  background-color: transparent;
  text-align: left;
}

.input-number-range {
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.flex {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  .center {
    margin-top: 0;
    margin-left: 10px;
    margin-right: 10px;
  }
}

.is-disabled {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}
/*清空按钮样式*/
.from .el-input__clear,
.to .el-input__clear {
  color: #c0c4cc;
  width: 15px;
  font-size: 14px;
  cursor: pointer;
  -webkit-transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.from .el-input__clear:hover,
.to .el-input__clear:hover {
  color: #909399;
}

.input-number__suffix-inner {
  position: absolute;
  -webkit-transition: all 0.3s;
  color: #c0c4cc;
}
</style>
