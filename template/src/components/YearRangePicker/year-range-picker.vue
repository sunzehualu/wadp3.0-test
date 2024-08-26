<template>
    <el-popover
        ref="popover"
        placement="bottom"
        v-model="showPanel"
        popper-class="custom_year_range"
        trigger="manual"
        @hide="onHide()"
        v-clickoutside="
            () => {
                showPanel = false;
            }
        ">
        <!--弹出层-->
        <div class="_inner floatPanel">
            <div class="_inner leftPanel">
                <div class="_inner panelHead">
                    <i class="_inner el-icon-d-arrow-left" @click="onClickLeft"></i>
                    <span>
                        \{{ leftYearList[0] + '年 ' + '- ' + leftYearList[9] + '年' }}
                    </span>
                </div>
                <div class="_inner panelContent">
                    <div
                        :class="{
                            oneSelected: item === startYear && oneSelected,
                            startSelected: item === startYear,
                            endSelected: item === endYear,
                            betweenSelected: item > startYear && item < endYear,
                        }"
                        v-for="item in leftYearList"
                        :key="item">
                        <a
                            :class="{
                                cell: true,
                                _inner: true,
                                selected: item === startYear || item === endYear
                            }"
                            @click="onClickItem(item)"
                            @mouseover="onHoverItem(item)">
                            \{{ item }}
                        </a>
                    </div>
                </div>
            </div>
            <div class="_inner rightPanel">
                <div class="_inner panelHead">
                    <i class="_inner el-icon-d-arrow-right" @click="onClickRight"></i>
                    <span>\{{ rightYearList[0] + '年 ' + '- ' + rightYearList[9] + '年' }}</span>
                </div>
                <div class="_inner panelContent">
                    <div
                        :class="{
                            startSelected: item === startYear,
                            endSelected: item === endYear,
                            betweenSelected: item > startYear && item < endYear
                        }"
                        v-for="item in rightYearList"
                        :key="item">
                        <a
                            :class="{
                                cell: true,
                                _inner: true,
                                selected: item === endYear || item === startYear
                            }"
                            @click="onClickItem(item)"
                            @mouseover="onHoverItem(item)">
                            \{{ item }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <!--输入框-->
        <div slot="reference">
            <div
                ref="yearPicker"
                @mouseenter="startShowYear && endShowYear && (showClearIcon = true)"
                @mouseleave="showClearIcon = false"
                class="yearPicker el-date-editor el-range-editor el-input__inner el-date-editor--daterange el-range-editor--small">
                <i class="el-input__icon el-range__icon el-icon-date"></i>
                <input
                    class="_inner range_input"
                    ref="inputLeft"
                    type="text"
                    name="yearInput"
                    :placeholder="startPlaceholder"
                    v-model="startShowYear"
                    @focus="onFocus"
                    @keyup="handleInput('start')" />
                <span class="el-range-separator">\{{ sp }}</span>
                <input
                    class="_inner range_input"
                    ref="inputRight"
                    type="text"
                    name="yearInput"
                    :placeholder="endPlaceholder"
                    v-model="endShowYear"
                    @focus="onFocus"
                    @keyup="handleInput('end')" />
                <i
                    v-if="showClearIcon && clearable"
                    class="el-icon-circle-close clearIcon"
                    @click.prevent="onClickClear()"></i>
            </div>
        </div>
    </el-popover>
</template>

<script>
/**
 * 年份选择器组件
 * 功能：
 *  1、提供了一个可自定义的年份选择器
 * 
 */
import moment from 'moment';
import {clickoutside} from '../../directive/clickoutside.js';

// 选中状态，提供给计算属性
const SELECT_STATE = {
    unselect: 0,
    selecting: 1,
    selected: 2
};
export default {
    name: 'yearPicker',
    // 自定义指令
    directives: {clickoutside},
    computed: {
        // 选中一个值,提供给class,用于改变样式
        oneSelected() {
            return (
                this.curState === SELECT_STATE.selecting && (this.startYear === this.endYear || this.endYear == null)
            );
        },
        // 左侧年份取值范围
        leftYearList() {
            return this.yearList.slice(0, 10);
        },
        // 右侧年份取值范围
        rightYearList() {
            return this.yearList.slice(10, 20);
        }
    },
    props: {
        // 两个选项框之间的填充
        sp: {
            default: '至'
        },
        // 绑定值，等于v-model
        value: {
            default: null
        },
        // 左侧选项框占位符
        startPlaceholder: {
            type: String,
            default: '开始年份'
        },
        // 右侧选项框占位符
        endPlaceholder: {
            type: String,
            default: '结束年份'
        },
        // 可清空
        clearable: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // 左侧选项框显示数据
            startShowYear: null,
            // 右侧选项框显示数据
            endShowYear: null,
            // 年份取值范围数组，长度为20
            yearList: [],
            // 显示年份选择表格
            showPanel: false,
            // 左侧选项框选中数据
            startYear: null,
            // 右侧选项框选中数据
            endYear: null,
            // 当前年份，当点击左侧或者右侧的翻页时自动-10或+10
            curYear: 0,
            // 当前选中年份
            curSelectedYear: 0,
            // 选中状态：默认未选中
            curState: SELECT_STATE.unselect,
            // 是否显示清空按钮
            showClearIcon: false,       
        };
    },
    methods: {
        /**
         * 键盘输入事件
         */
        handleInput(type) {
            switch (type) {
                case 'start':
                    if (isNaN(this.startShowYear)) {
                        this.startShowYear = this.startYear;
                        return;
                    }
                    this.startYear = this.startShowYear * 1;
                    break;
                case 'end':
                    if (isNaN(this.endShowYear)) {
                        this.endShowYear = this.endYear;
                        return;
                    }
                    this.endYear = this.endShowYear * 1;
                    break;
            }
            this.startShowYear = this.startYear;
            this.endShowYear = this.endYear;
        },
        /**
         * 弹出层的鼠标移入事件，用于判断可选项
         */
        onHoverItem(iYear) {
            if (this.curState === SELECT_STATE.selecting) {
                const tmpStart = this.curSelectedYear;
                this.endYear = Math.max(tmpStart, iYear);
                this.startYear = Math.min(tmpStart, iYear);
            }
        },
        /**
         * 弹出层年份选中事件
         */
        async onClickItem(selectYear) {
            if (this.curState === SELECT_STATE.unselect || this.curState === SELECT_STATE.selected) {
                this.startYear = selectYear;
                this.curSelectedYear = selectYear;
                this.endYear = null;
                this.curState = SELECT_STATE.selecting;
            } else if (this.curState === SELECT_STATE.selecting) {
                this.endShowYear = this.endYear || this.startYear;
                this.startShowYear = this.startYear;
                this.curState = SELECT_STATE.selected;
                await this.$nextTick();
                this.showPanel = false;
                this.$emit('picker-change', [this.startShowYear, this.endShowYear]);
            }
        },
        /**
         * input获取焦点事件,用于初始化弹出层
         */
        async onFocus() {
            if (this.value?.length) {
                const [first, end] = this.value || [];
                this.startYear = first || null;
                this.endYear = end || null;
                this.curState = SELECT_STATE.selected;
                this.startShowYear = first;
                this.endShowYear = end;
                this.updateYearList();
            }
            await this.$nextTick();
            this.showPanel = true;
        },
        /**
         * 刷新弹出层年份选择范围列表
         */
        updateYearList() {
            const startYear = ~~(this.curYear / 10) * 10 - 10;
            this.yearList = [];
            for (let index = 0; index < 20; index++) {
                this.yearList.push(startYear + index);
            }
        },
        /**
         * 左侧按钮，回退10年
         */
        onClickLeft() {
            this.curYear = this.curYear * 1 - 10;
            this.updateYearList();
        },
        /**
         * 右侧按钮，前进10年
         */
        onClickRight() {
            this.curYear = this.curYear * 1 + 10;
            this.updateYearList();
        },
        /**
         * 清空按钮
         */
        onClickClear() {
            this.startYear = null;
            this.endYear = null;
            this.startShowYear = null;
            this.endShowYear = null;
            this.curState = SELECT_STATE.selected;
            this.curYear = moment().format('yyyy');
            this.updateYearList();
            this.$emit('picker-change', []);
        },
        /**
         * 隐藏弹出框事件
         */
        onHide() {
            this.startYear = null;
            this.endYear = null;
            this.curState = SELECT_STATE.selected;
            this.curYear = moment().format('yyyy');
            this.updateYearList();
        }
    },
    watch: {
        // 绑定值
        value: {
            handler(val) {
                if (val?.length === 0) {
                    return;
                }
                const [first, end] = val || [];
                this.startShowYear = first;
                this.endShowYear = end;
            },
            immediate: true,
            deep: true
        },
        // 左侧选项框显示数据
        startShowYear: {
            handler(val) {
                this.$emit('input', [val, this.endShowYear || '']);
            },
            immediate: true,
            deep: true
        },
        // 右侧选项框显示数据
        endShowYear: {
            handler(val) {
                this.$emit('input', [this.startShowYear || '', val]);
            },
            immediate: true,
            deep: true
        }
    },
    created() {
        const [startYear, endYear] = this.value || [];
        if (startYear) {
            this.startYear = Number(startYear);
            this.endYear = Number(endYear);
            this.curState = SELECT_STATE.selected;
            this.curYear = startYear;
        } else {
            this.curYear = moment().format('yyyy');
        }
        this.updateYearList();
    },
 
    mounted() {
        window.Vue = this;
    }
};
</script>

<style lang="scss">
.custom_year_range {
    .floatPanel {
        > div {
            width: 50%;
        }
        padding: 0 16px;
        display: flex;
        background-color: #fff;
        z-index: 2000;
        border-radius: 4px;
        width: 650px;
        height: 250px;
        top: 40px;
        left: -50px;
        .panelContent {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            height: calc(100% - 70px);
            .oneSelected {
                border-top-right-radius: 24px;
                border-bottom-right-radius: 24px;
            }
            .startSelected {
                background-color: #f2f6fc;
                border-top-left-radius: 24px;
                border-bottom-left-radius: 24px;
            }
            .endSelected {
                background-color: #f2f6fc;
                border-top-right-radius: 24px;
                border-bottom-right-radius: 24px;
            }
            .betweenSelected {
                background-color: #f2f6fc;
            }
            > div {
                width: 75px;
                height: 48px;
                line-height: 48px;
                margin: 3px 0;
                text-align: center;
                a {
                    display: inline-block;
                    cursor: pointer;
                    width: 60px;
                    height: 36px;
                    line-height: 36px;
                    border-radius: 18px;
                    &:hover {
                        text-decoration: none;
                        cursor: pointer;
                    }
                }
                .selected {
                    background-color: #4088fe;
                    color: #fff;
                    &:hover {
                        color: #fff !important;
                    }
                }
            }
        }
        .panelHead {
            position: relative;
            height: 46px;
            line-height: 46px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            span {
                font-size: 16px;
                font-weight: 500;
                padding: 0 5px;
                line-height: 22px;
                text-align: center;
                cursor: pointer;
                color: #606266;
                &:hover {
                    color: #4088fe;
                }
            }
            i {
                position: absolute;
                cursor: pointer;
                &:hover {
                    color: #3e77fc;
                }
            }
        }
        .rightPanel {
            padding-left: 8px;
        }
        .leftPanel .panelHead i {
            left: 20px;
        }
        .rightPanel .panelHead i {
            right: 20px;
        }
    }
    .floatPanel::before {
        content: '';
        height: 100%;
        top: 0;
        position: absolute;
        left: 50%;
        width: 1px;
        border-left: 1px solid #e4e4e4;
    }
    .el-range-separator {
        min-width: 24px;
        border: 1px solid #e4e4e4;
    }
}
</style>

<style lang="scss" scoped>
.yearPicker {
    width: 100% !important;
    input::placeholder{
        color:rgb(189,189,189)
    }
    .range_input {
        appearance: none;
        border: none;
        outline: 0;
        padding: 0;
        width: 40%;
        color: #606266;
        line-height: 1;
        height: 100%;
        margin: 0;
        text-align: center;
        display: inline-block;
        font-size: revert;
    }
    .clearIcon {
        height: 32px;
        line-height: 32px;
        position: absolute;
        right: 8px;
        color: #c0c4cc;
        transition: all 0.3;
    }
    .el-range-separator {
        min-width: 24px;
        font-size:14px;
        line-height: 32px;
    }
}
</style>
